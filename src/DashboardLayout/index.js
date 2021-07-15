import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core"
import NavBar from "./NavBar"
import TopBar from "./TopBar"
import "./Topbar.css"
import io from "socket.io-client"
import {useSnackbar} from "notistack"
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

	useEffect(() => {
		socket.on("customer-submission", ({name}) => {
			enqueueSnackbar(`${name} Just Registered Successfully!`, {variant: "success"})
      audio.play();
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
		</div>
	)
}

export default DashboardLayout
