import React, {useState, useEffect} from "react"
import "./Sidebar.css"
import {Avatar, Chip, IconButton} from "@material-ui/core"
import {SearchOutlined} from "@material-ui/icons"
import SidebarChat from "./SidebarChat"
import axios from "axios"
import {isAutheticated} from "../../../auth"
import {io} from "socket.io-client"
import {useHistory} from "react-router"

let socket
function Sidebar() {
	const [allRooms, setAllRooms] = useState([])
	const [rooms, setRooms] = useState([])
	const getRole = isAutheticated().roleId
	const getUserID = isAutheticated().userId
	const history = useHistory()

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)

		axios.get(`${process.env.REACT_APP_API_KEY}/rooms`).then(({data}) => {
			if (data) {
				if (getRole === 3) {
					setRooms(data)
					setAllRooms(data)
				} else {
					const filterdRooms = data.filter((el) => {
						if (!el.agentID || el.agentID === getUserID) {
							return el
						}
					})
					setRooms(filterdRooms)
					setAllRooms(filterdRooms)
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

	useEffect(() => {
		socket.on("agent-disconnected", () => {
			axios.get(`${process.env.REACT_APP_API_KEY}/rooms`).then(({data}) => {
				console.log("agent disconnected axios")
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
		socket.on("agent-joined-room", (isAgent) => {
			// if (isAgent === getUserID) {
			// 	console.log(isAgent)

			// }
			// else{
			// 	// 89 herer
			// }
			axios.get(`${process.env.REACT_APP_API_KEY}/rooms`).then(({data}) => {
				console.log("agent joined axios")

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

	const handelChange = (e) => {
		const value = e.target.value.toLowerCase().trim()
		const copyRooms = [...allRooms].filter((room) => room.username.toLowerCase().includes(value))
		setRooms(copyRooms)
	}
	return (
		<div className="sidebar">
			<div className="sidebar_header">
				{/* <Avatar src={user?.photoURL} /> */}
				<div className="sidebar_headerRight">
					<Chip
						avatar={<Avatar>R</Avatar>}
						label="Room"
						color="primary"
						onClick={() => {
							history.push("/room")
						}}
					/>
					<Chip
						avatar={<Avatar>N</Avatar>}
						label="NonRoom"
						onClick={() => {
							history.push("/nonroom")
						}}
					/>
					<Chip
						avatar={<Avatar>G</Avatar>}
						label="Group"
						onClick={() => {
							history.push("/group")
						}}
					/>
					{/* <IconButton>
						<MoreVertIcon />
					</IconButton> */}
				</div>
			</div>
			<div className="sidebar_search">
				<div className="sidebar_searchContainer">
					<SearchOutlined />

					<input
						type="search"
						id="chat_search"
						onChange={handelChange}
						placeholder="Search or start new chat"
						// value={search}
					/>
				</div>
			</div>
			<div className="sidebar_chats">
				{rooms.map((room) => (
					<SidebarChat key={room.roomID} id={room.roomID} name={room.userID} room={room} />
				))}
			</div>
		</div>
	)
}

export default Sidebar
