import React, {useState, useEffect, useRef} from "react"
import {Avatar, Button, FormControlLabel, IconButton, Switch, TextField} from "@material-ui/core"
import {AttachFile, MoreVert, SearchOutlined} from "@material-ui/icons"
import SendIcon from "@material-ui/icons/Send"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import "./Group.css"
import {useHistory, useParams} from "react-router-dom"
import axios from "axios"

import {io} from "socket.io-client"
import {isAutheticated} from "../../../auth"
import {fi} from "date-fns/locale"

import {useConfirm} from "material-ui-confirm"
let socket

function Group() {
	const {groupID} = useParams()
	const [groupName, setGroupName] = useState("")
	const [message, setMessage] = useState("")
	const [timeout, setSTimeout] = useState(undefined)
	const [user, setUser] = useState(null)
	const confirm = useConfirm()

	const [isClosed, SetIsClosed] = useState(false)

	const getRole = isAutheticated().roleId
	const userID = isAutheticated().userId
	const username = isAutheticated().username

	const [isTyping, setIsTyping] = useState({
		typing: false,
		message: "",
	})

	const [agents, setAgents] = useState([])
	const [showAssign, setshowAssign] = useState(false)
	const [messages, setMessages] = useState([])
	const lastElement = useRef(null)
	const history = useHistory()
	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)

		if (groupID) {
			socket.emit("JOIN_GROUP", {groupID, isAgent: getRole !== 3 ? userID : "admin"}, (error) => {
				if (error) alert(error)
			})
		}
		return () => {
			removeListners()
		}
	}, [groupID])

	const removeListners = () => {
		console.log("clean up done")

		// setIsTyping({
		// 	typing: false,
		// 	message: "",
		// })
		socket.removeAllListeners()
	}

	useEffect(() => {
		if (groupID) {
			axios.get(`${process.env.REACT_APP_API_KEY}/groups/${groupID}`).then(({data}) => {
				const name = data.groupName
				const groupMessages = data.messages

				if (groupMessages) {
					setMessages(groupMessages)
				}
				setGroupName(name)
				SetIsClosed(data.isClosed)
			})
		}
	}, [groupID])
	useEffect(() => {
		lastElement.current.scrollIntoView({behavior: "smooth"})
	}, [messages, isTyping])
	useEffect(() => {
		if (groupID) {
			socket.on("messageToGroupFromBot", ({role, message, userID, username}) => {
				// setIsTyping({
				// 	typing: false,
				// 	message: "",
				// })
				console.log(message)
				setMessages((prevState) => {
					const oldState = [...prevState]
					oldState.push({
						message,
						role,
						username,
						userID,
						createdAt: new Date(),
					})
					return oldState
				})
			})

			// socket.on("user-typing", ({name, message, typing}) => {
			// 	setIsTyping({
			// 		typing,
			// 		message,
			// 	})
			// })
			socket.on("adminmessageToGroup", ({role, message, userID, username}) => {
				setMessages((prevState) => {
					const oldState = [...prevState]
					oldState.push({
						message,
						username,
						role,
						userID,
						createdAt: new Date(),
					})
					return oldState
				})
			})
		}
		return () => {
			removeListners()
		}
	}, [groupID])

	const sendMessage = (e) => {
		e.preventDefault()
		const role = getRole === 3 ? 3 : 4
		socket.emit(
			"adminmessageToGroup",
			{groupID, message, isSuperAdmin: getRole === 3, userID, username},
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
	}

	// const handelAssignAgent = async (e, value) => {
	// 	try {
	// 		const {data} = await axios.post(`${process.env.REACT_APP_API_KEY}/agents`, {
	// 			groupID,
	// 			agentID: value.userId,
	// 		})
	// 		if (data) {
	// 			history.push("/room")
	// 			socket.emit(
	// 				"agent-to-agent-assign",
	// 				{agentID: value.userId, groupID, assigneID: userID, user: data},
	// 				(error) => {
	// 					if (error) alert(error)
	// 				}
	// 			)
	// 		}
	// 	} catch (error) {}
	// }

	// const typingTimeout = () => {
	// 	console.log("stoped Typing")
	// 	socket.emit("admin-group-typing", {groupID, username,userID, typing: false}, (error) => {
	// 		if (error) {
	// 			alert(JSON.stringify(error))
	// 		}
	// 	})
	// }

	const handelChange = (e) => {
		// let ftime = undefined
		// socket.emit("admin-group-typing", {groupID, username, userID, typing: true}, (error) => {
		// 	if (error) {
		// 		alert(JSON.stringify(error))
		// 	}
		// })
		// clearTimeout(timeout)
		// ftime = setTimeout(typingTimeout, 2000)
		// setSTimeout(ftime)

		setMessage(e.target.value)
	}
	const handelClosed = async (event) => {
		SetIsClosed(event.target.checked)
		try {
			const {data} = await axios.post(`${process.env.REACT_APP_API_KEY}/closeGroup`, {
				groupID,
				isClosed: event.target.checked,
			})
		} catch (error) {
			SetIsClosed(isClosed)
		}
	}

	const deleteGroup = async () => {
		confirm({
			description: "Do you Really want to Delete!",
			confirmationText: "Yes! delete",
		}).then(async () => {
			try {
				const {data} = await axios.post(`${process.env.REACT_APP_API_KEY}/deleteGroup`, {
					groupID,
				})
				history.replace("/group")
			} catch (error) {
				console.log(error)
			}
		})
	}

	return (
		<div className="chat">
			<div className="chat_header">
				<Avatar src={`https://avatars.dicebear.com/api/initials/${groupName}.svg`} />
				<div className="chat_headerInfo">
					<h3 className="chat-room-name">{groupName}</h3>
					{/* <p style={{color: "#16e35e"}}>{isTyping.typing ? "typing ..." : ""}</p> */}
				</div>
				{getRole === 3 && (
					<div className="chat_headerRight">
						{/* <IconButton>
							<MoreVert />
						</IconButton> */}
						<FormControlLabel
							control={<Switch checked={isClosed} onChange={handelClosed} />}
							label={`${isClosed ? "Open Group" : "Lock Group"}`}
						/>
						<Button
							variant="contained"
							color="secondary"
							style={{
								backgroundColor: "#E84545",
							}}
							onClick={deleteGroup}
						>
							Delete Group
						</Button>
					</div>
				)}
			</div>
			<div className="chat_body">
				{messages.map((message, idx) => (
					<div className="chat__message-body" key={idx}>
						{getRole !== 3 ? (
							<p className={`chat_message ${message.role === 4 ? "chat_receiver" : "user"}`}>
								{(message.role === 1 || message.role === 2 || message.role === 3) && (
									<span className="chat_name">{message.username} </span>
								)}
								{message.message}
								<span className="chat_timestemp">
									{new Date(message.createdAt).toLocaleString()}
								</span>
							</p>
						) : (
							<p className={`chat_message ${message.role === 3 ? "chat_receiver" : "user"}`}>
								{(message.role === 1 || message.role === 2 || message.role === 4) && (
									<span className="chat_name">{message.username}</span>
								)}
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
						<span className="chat_name">{groupName}</span>
						{isTyping.message}
					</p>
				)}
				<div ref={lastElement}></div>
			</div>
			{!isClosed && (
				<div className="chat_footer">
					<InsertEmoticonIcon />
					<form onSubmit={sendMessage}>
						<input
							value={message}
							onChange={handelChange}
							type="text"
							style={{
								outline: "none",
							}}
							placeholder="Type a message"
						/>
					</form>{" "}
					<SendIcon />
				</div>
			)}{" "}
		</div>
	)
}

export default Group
