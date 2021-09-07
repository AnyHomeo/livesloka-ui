import React, {useEffect, useState} from "react"
import {Avatar} from "@material-ui/core"
import "./SidebarChat.css"
import {Link, useHistory, useParams} from "react-router-dom"
import axios from "axios"
import {io} from "socket.io-client"

let socket

function SidebarChat({id, name, room}) {
	const history = useHistory()
	const parms = useParams()

	const [count, setCount] = useState(0)
	const [isNew, setIsNew] = useState(false)

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)
		socket.emit("JOIN_ROOM", {roomID: id, isAdmin: true}, (error) => {
			if (error) alert(error)
		})

		axios.get(`${process.env.REACT_APP_API_KEY}/lastmessage/${id}`).then(({data}) => {
			if (data.messageSeen === false) {
				setIsNew(true)
			}
		})

		socket.on("agent-joined-room", (isAgent) => {
			axios.get(`${process.env.REACT_APP_API_KEY}/lastmessage/${id}`).then(({data}) => {
				if (data.messageSeen === false) {
					setIsNew(true)
				} else {
					setIsNew(false)
				}
			})
		})
		socket.on("agent-read-message", () => {
			setIsNew(false)
		})
	}, [])
	useEffect(() => {
		socket.on("messageToRoomFromBot", ({role, message}) => {
			console.log("got messag from bot in side chat", message)
			console.log(parms)
			console.log(parms.roomID === id)
			// axios.get(`${process.env.REACT_APP_API_KEY}/rooms/${id}`).then(({data}) => {
			// 	const allMsgs = data.messages
			// 	if (allMsgs && id !== parms["roomID"]) {
			// 		if (allMsgs.length > count) {
			// 			setCount(allMsgs.length)
			// 		}
			// 	}
			// })
			setIsNew(true)
		})

		return () => {
			removeListners()
		}
	}, [parms])
	const removeListners = () => {
		console.log("sidebar clean")
		setIsNew(false)
		socket.removeAllListeners()
	}
	const handelClick = () => {
		axios.post(`${process.env.REACT_APP_API_KEY}/lastmessage/${id}`).then(({data}) => {
			console.log(data)
		})

		setIsNew(false)

		history.push(`/room/${id}`)
	}
	return (
		<div className="sidebarChat_head" key={id} onClick={handelClick}>
			<div
				className="sidebarChat"
				style={{backgroundColor: `${room.agentID ? "rgb(200 250 161)" : ""}`}}
			>
				<Avatar
					src={`https://avatars.dicebear.com/api/human/${id}.svg`}
					style={{
						boxShadow: `${
							id === parms["roomID"] ? "0px 0 0 7px #f6f6f6, 0px 0 0 10px #00ffad" : ""
						}`,
					}}
				/>
				<div className="sidebarChat_info">
					{isNew && id !== parms["roomID"] ? (
						<p style={{fontWeight: 700}}>{name.split("@")[0]} 💬</p>
					) : (
						<p>{name.split("@")[0]}</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default SidebarChat
