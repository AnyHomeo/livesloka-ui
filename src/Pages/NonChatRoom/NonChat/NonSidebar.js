import React, {useState, useEffect, useCallback} from "react"
import {Avatar, Chip, IconButton} from "@material-ui/core"
import {AddCircle, SearchOutlined} from "@material-ui/icons"
import NonSidebarChat from "./NonSidebarChat"
import axios from "axios"
import {isAutheticated} from "../../../auth"
import {io} from "socket.io-client"
import {useHistory} from "react-router"

let socket
function NonSidebar() {
	const [rooms, setRooms] = useState([])
	const [searchValue, setSearchValue] = useState("")

	// const [isAll, setIsAll] = useState(false)
	const getRole = isAutheticated().roleId
	const ID = isAutheticated()._id
	const history = useHistory()

	const fetchRooms = () => {
		axios.get(`${process.env.REACT_APP_API_KEY}/nonrooms`).then(({data}) => {
			if (data) {
				if (getRole === 3) {
					setRooms(data)
				} else {
					const filterdRooms = data.filter((el) => el.agentID && el.agentID._id === ID)
					setRooms(filterdRooms)
				}
			}
		})
	}
	// const fetchAllRooms = () => {
	// 	axios.get(`${process.env.REACT_APP_API_KEY}/nonrooms`).then(({data}) => {
	// 		if (data) {
	// 			if (getRole === 3) {
	// 				setRooms(data)
	// 			} else {
	// 				const filterdRooms = data.filter((el) => el.agentID && el.agentID._id === ID)
	// 				setRooms(filterdRooms)
	// 			}
	// 		}
	// 		setIsAll(true)
	// 	})
	// }

	// useEffect(() => {
	// 	socket = io.connect(process.env.REACT_APP_API_KEY)
	// 	fetchRooms()
	// 	// socket.on("userWating", ({userID, roomID}) => {
	// 	// 	fetchRooms()
	// 	// })
	// 	// socket.on("agent-disconnected", () => {
	// 	// 	fetchRooms()
	// 	// })
	// 	// socket.on("agent-joined-room", (isAgent) => {
	// 	// 	fetchRooms()
	// 	// })

	// 	return removeListners
	// }, [])

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)
		fetchRooms()
		socket.on("non-user-pinged", ({roomID}) => {
			setRooms((rooms) => {
				return rooms.map((room) => {
					if (room.roomID === roomID) {
						return {
							...room,
							ping: true,
						}
					}
					return room
				})
			})
		})
		return () => {
			removeListners()
		}
	}, [])
	const removeListners = () => {
		console.log("unmounted non sidebar")
		socket.removeAllListeners()
	}

	const setCurrentRoom = useCallback((roomID) => {
		setRooms((rooms) => {
			return rooms.map((room) => {
				if (room.roomID === roomID) {
					return {
						...room,
						ping: false,
					}
				}
				return room
			})
		})
	}, [])
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
						<NonSidebarChat key={room.roomID} room={room} setCurrentRoom={setCurrentRoom} />
					))}
				{/* <div
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
				</div> */}
			</div>
		</div>
	)
}

export default React.memo(NonSidebar)
