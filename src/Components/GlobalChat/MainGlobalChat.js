import React, {useState, useEffect, useRef} from "react"
import {Avatar, Button, Chip, IconButton, Tooltip} from "@material-ui/core"
import SendIcon from "@material-ui/icons/Send"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import Picker from "emoji-picker-react"

import {useHistory} from "react-router-dom"
import axios from "axios"

import {io} from "socket.io-client"
import {useConfirm} from "material-ui-confirm"
import {isAutheticated} from "../../auth"

let socket

function MainGlobalChat({roomID}) {
	const [room, setRoom] = useState({
		name: "",
		admin: false,
	})
	const [message, setMessage] = useState("")
	const [timeout, setSTimeout] = useState(undefined)
	const confirm = useConfirm()

	const getRole = isAutheticated().roleId
	const userID = isAutheticated().username

	const [isTyping, setIsTyping] = useState({
		typing: false,
		message: "",
	})

	// const [agents, setAgents] = useState([])
	// const [showAssign, setshowAssign] = useState(false)
	const [messages, setMessages] = useState([])
	const lastElement = useRef(null)
	const [responses, setResponses] = React.useState([])

	const [showPicker, setShowPicker] = useState(false)

	const onEmojiClick = (event, emojiObject) => {
		setMessage((prevInput) => prevInput + emojiObject.emoji)
		setShowPicker(false)
	}

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)

		if (roomID) {
			socket.emit("JOIN_NONROOM", {roomID, isAgent: getRole !== 3 ? userID : "admin"}, (error) => {
				if (error) alert(error)
			})
		}
		return () => {
			removeListners()
		}
	}, [])

	useEffect(() => {
		if (roomID) {
			console.log("reloadingngngn")
			axios.get(`${process.env.REACT_APP_API_KEY}/nonroom/${roomID}`).then(({data}) => {
				const allMsgs = data.messages

				setRoom({
					name: data.username,
					admin: data.admin,
					country: data.country,
				})

				if (allMsgs) {
					setMessages(allMsgs)
				}
			})
		}
	}, [])

	useEffect(() => {
		lastElement.current.scrollIntoView({behavior: "smooth"})
	}, [messages, isTyping])
	useEffect(() => {
		if (roomID) {
			socket.on("messageToNonRoomFromBot", ({role, message, username}) => {
				setIsTyping({
					typing: false,
					message: "",
				})
				setMessages((prevState) => {
					const oldState = [...prevState]
					oldState.push({
						message,
						role,
						username,
						createdAt: new Date(),
					})
					return oldState
				})
			})

			socket.on("non-user-typing", ({username, message, typing}) => {
				setIsTyping({
					typing,
					message,
				})
			})
			socket.on("messageToNonRoomFromAdmin", ({role, message, username}) => {
				console.log(message)
				setMessages((prevState) => {
					const oldState = [...prevState]
					oldState.push({
						message,
						username,
						role,
						createdAt: new Date(),
					})
					return oldState
				})
			})
		}
		return () => {
			removeListners()
		}
	}, [])

	const sendMessage = (e) => {
		e.preventDefault()

		if (!message) {
			return
		}
		handelSendMessage(message)

		setMessage("")
	}

	const handelSendMessage = (message) => {
		console.log(message)
		const role = getRole === 3 ? 3 : 4
		socket.emit(
			"messageFromNonRoomAdmin",
			{roomID, message, isSuperAdmin: getRole === 3, username: userID},
			(error) => {
				if (error) {
					alert(JSON.stringify(error))
				}
			}
		)

		setMessages((prevState) => {
			let newState = [...prevState]
			newState.push({
				message: message,
				role,
				username: userID,
				createdAt: new Date(),
			})
			return newState
		})
	}

	const typingTimeout = () => {
		console.log("stoped Typing")
		socket.emit("non-agent-typing", {roomID, username: userID, typing: false}, (error) => {
			if (error) {
				alert(JSON.stringify(error))
			}
		})
	}

	const handelChange = (e) => {
		let ftime = undefined
		socket.emit("non-agent-typing", {roomID, username: userID, typing: true}, (error) => {
			if (error) {
				alert(JSON.stringify(error))
			}
		})
		clearTimeout(timeout)
		ftime = setTimeout(typingTimeout, 2000)
		setSTimeout(ftime)

		setMessage(e.target.value)
	}
	const removeListners = () => {
		console.log("Global Main CHAT")

		setIsTyping({
			typing: false,
			message: "",
		})
		socket.removeAllListeners()
	}
	const deleteNonChat = async () => {
		confirm({
			description: "Do you Really want to Delete!",
			confirmationText: "Yes! delete",
		}).then(async () => {
			try {
				await axios.post(`${process.env.REACT_APP_API_KEY}/deleteNonChat`, {
					roomID,
				})
				// go back
			} catch (error) {
				console.log(error)
			}
		})
	}
	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_API_KEY}/getNonChatConfig`)
			.then(({data}) => {
				const {responseMessages} = data[0]
				setResponses(responseMessages)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	return (
		<div className="chat">
			<div className="chat_header">
				<Avatar
					style={{
						backgroundColor: `#222831`,
					}}
				>
					{" "}
					{room.name.substr(0, 1)}
				</Avatar>
				<div className="chat_headerInfo" style={{position: "relative"}}>
					<h3 className="chat-room-name">{room.name}</h3>
					{room.country && (
						<span style={{fontSize: "0.7rem", position: "absolute", top: 25}}>
							{room?.country?.city}, {room?.country?.region}, {room?.country?.country_name}
						</span>
					)}
					<p style={{color: "#16e35e"}}>{isTyping.typing ? "typing ..." : ""}</p>
				</div>

				<div className="chat_headerRight">
					<Button
						variant="contained"
						color="secondary"
						style={{
							backgroundColor: "#E84545",
						}}
						onClick={deleteNonChat}
						size="small"
					>
						Delete Chat
					</Button>
				</div>
			</div>
			<div
				className="chat_body"
				style={{minHeight: "calc(100vh - 280px)", maxHeight: "calc(100vh - 280px)"}}
			>
				{messages.map((message, idx) => (
					<div className="chat__message-body" key={idx}>
						{getRole !== 3 ? (
							<p className={`chat_message ${message.role === 4 ? "chat_receiver" : "user"}`}>
								{(message.role === 0 || message.role === 3) &&
									(message.role === 0 ? (
										<span className="chat_name">{message.username} </span>
									) : (
										<span className="chat_name">{message.username} </span>
									))}
								{message.message}
								<span className="chat_timestemp">
									{new Date(message.createdAt).toLocaleString()}
								</span>
							</p>
						) : (
							<p className={`chat_message ${message.role === 3 ? "chat_receiver" : "user"}`}>
								{(message.role === 0 || message.role === 4) &&
									(message.role === 0 ? (
										<span className="chat_name">{message.username}</span>
									) : (
										<span className="chat_name">{message.username}</span>
									))}
								{message.message}
								<span className="chat_timestemp">
									{new Date(message.createdAt).toLocaleString()}
								</span>
							</p>
						)}

						{(message.role === 4 && getRole !== 3) || (message.role === 3 && getRole === 3) ? (
							<span className="message__arrow--admin">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13">
									<path
										opacity=".13"
										d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"
									></path>
									<path
										fill="#dcf8c6"
										d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
									></path>
								</svg>
							</span>
						) : (
							<span className="message__arrow--user">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13">
									<path
										opacity=".13"
										fill="#fff"
										d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"
									></path>
									<path
										fill="#fff"
										d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"
									></path>
								</svg>
							</span>
						)}
					</div>
				))}

				{isTyping.message && (
					<p
						className={`chat_message user`}
						style={{
							background: "#ffa8a8",
							marginBottom: 30,
						}}
					>
						<span className="chat_name">{room.name}</span>
						{isTyping.message}
					</p>
				)}
				{!!responses && (
					<div
						style={{
							padding: "15px 5px",
							overflowX: "auto",
							display: "flex",
							justifyContent: "flex-start",
							gap: "10px",
						}}
					>
						{responses.map((el, idx) => {
							let resp = el.split("~")
							let message = resp.length > 1 ? resp[1] : resp[0]
							return (
								<Tooltip title={message} placement="top">
									<Chip
										label={resp[0]}
										key={idx}
										variant="outlined"
										onClick={() => {
											// handelSendMessage(message)
											setMessage(message)
										}}
										style={{
											maxWidth: "300px",
											cursor: "pointer",
										}}
									/>
								</Tooltip>
							)
						})}
					</div>
				)}
				<div ref={lastElement}></div>
			</div>
			<div className="chat_footer">
				<InsertEmoticonIcon
					style={{cursor: "pointer"}}
					onClick={() => setShowPicker((val) => !val)}
				/>
				{showPicker && <Picker pickerStyle={{width: "100%"}} onEmojiClick={onEmojiClick} />}
				<form onSubmit={sendMessage}>
					{/* <input
						value={message}
						onChange={handelChange}
						type="text"
						style={{
							outline: "none",
						}}
						placeholder="Type a message"
					/> */}
					<textarea
						value={message}
						onChange={handelChange}
						type="text"
						style={{
							outline: "none",
						}}
						placeholder="Type a message"
					></textarea>
				</form>{" "}
				<IconButton onClick={sendMessage}>
					<SendIcon />
				</IconButton>
			</div>
		</div>
	)
}

export default MainGlobalChat
