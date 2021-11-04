import React, {useEffect, useState} from "react"
import {Avatar} from "@material-ui/core"
import {useHistory} from "react-router-dom"
// import axios from "axios"
// import {io} from "socket.io-client"

// let socket

const SidebarChat = React.memo(({id, name}) => {
	const history = useHistory()
	// const parms = useParams()
	console.log("sidebar Chat rerendering")

	// const [count, setCount] = useState(0)
	const [isOpen, setIsOpen] = useState(false)
	// const [isNew, setIsNew] = useState(false)
	// const [user, setUser] = useState(null)

	useEffect(() => {
		// console.log("join gro")
		// socket = io.connect(process.env.REACT_APP_API_KEY)
		// socket.emit("JOIN_GROUP", {groupID: id, isAgent: true}, (error) => {
		// 	if (error) alert(error)
		// })
		return () => {
			removeListners()
		}
	}, [])

	// useEffect(() => {
	// 	// socket.on("message-to-group-from-bot", (groupID) => {
	// 	// 	console.log(parms.groupID === groupID)
	// 	// 	if (parms.groupID !== groupID && id === groupID) {
	// 	// 		setIsNew(true)
	// 	// 	}
	// 	// })

	// 	return () => {
	// 		removeListners()
	// 	}
	// }, [parms]) //no need to rerender every time
	const removeListners = () => {
		console.log("unmount sidechat")
		// socket.removeAllListeners()
	}

	const handelClick = () => {
		// setIsNew(false)
		// setIsOpen(true)
		history.push(`/group/${id}`)
	}
	return (
		<div className="sidebarChat_head" key={id} onClick={handelClick}>
			<div className="sidebarChat">
				<Avatar
					style={{
						boxShadow: `${isOpen ? "0px 0 0 7.5px #f6f6f6, 0px 0 0 10px #00ffad" : ""}`,
					}}
				>
					{name.substr(0, 1)}
				</Avatar>
				<div className="sidebarChat_info">
					{/* {isNew && id !== parms["groupID"] ? (
						<p style={{fontWeight: 700}}>{name} 💬</p>
					) : (
						<p>{name}</p>
					)} */}
					<p>{name}</p>
				</div>
			</div>
		</div>
	)
})
export default SidebarChat
