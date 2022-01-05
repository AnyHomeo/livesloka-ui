import React, {useEffect, useState} from "react"
import NonSidebar from "./NonChat/NonSidebar"
import NonChat from "./NonChat/NonChat"
import {useParams} from "react-router"
import {makeStyles} from "@material-ui/core/styles"
import {
	Box,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Switch,
	Tab,
	Tabs,
} from "@material-ui/core"
import {useHistory} from "react-router-dom"
import axios from "axios"

import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import {io} from "socket.io-client"

let socket
const ChatRoom = () => {
	const {roomID} = useParams()
	const history = useHistory()
	const useStyles = makeStyles({
		root: {
			flexGrow: 1,
		},
		formControl: {
			minWidth: 120,
		},
		cardContent: {
			display: "flex",
			flexDirection: "column",
			rowGap: "22px",
		},
	})

	const classes = useStyles()
	const [value, setValue] = useState(1)
	const [isClosed, SetIsClosed] = useState(false)

	const [time, setTime] = React.useState(5)

	const handleChangeSeconds = (event) => {
		setTime(event.target.value)
		axios
			.post(`${process.env.REACT_APP_API_KEY}/updateTimeNonChat`, {
				time: event.target.value,
			})
			.then(({data}) => {
				console.log(data)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const handleChange = (event, newValue) => {
		console.log(newValue)
		if (value !== newValue) {
			if (newValue === 1) {
				history.push("/nonroom")
			} else if (newValue === 0) {
				history.push("/room")
			} else if (newValue === 2) {
				history.push("/group")
			}
		}
	}

	useEffect(() => {
		socket = io.connect(`${process.env.REACT_APP_API_KEY}/`)
		axios
			.get(`${process.env.REACT_APP_API_KEY}/getNonChatConfig`)
			.then(({data}) => {
				const {show, time, responseMesssages} = data[0]

				setTime(time)
				SetIsClosed(show)
				// console.log(result)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])
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
		<div className="app">
			<div className="app_body">
				<NonSidebar></NonSidebar>
				{!!roomID ? (
					<NonChat />
				) : (
					<Paper
						className={classes.root}
						style={{
							flex: "0.75 1",
						}}
					>
						<Tabs
							value={value}
							onChange={handleChange}
							indicatorColor="primary"
							textColor="primary"
							centered
						>
							<Tab label="Room" />
							<Tab label="Non Room" />
							<Tab label="Groups" />
						</Tabs>

						<Box display="flex" justifyContent="center" alignItems="center" marginTop={"25vh"}>
							{" "}
							<Card style={{minWidth: 200}}>
								<CardContent className={classes.cardContent}>
									<FormControl className={classes.formControl}>
										<InputLabel id="demo-simple-select-label">Open Chat in (sec)</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={time}
											onChange={handleChangeSeconds}
											fullWidth
										>
											<MenuItem value={1}>1</MenuItem>
											<MenuItem value={3}>3</MenuItem>
											<MenuItem value={5}>5</MenuItem>
											<MenuItem value={7}>7</MenuItem>
											<MenuItem value={9}>9</MenuItem>
											<MenuItem value={11}>11</MenuItem>
											<MenuItem value={13}>13</MenuItem>
											<MenuItem value={15}>15</MenuItem>
										</Select>
									</FormControl>
									<FormControlLabel
										control={<Switch checked={isClosed} onChange={handelClosed} />}
										label={`${isClosed ? "Chat Opened" : "Chat Hidden"}`}
									/>
								</CardContent>
							</Card>
						</Box>
					</Paper>
				)}
			</div>
		</div>
	)
}

export default ChatRoom
