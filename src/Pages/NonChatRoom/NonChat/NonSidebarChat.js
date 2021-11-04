import React, {useEffect, useState} from "react"
import {Avatar} from "@material-ui/core"
import {Link, useHistory, useParams} from "react-router-dom"
import axios from "axios"
import {io} from "socket.io-client"

let socket

function NonSidebarChat({room}) {
	const {roomID, username} = room
	const history = useHistory()
	const parms = useParams()

	const [isNew, setIsNew] = useState(false)
	const [user, setUser] = useState(null)

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)
		// socket.emit("JOIN_ROOM", {roomID, isAdmin: true}, (error) => {
		// 	if (error) alert(error)
		// })

		// axios.get(`${process.env.REACT_APP_API_KEY}/lastmessage/${id}`).then(({data}) => {
		// 	if (data.messageSeen === false) {
		// 		setIsNew(true)
		// 	}
		// })

		// socket.on("agent-joined-room", (isAgent) => {
		// 	axios.get(`${process.env.REACT_APP_API_KEY}/lastmessage/${id}`).then(({data}) => {
		// 		if (data.messageSeen === false) {
		// 			setIsNew(true)
		// 		} else {
		// 			setIsNew(false)
		// 		}
		// 	})
		// })
		// socket.on("agent-read-message", () => {
		// 	setIsNew(false)
		// })
		return () => {
			removeListners()
		}
	}, [])

	// useEffect(() => {
	// 	socket.on("messageToRoomFromBot", ({role, message}) => {
	// 		console.log("got messag from bot in side chat", message)
	// 		console.log(parms)
	// 		console.log(parms.roomID === roomID)
	// 		setIsNew(true)
	// 	})

	// 	return () => {
	// 		removeListners()
	// 	}
	// }, [parms])
	const removeListners = () => {
		console.log("sidebar clean")
		setIsNew(false)
		socket.removeAllListeners()
	}
	const handelClick = () => {
		// axios.post(`${process.env.REACT_APP_API_KEY}/lastmessage/${id}`).then(({data}) => {
		// 	console.log(data)
		// })

		// setIsNew(false)

		history.push(`/nonroom/${roomID}`)
	}
	return (
		<div className="sidebarChat_head" key={roomID} onClick={handelClick}>
			<div
				className="sidebarChat"
				style={{backgroundColor: `${room.agentID ? "rgb(200 250 161)" : ""}`}}
			>
				<Avatar
					style={{
						boxShadow: `${
							roomID === parms["roomID"] ? "0px 0 0 7.5px #f6f6f6, 0px 0 0 10px #00ffad" : ""
						}`,
					}}
				>
					{room.username.substr(0, 1)}
				</Avatar>
				<div className="sidebarChat_info">
					{isNew && roomID !== parms["roomID"] ? (
						<p style={{fontWeight: 700}}>{room.username} 💬</p>
					) : (
						<p>{room.username}</p>
					)}
					<p style={{fontSize: 12}}>
						<span
						// style={{
						// 	fontWeight: "bold",
						// }}
						>
							{/* {room.agentID ? room.agentID : ""} */}
							{lastMessage(room)}
						</span>
					</p>

					{/* {isNew && id !== parms["roomID"] ? (
						<p style={{fontWeight: 700}}>{name.split("@")[0]} 💬</p>
					) : (
						<p>{name.split("@")[0]}</p>
					)}

					<p style={{fontSize: 12}}>
						{user?.timeZone} {room.agentID ? room.agentID : ""}
					</p> */}
				</div>
			</div>
		</div>
	)
}

export default NonSidebarChat

const lastMessage = ({messages}) => {
	if (messages.length > 0) {
		const {message, username, role} = messages[0]

		return <>{createUsername(username, message, role)}</>
	} else {
		return <>No New Messages</>
	}
}

const createUsername = (username, message) => {
	return (
		<span
			style={{
				width: "100%",
				overflow: "hidden",
				display: "inline-block",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			}}
		>
			{`${username.split(" ")[0]} : ${message}`}
		</span>
	)
}
