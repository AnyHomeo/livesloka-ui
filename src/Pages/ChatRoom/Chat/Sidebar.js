import React, {useState, useEffect} from "react"
import "./Sidebar.css"
import {Avatar, IconButton} from "@material-ui/core"
import DonutLargeIcon from "@material-ui/icons/DonutLarge"
import ChatIcon from "@material-ui/icons/Chat"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import {SearchOutlined} from "@material-ui/icons"
import SidebarChat from "./SidebarChat"
import axios from "axios"
import {isAutheticated} from "../../../auth"
import {io} from "socket.io-client"

let socket
function Sidebar(props) {
	const [rooms, setRooms] = useState([])
	const getRole = isAutheticated().roleId
	const getUserID = isAutheticated().userId

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)

		axios.get(`${process.env.REACT_APP_API_KEY}/rooms`).then(({data}) => {
			if (data) {
				if (getRole === 3) {
					setRooms(data)
				} else {
					const filterdRooms = data.filter((el) => {
						if (!el.agentID || el.agentID === getUserID) {
							return el
						}
					})
					setRooms(filterdRooms)
				}
			}
		})
		return removeListners
	}, [])

	useEffect(() => {
		socket.on("userWating", ({userID, roomID}) => {
			axios.get(`${process.env.REACT_APP_API_KEY}/rooms`).then(({data}) => {
				// if (data && data.length !== rooms.length) {
				console.log("new Room added")

				// 	setRooms(data)
				// }
				if (getRole === 3) {
					setRooms(data)
				} else {
					const filterdRooms = data.filter((el) => {
						if (!el.agentID || el.agentID === getUserID) {
							return el
						}
					})
					setRooms(filterdRooms)
				}
			})
		})
		return removeListners
	}, [])
	const removeListners = () => {
		console.log("clean up done in sidebar")
		socket.removeAllListeners()
	}

	return (
		<div className="sidebar">
			<div className="sidebar_header">
				{/* <Avatar src={user?.photoURL} /> */}
				<div className="sidebar_headerRight">
					<IconButton>
						<DonutLargeIcon />
					</IconButton>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</div>
			</div>
			<div className="sidebar_search">
				<div className="sidebar_searchContainer">
					<SearchOutlined />

					<input type="text" id="chat_search" placeholder="Search or start new chat" />
				</div>
			</div>
			<div className="sidebar_chats">
				{rooms.map((room) => (
					<SidebarChat key={room.roomID} id={room.roomID} name={room.userID} />
				))}
			</div>
		</div>
	)
}

export default Sidebar
