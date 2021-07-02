import React, {useEffect, useState} from "react"
import {Link, Link as RouterLink} from "react-router-dom"
import clsx from "clsx"
import PropTypes from "prop-types"
import {
	AppBar,
	Badge,
	Box,
	Hidden,
	IconButton,
	Toolbar,
	makeStyles,
	Typography,
	Popover,
	Chip,
	Dialog,
	DialogActions,
	Button,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined"
import TimerOutlinedIcon from "@material-ui/icons/TimerOutlined"
import InputIcon from "@material-ui/icons/Input"
import {TimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
// import Logo from 'src/components/Logo';
import "./Topbar.css"
import {logout} from "../Services/Services"
import moment from "moment-timezone"
import useWindowDimensions from "../Components/useWindowDimensions"
import useInterval from "../Components/useInterval"

import {useCallback} from "react"

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
	const classes = useStyles()

	const [AllTimeZones, setAllTimeZones] = useState(new Date())
	const [customTime, setCustomTime] = useState(false)
	const [customTimeArr, setCustomTimeArr] = useState("Asia/Kolkata")
	// const timeInverval = useCallback(() => {
	// 	if (!customTime) {
	// 		setAllTimeZones(new Date())
	// 	}
	// }, [customTime])

	// console.log(customTime)
	// useEffect(() => {
	// 	let timeinterval = setInterval(timeInverval, 1000)

	// 	return () => {
	// 		clearInterval(timeinterval)
	// 	}
	// }, [])

	useInterval(() => {
		if (!customTime) {
			// Your custom logic here
			setAllTimeZones(new Date())
		}
	}, 1000)

	// const timezoneArr = [
	// 	{
	// 		id: 1,
	// 		title: "IST",
	// 		tz: "Asia/Kolkata",
	// 	},

	// 	{
	// 		id: 2,
	// 		title: "ACST",
	// 		tz: "Australia/Broken_Hill",
	// 	},
	// 	{
	// 		id: 3,
	// 		title: "PST",
	// 		tz: "America/Los_Angeles",
	// 	},
	// 	{
	// 		id: 4,
	// 		title: "AEST",
	// 		tz: "Australia/Sydney",
	// 	},
	// 	{
	// 		id: 5,
	// 		title: "AWST",
	// 		tz: "Australia/Perth",
	// 	},
	// 	{
	// 		id: 6,
	// 		title: "EST",
	// 		tz: "America/New_York",
	// 	},
	// 	{
	// 		id: 7,
	// 		title: "CST",
	// 		tz: "America/El_Salvador",
	// 	},
	// 	{
	// 		id: 8,
	// 		title: "ACDT",
	// 		tz: "Australia/Broken_Hill",
	// 	},
	// 	{
	// 		id: 9,
	// 		title: "MST",
	// 		tz: "America/Creston",
	// 	},
	// 	{
	// 		id: 10,
	// 		title: "GMT",
	// 		tz: "Atlantic/Reykjavik",
	// 	},
	// 	{
	// 		id: 11,
	// 		title: "SGT",
	// 		tz: "Asia/Singapore",
	// 	},
	// ]

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
			tz: "America/Mazatlan",
		},

		{
			id: 3,
			title: "PST",
			tz: "America/Los_Angeles",
		},
	]

	const {width} = useWindowDimensions()

	const [open, setOpen] = React.useState(false)

	const handleClickOpen = (data) => {
		setCustomTimeArr(data.tz)
		moment.tz(AllTimeZones, data.tz)
		setCustomTime(true)
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
			<Toolbar>
				<IconButton color="inherit" onClick={onMobileNavOpen}>
					<MenuIcon />
				</IconButton>

				{timezoneArr.map((time, i) => (
					<div
						key={time.id}
						style={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center"}}
					>
						<div
							className={classes.textContainer}
							key={time.id}
							style={{flexDirection: "column", justifyContent: "center", marginTop: -10}}
						>
							<p className={classes.timeText} style={{color: "white", textAlign: "center"}}>
								{time.title}:{" "}
							</p>

							<div>
								<Chip
									onClick={() => handleClickOpen(time)}
									style={{fontWeight: "bold"}}
									size={width > 700 ? "large" : "small"}
									label={moment(AllTimeZones).tz(time.tz).format("h:mm A")}
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

				<Box flexGrow={1} />
				{/* <IconButton aria-describedby={id} onClick={handleClick}>
					<TimerOutlinedIcon style={{color: "white"}} />
				</IconButton> */}
				<div>
					<Dialog open={open} onClose={handleClose}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
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
								Reset
							</Button>
							<Button onClick={handleClose} color="primary" autoFocus>
								Ok
							</Button>
						</DialogActions>
					</Dialog>
				</div>

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
