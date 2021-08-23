import React, {useEffect, useState} from "react"
import {Avatar} from "@material-ui/core"
import "./SidebarChat.css"
import {Link, useHistory, useParams} from "react-router-dom"
import axios from "axios"
import {io} from "socket.io-client"

let socket

function SidebarChat({id, name}) {
	const history = useHistory()
	const parms = useParams()

	const [count, setCount] = useState(0)
	const [isNew, setIsNew] = useState(false)

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)
		socket.emit("JOIN_ROOM", {roomID: id, isAdmin: true}, (error) => {
			if (error) alert(error)
		})
	}, [])
	useEffect(() => {
		socket.on("messageToRoomFromBot", ({role, message}) => {
			console.log("got messag from bot in side chat", message)
			axios.get(`http://localhost:5000/rooms/${id}`).then(({data}) => {
				const allMsgs = data.messages
				console.log(parms)
				if (allMsgs && id !== parms["roomID"]) {
					if (allMsgs.length !== count) setCount(allMsgs.length)
					setIsNew(true)
				}
			})
		})

		return removeListners
	}, [parms])
	const removeListners = () => {
		socket.removeAllListeners()
	}
	return (
		<div
			className="sidebarChat_head"
			key={id}
			onClick={() => {
				history.push(`/room/${id}`)
				setIsNew(false)
			}}
		>
			<div className="sidebarChat" style={{backgroundColor: `${isNew ? "#C2F784" : ""}`}}>
				<Avatar
					src={`https://avatars.dicebear.com/api/human/${id}.svg`}
					style={{
						boxShadow: `${
							id === parms["roomID"] ? "0px 0 0 7px #f6f6f6, 0px 0 0 10px #00ffad" : ""
						}`,
					}}
				/>
				<div className="sidebarChat_info">
					{/* <h2>{name.includes("@") ? name.split("@")[0] : name}</h2> */}
					<p>{name}</p>
				</div>
			</div>
		</div>
	)
}

export default SidebarChat
