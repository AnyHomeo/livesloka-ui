import React, {useState, useEffect} from "react"
import {Avatar, Chip, IconButton} from "@material-ui/core"
import {AddCircle, SearchOutlined} from "@material-ui/icons"
import NonSidebarChat from "./NonSidebarChat"
import axios from "axios"
import {isAutheticated} from "../../../auth"
// import {io} from "socket.io-client"
import {useHistory} from "react-router"

// let socket
function NonSidebar() {
	const [rooms, setRooms] = useState([])
	const [searchValue, setSearchValue] = useState("")

	const [isAll, setIsAll] = useState(false)
	const getRole = isAutheticated().roleId
	const getUserID = isAutheticated().userId
	const history = useHistory()

	const fetchRooms = () => {
		axios.get(`${process.env.REACT_APP_API_KEY}/nonrooms`).then(({data}) => {
			if (data) {
				if (getRole === 3) {
					setRooms(data)
				} else {
					const filterdRooms = data.filter((el) => !el.agentID || el.agentID === getUserID)
					setRooms(filterdRooms)
				}
			}
		})
	}
	const fetchAllRooms = () => {
		axios.get(`${process.env.REACT_APP_API_KEY}/nonrooms`).then(({data}) => {
			if (data) {
				if (getRole === 3) {
					setRooms(data)
				} else {
					const filterdRooms = data.filter((el) => !el.agentID || el.agentID === getUserID)
					setRooms(filterdRooms)
				}
			}
			setIsAll(true)
		})
	}

	useEffect(() => {
		// socket = io.connect(process.env.REACT_APP_API_KEY)
		fetchRooms()
		// socket.on("userWating", ({userID, roomID}) => {
		// 	fetchRooms()
		// })
		// socket.on("agent-disconnected", () => {
		// 	fetchRooms()
		// })
		// socket.on("agent-joined-room", (isAgent) => {
		// 	fetchRooms()
		// })

		return removeListners
	}, [])

	const removeListners = () => {
		console.log("unmounted non sidebar")
		// socket.removeAllListeners()
	}
	return (
		<div className="sidebar">
			<div className="sidebar_header">
				<div className="sidebar_headerRight">
					<Chip
						avatar={<Avatar>R</Avatar>}
						label="Room"
						onClick={() => {
							history.push("/room")
						}}
					/>
					<Chip
						avatar={<Avatar>N</Avatar>}
						label="NonRoom"
						color="primary"
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
				</div>
			</div>
			<div className="sidebar_search">
				<div className="sidebar_searchContainer">
					<SearchOutlined />
					<input
						type="search"
						id="chat_search"
						onChange={(e) => {
							setSearchValue(e.target.value.toLowerCase().trim())
						}}
						className="inp-search-feild"
						placeholder="Search "
						value={searchValue}
					/>
				</div>
			</div>
			<div
				className="sidebar_chats"
				style={{
					height: "71vh",
					overflowY: "auto",
				}}
			>
				{rooms
					.filter((room) => room.username.toLowerCase().includes(searchValue))
					.map((room) => (
						<NonSidebarChat key={room.roomID} room={room} />
					))}
				<div
					style={{
						textAlign: "center",
					}}
				>
					{isAll ? null : (
						<>
							<IconButton aria-label="more" onClick={fetchAllRooms}>
								<AddCircle fontSize="large" />
							</IconButton>
							<p>Get All Chats</p>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default NonSidebar
