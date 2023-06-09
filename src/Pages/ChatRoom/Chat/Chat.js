import React, {useState, useEffect, useRef} from "react"
import {Avatar, IconButton, TextField} from "@material-ui/core"
import {AttachFile, MoreVert, SearchOutlined} from "@material-ui/icons"
import SendIcon from "@material-ui/icons/Send"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import "./Chat.css"
import {useHistory, useParams} from "react-router-dom"
import axios from "axios"

import {io} from "socket.io-client"
import {isAutheticated} from "../../../auth"
import {fi} from "date-fns/locale"
import PersonAddIcon from "@material-ui/icons/PersonAdd"
import {Autocomplete} from "@material-ui/lab"
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled"
let socket

function Chat() {
	const {roomID} = useParams()
	const [roomName, setRoomName] = useState("")
	const [message, setMessage] = useState("")
	const [timeout, setSTimeout] = useState(undefined)
	const [user, setUser] = useState(null)

	const getRole = isAutheticated().roleId
	const userID = isAutheticated().userId

	const [isTyping, setIsTyping] = useState({
		typing: false,
		message: "",
	})

	const [agents, setAgents] = useState([])
	const [showAssign, setshowAssign] = useState(false)
	const [messages, setMessages] = useState([])
	const lastElement = useRef(null)
	const chatInput = useRef(null)
	const history = useHistory()
	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)

		if (roomID) {
			socket.emit(
				"JOIN_ROOM",
				{roomID, isAdmin: true, isAgent: getRole !== 3 ? userID : null},
				(error) => {
					if (error) alert(error)
				}
			)
		}
		return () => {
			removeListners()
		}
	}, [roomID])

	const removeListners = () => {
		console.log("clean up done")

		setIsTyping({
			typing: false,
			message: "",
		})
		socket.removeAllListeners()
	}
	// const scrollToBottom = () => {
	// 	lastElement.current?.scrollIntoView({behavior: "smooth"})
	// }
	useEffect(() => {
		if (roomID) {
			axios.get(`${process.env.REACT_APP_API_KEY}/rooms/${roomID}`).then(({data}) => {
				const name = data.userID
				const allMsgs = data.messages

				if (name) {
					setRoomName(name)
					axios.get(`${process.env.REACT_APP_API_KEY}/getAdminById/${name}`).then((data) => {
						if (data.status === 200) {
							setUser(data.data)
						}
					})
				}
				if (allMsgs) {
					setMessages(allMsgs)
				}
			})
			if (getRole !== 3) {
				axios.get(`${process.env.REACT_APP_API_KEY}/agents`).then(({data}) => {
					if (data) {
						const filterdData = data.filter((el) => el.userId !== userID)
						setAgents(filterdData)
					}
				})
			}
		}
	}, [roomID])
	// useEffect(() => {
	// 	if (getRole !== 3) {
	// 		socket.on("userWating", ({message}) => {
	// 			alert(message)
	// 		})
	// 	}
	// }, [])

	useEffect(() => {
		lastElement.current.scrollIntoView({behavior: "smooth"})
	}, [messages, isTyping])
	useEffect(() => {
		if (roomID) {
			socket.on("messageToRoomFromBot", ({role, message, name}) => {
				console.log("got messag from bot", message)

				setIsTyping({
					typing: false,
					message: "",
				})

				setMessages((prevState) => {
					const oldState = [...prevState]
					oldState.push({
						message,
						role,
						name,
						createdAt: new Date(),
					})
					return oldState
				})
			})

			socket.on("user-typing", ({name, message, typing}) => {
				setIsTyping({
					typing,
					message,
				})
			})
			socket.on("messageToRoomFromAdmin", ({role, message, name}) => {
				console.log(message)
				setMessages((prevState) => {
					const oldState = [...prevState]
					oldState.push({
						message,
						name,
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
	}, [roomID])

	const sendMessage = (e) => {
		e.preventDefault()

		if (!message) {
			return
		}
		const role = getRole === 3 ? 3 : 4
		socket.emit(
			"messageFromAdmin",
			{roomID, message, isSuperAdmin: getRole === 3, name: userID},
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
				name: userID,
				createdAt: new Date(),
			})
			return newState
		})

		setMessage("")

		console.log("cc", chatInput)
		chatInput.current.blur()
	}

	const handelAssignAgent = async (e, value) => {
		try {
			const {data} = await axios.post(`${process.env.REACT_APP_API_KEY}/agents`, {
				roomID,
				agentID: value.userId,
			})
			if (data) {
				history.push("/room")
				socket.emit(
					"agent-to-agent-assign",
					{agentID: value.userId, roomID, assigneID: userID, user: data},
					(error) => {
						if (error) alert(error)
					}
				)
			}
		} catch (error) {}
	}

	const typingTimeout = () => {
		console.log("stoped Typing")
		socket.emit("agent-typing", {roomID, name: userID, typing: false}, (error) => {
			if (error) {
				alert(JSON.stringify(error))
			}
		})
	}

	const handelChange = (e) => {
		let ftime = undefined
		socket.emit("agent-typing", {roomID, name: userID, typing: true}, (error) => {
			if (error) {
				alert(JSON.stringify(error))
			}
		})
		clearTimeout(timeout)
		ftime = setTimeout(typingTimeout, 2000)
		setSTimeout(ftime)

		setMessage(e.target.value)
	}

	return (
		<div className="chat">
			<div className="chat_header">
				<Avatar src={`https://avatars.dicebear.com/api/avataaars/${roomID}.svg`} />
				<div className="chat_headerInfo">
					<h3 className="chat-room-name">
						{user?.username ? user?.username : roomName.split("@")[0]}
					</h3>
					<p style={{color: "#16e35e"}}>{isTyping.typing ? "typing ..." : ""}</p>
				</div>
				{getRole !== 3 && (
					<div className="chat_headerRight">
						{showAssign && (
							<Autocomplete
								id="combo-box-demo"
								options={agents}
								getOptionLabel={(option) => option.userId}
								style={{width: 300}}
								onChange={handelAssignAgent}
								renderInput={(params) => (
									<TextField {...params} label="Select Agent" variant="outlined" />
								)}
							/>
						)}
						{!showAssign ? (
							<IconButton
								onClick={() => {
									setshowAssign(true)
								}}
							>
								<PersonAddIcon />
							</IconButton>
						) : (
							<IconButton
								onClick={() => {
									setshowAssign(false)
								}}
							>
								<PersonAddDisabledIcon />
							</IconButton>
						)}
						{/* <IconButton>
						<MoreVert />
					</IconButton> */}
					</div>
				)}
			</div>
			<div className="chat_body">
				{messages.map((message, idx) => (
					<div className="chat__message-body" key={idx}>
						{getRole !== 3 ? (
							<p className={`chat_message ${message.role === 4 ? "chat_receiver" : "user"}`}>
								{(message.role === 1 || message.role === 3) &&
									(message.role === 1 ? (
										<span className="chat_name">{message.name.split("@")[0]} </span>
									) : (
										<span className="chat_name">{message.name.split("@")[0]} </span>
									))}
								{message.message}
								<span className="chat_timestemp">
									{new Date(message.createdAt).toLocaleString()}
								</span>
							</p>
						) : (
							<p className={`chat_message ${message.role === 3 ? "chat_receiver" : "user"}`}>
								{(message.role === 1 || message.role === 4) &&
									(message.role === 1 ? (
										<span className="chat_name">{message.name.split("@")[0]}</span>
									) : (
										<span className="chat_name">{message.name.split("@")[0]}</span>
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
						<span className="chat_name">{roomName}</span>
						{isTyping.message}
					</p>
				)}
				<div ref={lastElement}></div>
			</div>
			<div className="chat_footer">
				<InsertEmoticonIcon />
				<form onSubmit={sendMessage}>
					<input
						value={message}
						onChange={handelChange}
						type="text"
						ref={chatInput}
						style={{
							outline: "none",
						}}
						placeholder="Type a message"
					/>
				</form>{" "}
				<IconButton onClick={sendMessage}>
					<SendIcon />
				</IconButton>
			</div>
		</div>
	)
}

export default Chat
