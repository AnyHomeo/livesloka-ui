import React, {useState, useEffect} from "react"
import "./Sidebar.css"
import {Avatar, Chip, IconButton} from "@material-ui/core"
import {AddCircle, SearchOutlined} from "@material-ui/icons"
import SidebarChat from "./SidebarChat"
import axios from "axios"
import {isAutheticated} from "../../../auth"
import {io} from "socket.io-client"
import {useHistory} from "react-router"

let socket
function Sidebar() {
	const [allRooms, setAllRooms] = useState([])
	const [rooms, setRooms] = useState([])

	const [isAll, setIsAll] = useState(false)
	const getRole = isAutheticated().roleId
	const getUserID = isAutheticated().userId
	const history = useHistory()

	const fetchRooms = () => {
		axios.get(`${process.env.REACT_APP_API_KEY}/last2drooms`).then(({data}) => {
			if (data) {
				if (getRole === 3) {
					setRooms(data)
					setAllRooms(data)
				} else {
					const filterdRooms = data.filter((el) => !el.agentID || el.agentID === getUserID)
					setRooms(filterdRooms)
					setAllRooms(filterdRooms)
				}
			}
		})
	}
	const fetchAllRooms = () => {
		axios.get(`${process.env.REACT_APP_API_KEY}/rooms`).then(({data}) => {
			if (data) {
				if (getRole === 3) {
					setRooms(data)
					setAllRooms(data)
				} else {
					const filterdRooms = data.filter((el) => !el.agentID || el.agentID === getUserID)
					setRooms(filterdRooms)
					setAllRooms(filterdRooms)
				}
			}
			setIsAll(true)
		})
	}

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)
		fetchRooms()

		return removeListners
	}, [])

	useEffect(() => {
		socket.on("userWating", ({userID, roomID}) => {
			fetchRooms()
		})
		return removeListners
	}, [])

	useEffect(() => {
		socket.on("agent-disconnected", () => {
			fetchRooms()
		})
		socket.on("agent-joined-room", (isAgent) => {
			fetchRooms()
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
			<div
				className="sidebar_chats"
				style={{
					height: "71vh",
					overflowY: "auto",
				}}
			>
				{rooms.map((room) => (
					<SidebarChat key={room.roomID} id={room.roomID} name={room.userID} room={room} />
				))}
				<div
					style={{
						textAlign: "center",
					}}
				>
					{isAll ? null : (
						<>
							<IconButton aria-label="delete" onClick={fetchAllRooms}>
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

export default Sidebar
