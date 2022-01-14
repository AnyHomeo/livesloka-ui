import React, {useEffect, useState} from "react"
import {Avatar, Chip, IconButton} from "@material-ui/core"
import {useHistory} from "react-router-dom"
// import axios from "axios"
// import {io} from "socket.io-client"
import {isAutheticated} from "../../../auth"
import axios from "axios"
import {Add, Replay} from "@material-ui/icons"
import getRandomColor from "../../../Services/randomColor"

// let socket

function NonSidebarChat({room, setCurrentRoom}) {
	const {roomID, username, messageSeen} = room
	const history = useHistory()
	const getRole = isAutheticated().roleId

	// const parms = useParams()
	console.log("nonsidebar chat rere")

	// console.log(isNew)
	const [showAB, setShowAB] = useState(true)

	const handelClick = () => {
		// axios.post(`${process.env.REACT_APP_API_KEY}/lastmessage/${id}`).then(({data}) => {
		// 	console.log(data)
		// })
		setCurrentRoom(roomID)
		history.push(`/nonroom/${roomID}`)
	}

	const handelAssign = (e) => {
		e.stopPropagation()
		axios
			.post(`${process.env.REACT_APP_API_KEY}/assignAgentToNonChat`, {
				roomID,
				agentID: isAutheticated()._id,
				roleID: isAutheticated().roleId,
			})
			.then(({data}) => {
				console.log(data)
				if (data.present) {
					console.log("assigned to " + data.user?.agentID?.username)
				}
				setShowAB((res) => !res)
			})
	}
	return (
		<div className="sidebarChat_head" key={roomID} onClick={handelClick}>
			<div
				className="sidebarChat"
				// style={{backgroundColor: `${room.agentID ? "rgb(200 250 161)" : ""}`}}
			>
				<Avatar
					// style={{
					// 	boxShadow: `${
					// 		roomID === parms["roomID"] ? "0px 0 0 7.5px #f6f6f6, 0px 0 0 10px #00ffad" : ""
					// 	}`,
					// }}
					style={{
						backgroundColor: `${getRandomColor()}`,
					}}
				>
					{username.substr(0, 1)}
				</Avatar>
				<div className="sidebarChat_info">
					{room.ping ? <p style={{fontWeight: 700}}>{username} 💬</p> : <p>{username}</p>}
					<p style={{fontSize: 12, display: "flex", alignItems: "center"}}>
						{lastMessage(room)} {messageSeen === false ? <Replay fontSize="small"></Replay> : null}
					</p>

					{getRole === 3 &&
						(room.agentID
							? room.agentID.username
							: showAB && (
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={(e) => handelAssign(e)}
										className="assign-btn"
									>
										<Add />
									</IconButton>
							  ))}
				</div>
			</div>
		</div>
	)
}

export default React.memo(NonSidebarChat)

const lastMessage = ({messages}) => {
	if (messages.length > 0) {
		const {message, username, role} = messages[0]

		return <>{createUsername(username, message, role)}</>
	} else {
		return <>No Messages Yet</>
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
