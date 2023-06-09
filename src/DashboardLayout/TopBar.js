import React, {useContext, useEffect, useState} from "react"
import clsx from "clsx"
import PropTypes from "prop-types"
import MomentUtils from "@date-io/moment"

import {
	AppBar,
	IconButton,
	Toolbar,
	makeStyles,
	Chip,
	Dialog,
	DialogActions,
	Button,
	Badge,
	Avatar,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import InputIcon from "@material-ui/icons/Input"
import {TimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"
import "date-fns"
import "./Topbar.css"
import {logout} from "../Services/Services"
import moment from "moment-timezone"
import useWindowDimensions from "../Components/useWindowDimensions"
import useInterval from "../Components/useInterval"
import {Link} from "react-router-dom"
import ChatIcon from "@material-ui/icons/Chat"
import {io} from "socket.io-client"
import {isAutheticated} from "../auth"
import axios from "axios"
import HistoryIcon from "@material-ui/icons/History"
import {useHistory, useLocation, useParams} from "react-router-dom"
import noti from "./notification.mp3"
import AssignChats from "./AssignChats"
import {ChevronDown, ChevronUp, Smartphone} from "react-feather"
import GlobalContext from "../context/GlobalContext"
import {DesktopMac} from "@material-ui/icons"
var audio = new Audio(noti)

let socket
let users = []

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: "#3867d6",
	},
	avatar: {
		width: 60,
		height: 60,
	},
	name: {
		fontWeight: "bold",
		color: "white",
	},
	timeText: {
		fontSize: 15,
		color: "black",
		marginTop: 10,
		textAlign: "left",
	},
	typography: {
		padding: theme.spacing(2),
	},
	textContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	topContainer: {
		backgroundColor: "#e74c3c",
		width: "100%",
		height: 65,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		paddingLeft: 10,
		paddingRight: 10,
	},
}))

