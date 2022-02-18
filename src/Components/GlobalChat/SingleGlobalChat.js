import React, {useEffect, useState} from "react"
import {Avatar, Chip, IconButton} from "@material-ui/core"
import {useHistory} from "react-router-dom"
// import axios from "axios"
// import {io} from "socket.io-client"
import axios from "axios"
import {Add, Replay} from "@material-ui/icons"
import {isAutheticated} from "../../auth"
import getRandomColor from "../../Services/randomColor"

// let socket

function SingleGlobalChat({room}) {
	const {roomID, username, messageSeen} = room
	// const history = useHistory()
	const getRole = isAutheticated().roleId

	// const parms = useParams()

	const [showAB, setShowAB] = useState(true)

	// const handelClick = () => {
	// 	// console.log("handel click")
	// 	setCurrentRoom(roomID)
	// 	// history.push(`/nonroom/${roomID}`)
	// }

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
	console.log(room)
	return (
		<div className="sidebarChat_head2" key={roomID}>
			<div className="sidebarChat">
				<Avatar
					style={{
						backgroundColor: `${getRandomColor()}`,
					}}
				>
					{username.substr(0, 1)}
				</Avatar>
				<div className="sidebarChat_info" style={{position: "relative"}}>
					{room.ping ? <p style={{fontWeight: 700}}>{username} 💬</p> : <p>{username}</p>}
					{room.country && (
						<span style={{fontSize: "0.7rem", position: "absolute", top: 42}}>
							{room?.country?.city}, {room?.country?.region}, {room?.country?.country_name}
						</span>
					)}
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
										style={{top: "-15%"}}
									>
										<Add />
									</IconButton>
							  ))}
				</div>
			</div>
		</div>
	)
}

export default React.memo(SingleGlobalChat)

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
