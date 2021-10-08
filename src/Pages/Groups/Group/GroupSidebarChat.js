import React, {useEffect, useState} from "react"
import {Avatar} from "@material-ui/core"
import "./GroupSidebarChat.css"
import {Link, useHistory, useParams} from "react-router-dom"
import axios from "axios"
import {io} from "socket.io-client"

let socket

function SidebarChat({id, name}) {
	const history = useHistory()
	const parms = useParams()

	const [count, setCount] = useState(0)
	const [isNew, setIsNew] = useState(false)
	const [user, setUser] = useState(null)

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)
		socket.emit("JOIN_GROUP", {groupID: id, isAgent: true}, (error) => {
			if (error) alert(error)
		})
	}, [])

	useEffect(() => {
		// socket.on("message-to-group-from-bot", (groupID) => {
		// 	console.log(parms.groupID === groupID)
		// 	if (parms.groupID !== groupID && id === groupID) {
		// 		setIsNew(true)
		// 	}
		// })

		return () => {
			removeListners()
		}
	}, [parms])
	const removeListners = () => {
		console.log("sidebar clean")
		socket.removeAllListeners()
	}

	const handelClick = () => {
		setIsNew(false)
		history.push(`/group/${id}`)
	}
	return (
		<div className="sidebarChat_head" key={id} onClick={handelClick}>
			<div className="sidebarChat">
				<Avatar
					style={{
						boxShadow: `${
							id === parms["groupID"] ? "0px 0 0 7.5px #f6f6f6, 0px 0 0 10px #00ffad" : ""
						}`,
					}}
				>
					{name.substr(0, 1)}
				</Avatar>
				<div className="sidebarChat_info">
					{isNew && id !== parms["groupID"] ? (
						<p style={{fontWeight: 700}}>{name} 💬</p>
					) : (
						<p>{name}</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default SidebarChat
