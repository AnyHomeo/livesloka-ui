import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core"
import NavBar from "./NavBar"
import TopBar from "./TopBar"
import "./Topbar.css"
import io from "socket.io-client"
import {useSnackbar} from "notistack"
import Global from "../Components/GlobalChat"
import {Chat} from "@material-ui/icons"
var audio = new Audio(require("./notification.mp3"))

const socket = io(process.env.REACT_APP_CMS_API_KEY)
const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		display: "flex",
		height: "100%",
		overflow: "hidden",
		width: "100%",
	},
	wrapper: {
		display: "flex",
		flex: "1 1 auto",
		overflow: "hidden",
		paddingTop: 64,
	},
	contentContainer: {
		display: "flex",
		flex: "1 1 auto",
		overflow: "hidden",
	},
	content: {
		flex: "1 1 auto",
		height: "100%",
		overflow: "auto",
	},
}))

const DashboardLayout = ({children}) => {
	const {enqueueSnackbar} = useSnackbar()
	const classes = useStyles()
	const [isMobileNavOpen, setMobileNavOpen] = useState(false)

	const [rightChatOpen, setRightChatOpen] = useState(true)

	useEffect(() => {
		socket.on("customer-submission", ({name}) => {
			enqueueSnackbar(`${name} Just Registered Successfully!`, {variant: "success"})
			audio.play()
		})
	}, [])

	return (
		<div className={classes.root}>
			<TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
			<NavBar onMobileClose={() => setMobileNavOpen(false)} openMobile={isMobileNavOpen} />

			<div className={classes.wrapper}>
				<div className={classes.contentContainer}>
					<div className={classes.content}>{children}</div>
				</div>
			</div>
			{rightChatOpen ? (
				<Global rightChatOpen={rightChatOpen} setRightChatOpen={setRightChatOpen} />
			) : (
				<BotButton setRightChatOpen={setRightChatOpen} />
			)}
		</div>
	)
}

export default DashboardLayout
const BotButton = ({setRightChatOpen}) => {
	return (
		<div
			id="chat-circle"
			onClick={(e) => {
				e.stopPropagation()
				setRightChatOpen(true)
			}}
		>
			<Chat style={{fontSize: 30}} />
		</div>
	)
}
