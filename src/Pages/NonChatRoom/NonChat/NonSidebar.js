import React, {useState, useEffect} from "react"
import "./NonSidebar.css"
import {Avatar, IconButton} from "@material-ui/core"
import DonutLargeIcon from "@material-ui/icons/DonutLarge"
import ChatIcon from "@material-ui/icons/Chat"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import {SearchOutlined} from "@material-ui/icons"
import NonSidebarChat from "./NonSidebarChat"
import axios from "axios"
let user
function NonSidebar(props) {
	const [rooms, setRooms] = useState([])

	// useEffect(() => {
	// 	axios.get("http://localhost:5000/nonrooms").then((data) => {
	// 		console.log(data)
	// 		setRooms(data.data)
	// 	})
	// }, [])

	return (
		<div className="sidebar">
			<div className="sidebar_header">
				<div className="sidebar_headerRight">
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
					<NonSidebarChat key={room.roomID} id={room.roomID} name={room.userID} />
				))}
			</div>
		</div>
	)
}

export default NonSidebar