const TopBar = ({className, onMobileNavOpen, ...rest}) => {
	const globalContext = useContext(GlobalContext)

	const {state, expandAll} = globalContext

	const history = useHistory()
	const location = useLocation()
	const params = useParams()
	const classes = useStyles()
	const [AllTimeZones, setAllTimeZones] = useState(new Date())
	const [customTime, setCustomTime] = useState(false)
	const [customTimeArr, setCustomTimeArr] = useState("Asia/Kolkata")

	const [newUser, setNewUser] = useState(false)
	const [last24Hrs, setLast24Hrs] = useState(0)
	const [unseenNon, setUnseenNon] = useState(0)
	moment.tz.setDefault(customTimeArr)
	useInterval(() => {
		if (!customTime) {
			// Your custom logic here
			setAllTimeZones(new Date())
		}
	}, 1000)

	const timezoneArr = [
		{
			id: 1,
			title: "IST",
			tz: "Asia/Kolkata",
		},
		{
			id: 6,
			title: "EST",
			tz: "America/New_York",
		},

		{
			id: 7,
			title: "CST",
			tz: "America/Matamoros",
		},

		{
			id: 9,
			title: "MST",
			tz: "America/Boise",
		},

		{
			id: 3,
			title: "PST",
			tz: "America/Los_Angeles",
		},
	]

	const {width} = useWindowDimensions()

	const [open, setOpen] = React.useState(false)

	const [chatCount, setChatCount] = useState(0)
	const handleClickOpen = (data) => {
		setCustomTimeArr(data.tz)
		setCustomTime(true)
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		setCustomTimeArr("Asia/Kolkata")
	}

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)

		axios.get(`${process.env.REACT_APP_API_KEY}/last24chats`).then(({data}) => {
			const {hourCount, unseenCount} = data
			setLast24Hrs(hourCount)

			if (unseenCount > 0) {
				setNewUser(true)
				setChatCount(unseenCount)
				audio.play()
			}
		})

		axios.get(`${process.env.REACT_APP_API_KEY}/last24nonchats`).then(({data}) => {
			const {hourCount, unseenCount} = data

			setUnseenNon(unseenCount)
			// setLast24Hrs(hourCount)

			// if (unseenCount > 0) {
			// 	setNewUser(true)
			// 	setChatCount(unseenCount)
			// 	audio.play()
			// }
		})
		if (isAutheticated().roleId === 3) {
			socket.on("userWating", ({userID, roomID, type}) => {
				console.log(users)
				if (!users.find((el) => el === userID)) {
					users.push(userID)
					audio.play()

					setNewUser(true)
					setChatCount(users.length)
				}
			})
		}
		// return removeListners
	}, [])
	// const removeListners = () => {
	// 	socket.removeAllListeners()
	// }

	return (
		<AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
			<Toolbar>
				<IconButton color="inherit" onClick={onMobileNavOpen}>
					<MenuIcon />
				</IconButton>

				{location.pathname === "/statistics/mobile" ? (
					<IconButton
						onClick={() => history.push("/statistics")}
						variant="contained"
						color="primary"
						size="small"
						style={{
							marginRight: 5,
							float: "right",
						}}
					>
						<Smartphone style={{color: "white"}} />
					</IconButton>
				) : null}

				{timezoneArr.map((time, i) => (
					<div
						key={time.id}
						style={{
							display: "flex",
							width: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<div
							className={classes.textContainer}
							key={time.id}
							style={{
								flexDirection: "column",
								justifyContent: "center",
								marginTop: -10,
							}}
						>
							{/* <p className={classes.timeText} style={{color: "white", textAlign: "center"}}>
								{time.title}:{" "}
							</p> */}

							<div>
								<Chip
									avatar={<Avatar>{time.title.substr(0, 1)}</Avatar>}
									onClick={() => handleClickOpen(time)}
									style={{fontWeight: "bold"}}
									size={width > 700 ? "small" : "small"}
									label={moment
										.tz(AllTimeZones, customTimeArr)
										.clone()
										.tz(time.tz)
										.format("h:mm A")}
								/>

								{/* <p
									className={classes.timeText}
									style={{color: "white", textAlign: "center", fontWeight: "bold"}}
								>
									{moment(AllTimeZones).tz(time.tz).format("h:mm A")}
								</p> */}
							</div>
						</div>
					</div>
				))}

				<div>
					<Dialog open={open} onClose={handleClose}>
						<div style={{background: "#3f51b5"}}>
							<p
								style={{
									textAlign: "center",
									fontSize: 18,
									color: "white",
								}}
							>
								{timezoneArr.map((time) => {
									if (time.tz === customTimeArr) {
										return time.title
									}
								})}
							</p>
						</div>

						<MuiPickersUtilsProvider utils={MomentUtils}>
							<TimePicker
								value={AllTimeZones}
								onChange={setAllTimeZones}
								variant="static"
								todayLabel="now"
								label="12 hours"
							/>
						</MuiPickersUtilsProvider>
						<DialogActions>
							<Button onClick={() => setCustomTime(false)} color="primary">
								Current
							</Button>
							<Button onClick={handleClose} color="primary" autoFocus>
								Ok
							</Button>
						</DialogActions>
					</Dialog>
				</div>

				{isAutheticated() && isAutheticated().AgentDesc === "Accountants" ? null : (
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							alignItems: "center",
							width: "100%",
						}}
					>
						{isAutheticated().roleId === 3 && (
							<>
								{location.pathname.includes("/scheduler/mobile/") ? (
									<>
										<IconButton size="small" onClick={() => history.push("/scheduler")}>
											<DesktopMac style={{color: "white"}} />
										</IconButton>
										<IconButton onClick={() => expandAll(!state.expandAll)}>
											{state.expandAll ? (
												<ChevronUp
													style={{
														color: "white",
														float: "right",
														height: 30,
														width: 30,
													}}
												/>
											) : (
												<ChevronDown
													style={{
														color: "white",
														float: "right",
														height: 30,
														width: 30,
													}}
												/>
											)}
										</IconButton>
									</>
								) : null}

								<Link
									to="/room"
									style={{color: `${newUser ? "red" : "white"}`, marginRight: 5}}
									onClick={() => {
										setNewUser(false)
										users = []
										setChatCount(0)
									}}
								>
									<Badge badgeContent={chatCount} color="error" style={{marginRight: 5}}>
										<ChatIcon />
									</Badge>
								</Link>
								<Link
									to="/room"
									style={{
										color: "#fff",
										marginRight: 5,
									}}
								>
									<Badge badgeContent={last24Hrs} color="primary">
										<HistoryIcon />
									</Badge>
								</Link>
							</>
						)}
						<AssignChats />
					</div>
				)}

				<a
					href="/login"
					onClick={() => logout(() => console.log("logout successful"))}
					style={{color: "white"}}
				>
					<IconButton color="inherit">
						<InputIcon />
					</IconButton>
				</a>
			</Toolbar>
		</AppBar>
	)
}

TopBar.propTypes = {
	className: PropTypes.string,
	onMobileNavOpen: PropTypes.func,
}

export default TopBar
