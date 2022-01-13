import React, {useEffect, useState} from "react"
import clsx from "clsx"
import {makeStyles} from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import {Avatar, Badge, IconButton, ListItemAvatar, ListItemSecondaryAction} from "@material-ui/core"
import {Add, PersonAdd} from "@material-ui/icons"
import Alert from "@material-ui/lab/Alert"
import {useHistory} from "react-router"
import axios from "axios"
import {isAutheticated} from "../auth"
import {io} from "socket.io-client"
import noti from "./notification.mp3"
import newuserping from "./newuserping.mp3"
let socket

const userping = new Audio(noti)
const newping = new Audio(newuserping)

const useStyles = makeStyles({
	list: {
		width: 250,
	},
	fullList: {
		width: "auto",
	},
})

const AssignChats = React.memo(() => {
	console.log("logged assign Chats")
	const classes = useStyles()
	const history = useHistory()

	// const [chats, setChats] = useState([])
	const [nonChats, setNonChats] = useState([])
	const [nonCount, setNonCount] = useState(0)

	const [state, setState] = React.useState({
		right: false,
	})

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)
		socket.on("new-non-user-pinged", () => {
			setNonCount((prev) => prev + 1)
			newping.play()
		})
		socket.on("non-user-pinged", ({roomID}) => {
			console.log("user pinged")
			userping.play()
		})
	}, [])
	useEffect(() => {
		axios.get(`${process.env.REACT_APP_API_KEY}/nonassignedchats`).then(({data}) => {
			if (data) {
				console.log(data)
				setNonChats(data)
				setNonCount(data.length)
			}
		})
	}, [state])

	const toggleDrawer = (anchor, open) => (event) => {
		if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
			return
		}

		setState({...state, [anchor]: open})
	}

	const list = (anchor) => (
		<div
			className={clsx(classes.list, {
				[classes.fullList]: anchor === "top" || anchor === "bottom",
			})}
			role="presentation"
			// onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			{/* <h3
				style={{
					textAlign: "center",
					marginTop: "10px",
				}}
			>
				Assign Website Chats
			</h3>

			<List
				style={{
					maxHeight: "43vh",
					overflow: "auto",
					marginBottom: "10px",
				}}
			>
				{chats.map((el) => (
					<ListItem>
						<ListItemAvatar>
							<Avatar>S</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Sumanth Ale" secondary={true ? "Hello" : null} />
						<ListItemSecondaryAction>
							<IconButton edge="end" aria-label="delete" onClick={() => history.push("/nonroom")}>
								<Add />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
				{chats.length <= 0 && <Alert severity="success">No New Chats</Alert>}
			</List> */}
			<h3
				style={{
					textAlign: "center",
					marginTop: "10px",
				}}
			>
				New Customer's Chats
			</h3>

			<List style={{maxHeight: "44vh", overflow: "auto"}}>
				{nonChats.map(({messages, username, roomID}) => (
					<ListItem>
						<ListItemAvatar>
							<Avatar>S</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={username}
							secondary={messages.length > 0 ? messages[0].message : null}
						/>
						<ListItemSecondaryAction>
							<IconButton edge="end" aria-label="delete" onClick={() => handelAssign(roomID)}>
								<Add />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
				{nonChats.length <= 0 && <Alert severity="success">No New Chats </Alert>}
			</List>
		</div>
	)

	const handelAssign = (roomID) => {
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
					alert("assgined to other agent" + data.user?.agentID?.username)
				} else {
					history.push(`/nonroom/${roomID}`)
				}
				setNonCount((prev) => prev - 1)
				setNonChats((prev) => {
					return prev.filter((non) => non.roomID !== roomID)
				})
			})
	}
	return (
		<div>
			<React.Fragment key={"right"}>
				<Badge
					onClick={toggleDrawer("right", true)}
					style={{
						cursor: "pointer",
					}}
					badgeContent={nonCount}
					color="error"
				>
					<PersonAdd />
				</Badge>
				<Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false)}>
					{list("right")}
				</Drawer>
			</React.Fragment>
		</div>
	)
})

export default AssignChats
