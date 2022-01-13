import React, {useCallback, useEffect, useState} from "react"
import axios from "axios"
import {isAutheticated} from "../../auth"
import {io} from "socket.io-client"
import {IconButton, List, TextField} from "@material-ui/core"
import SingleGlobalChat from "./SingleGlobalChat"
import MainGlobalChat from "./MainGlobalChat"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
let socket
const GlobalChat = () => {
	const getRole = isAutheticated().roleId
	const ID = isAutheticated()._id
	const [open, setOpen] = useState(null)
	const [rooms, setRooms] = useState([])
	const [searchValue, setSearchValue] = useState("")

	const fetchRooms = () => {
		console.log("fetching rooms")
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

		socket.on("new-non-user-pinged", () => {
			fetchRooms()
		})
		return () => {
			removeListners()
		}
	}, [])
	const removeListners = () => {
		console.log("UnMounted Global CHAT")
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
	const handelRoom = (roomObj) => {
		console.log(roomObj)

		setOpen(roomObj)
		setCurrentRoom(roomObj.roomID)
	}
	const handelChange = (e) => {
		const value = e.target.value.toLowerCase().trim()
		setSearchValue(value)
	}
	return (
		<div>
			<IconButton
				style={{position: "absolute", top: "80px", left: "6px", zIndex: 100}}
				onClick={() => {
					setOpen(null)
					// fetchRooms()
				}}
			>
				{<ChevronLeft />}
			</IconButton>
			{!!open ? (
				<MainGlobalChat roomID={open.roomID} />
			) : (
				<>
					<div className="chathome__message-window">
						<List>
							<div
								// style={{
								// 	overflow: "auto",
								// 	// height: 360,
								// }}
								className="chat-height"
							>
								{rooms
									.filter((room) => room.username.toLowerCase().includes(searchValue))
									.map((room) => (
										<div onClick={() => handelRoom(room)} key={room.roomID}>
											<SingleGlobalChat room={room} />
										</div>
									))}
							</div>
						</List>
					</div>

					<div className="chathome__entry">
						<TextField label="Search..." fullWidth variant="outlined" onChange={handelChange} />
					</div>
				</>
			)}
		</div>
	)
}

export default GlobalChat
