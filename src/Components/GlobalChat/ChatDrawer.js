import React, {useEffect, useState} from "react"
import {makeStyles, useTheme} from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import {Resizable} from "re-resizable"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import CloseIcon from "@material-ui/icons/Close"
import Chat from "@material-ui/icons/Chat"
import GlobalChat from "./GlobalChat"
import {io} from "socket.io-client"
import axios from "axios"
import {FormControlLabel, Switch} from "@material-ui/core"
import noti from "./notification.mp3"
import newuserping from "./newuserping.mp3"
let socket

const userping = new Audio(noti)
const newping = new Audio(newuserping)

const drawerWidth = 350

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		position: "relative",
	},
	appBar: {
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: drawerWidth,
	},
	title: {
		flexGrow: 1,
	},
	hide: {
		display: "none",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: "space-between",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginRight: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: 0,
	},
}))

export default function ChatDrawer({open, setOpen}) {
	// console.log(open)
	const classes = useStyles()
	// const [open, setOpen] = React.useState(false)

	// const handleDrawerOpen = () => {
	// 	if (setOpen !== undefined) {
	// 		setOpen(true)
	// 	}
	// }
	const [isClosed, SetIsClosed] = useState(false)

	const handleDrawerClose = () => {
		if (setOpen !== undefined) {
			setOpen(false)
		}
	}

	useEffect(() => {
		socket = io.connect(`${process.env.REACT_APP_API_KEY}/`)
		axios
			.get(`${process.env.REACT_APP_API_KEY}/getNonChatConfig`)
			.then(({data}) => {
				if (data[0]) {
					const {show} = data[0]

					SetIsClosed(show)
				}
			})
			.catch((err) => {
				console.log(err)
			})
		socket.on("non-user-pinged", ({roomID}) => {
			newping.play()
		})

		socket.on("new-non-user-pinged", () => {
			userping.play()
		})
		return () => {
			removeListners()
		}
	}, [])
	const removeListners = () => {
		console.log("UnMounted ")
		socket.removeAllListeners()
	}
	const handelClosed = async (event) => {
		SetIsClosed(event.target.checked)
		axios
			.post(`${process.env.REACT_APP_API_KEY}/updateShowNonChat`, {
				show: event.target.checked,
			})
			.then(({data}) => {
				console.log(data)
			})
			.catch((err) => {
				console.log(err)
			})

		socket.emit("toggleNonChatBot", {show: event.target.checked}, (error) => {
			if (error) alert(error)
		})
	}
	return (
		<div className={classes.root}>
			<Resizable
				defaultSize={{
					width: 360,
					height: "80vh",
				}}
			>
				<div
					style={{
						marginTop: 80,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<IconButton>{<ChevronLeftIcon />}</IconButton>
					<div>Livesloka.com</div>{" "}
					<FormControlLabel
						control={<Switch checked={isClosed} onChange={handelClosed} />}
						label={`${isClosed ? "Open" : "Hidden"}`}
					/>
					<IconButton onClick={handleDrawerClose}>{<CloseIcon />}</IconButton>
				</div>
				<Divider />

				{open && <GlobalChat />}
				{/* <Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="right"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton>{<ChevronLeftIcon />}</IconButton>
					<div>Non Rooms</div>
					<IconButton onClick={handleDrawerClose}>{<CloseIcon />}</IconButton>
				</div>
				<Divider />
				{open && <GlobalChat />}
			</Drawer> */}
			</Resizable>
		</div>
	)
}
