import React, {useEffect, useState} from "react"
import {Grid, Card, CardContent, IconButton, Button} from "@material-ui/core"
import {BlockPicker} from "react-color"
import SingleNotification from "./SingleNotification"
import {ReactSVG} from "react-svg"
import "./style.css"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import RenderAllFilters from "./RenderAllFilters"
import Axios from "axios"
import {addInField} from "../../Services/Services"
import Snackbar from "@material-ui/core/Snackbar"
import Alert from "@material-ui/lab/Alert"
import useWindowDimensions from "../../Components/useWindowDimensions"
import DateFnsUtils from "@date-io/date-fns"
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"
import {isAutheticated} from "../../auth"
import {TextField} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"

function NotificationSettings() {
	let initialNotificationDataState = {
		title: "Title",
		text: "this is a notification",
		color: "#fc5c65",
		icon: "info",
	}
	const [notificationData, setNotificationData] = useState(initialNotificationDataState)
	const [isForAll, setIsForAll] = useState(false)
	const [allAdminIds, setAllAdminIds] = useState([])
	const [queryFrom, setQueryFrom] = useState("customers")
	const [allCustomers, setAllCustomers] = useState([])
	const [refresh, setRefresh] = useState(false)
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "error",
	})
	const {width, height} = useWindowDimensions()
	const [allClassNames, setAllClassNames] = useState([])
	const [selectedClassNames, setSelectedClassNames] = useState([])
	const [allTeachers, setAllTeachers] = useState([])
	const [selectedTeachers, setSelectedTeachers] = useState([])
	const [allAgents, setAllAgents] = useState([])
	const [selectedAgents, setSelectedAgents] = useState([])
	const [expiryDate, setExpiryDate] = useState(new Date())
	const [broadCastTo, setBroadCastTo] = useState("customers")
	const [broadCastedToTeachers, setbroadCastedToTeachers] = useState([]);

	const submitForm = () => {
		if (!allAdminIds.length && !isForAll && broadCastTo==='customers') {
			setSnackbar({
				message: "Please Select Customers to Broadcast!",
				open: true,
				severity: "warning",
			})
			return
		}
		if (!broadCastedToTeachers.length && broadCastTo==='teachers') {
			setSnackbar({
				message: "Please Select Teachers to Broadcast!",
				open: true,
				severity: "warning",
			})
			return
		}
		if (!notificationData.text) {
			setSnackbar({
				message: "Please Enter notification Text!",
				open: true,
				severity: "warning",
			})
			return
		}
		let formData = {
			background:
				typeof notificationData.color === "object"
					? notificationData.color.hex
					: notificationData.color,
			icon: notificationData.icon,
			adminIds: isForAll ? [] : allAdminIds.map((customer) => customer._id),
			message: notificationData.text,
			title: notificationData.title,
			isForAll,
			broadCastedToTeachers:broadCastedToTeachers.map(i => i.id),
			broadCastTo,
			queryType: queryFrom,
			broadcastedBy: isAutheticated().agentId,
			scheduleIds: selectedClassNames.map((schedule) => schedule._id),
			teacherIds: selectedTeachers.map((teacher) => teacher.id),
			agentIds: selectedAgents.map((agent) => agent.id),
			expiryDate,
		}
		addInField("Add AdMessage", formData)
			.then((data) => {
				setRefresh((prev) => !prev)
				setSnackbar({
					message: "Notification Broadcasted Successfully!",
					open: true,
					severity: "success",
				})
				setNotificationData(initialNotificationDataState)
			})
			.catch((err) => {
				setSnackbar({
					message: "Error in Broadcasting a Notification!",
					open: true,
					severity: "error",
				})
				console.log(err)
			})
	}

	useEffect(() => {
		Axios.get(`${process.env.REACT_APP_API_KEY}/all/admins`)
			.then((data) => {
				setAllCustomers(data.data.result)
			})
			.catch((err) => {
				console.log(err, err.response)
			})
	}, [])

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}

		setSnackbar({
			message: "",
			open: false,
			severity: "error",
		})
	}

	useEffect(() => {
		setAllAdminIds([])
		setSelectedAgents([])
		setSelectedClassNames([])
		setSelectedTeachers([])
		setIsForAll(false)
	}, [queryFrom, broadCastTo])

	useEffect(() => {
		setAllAdminIds([])
		setIsForAll(false)
		setQueryFrom("customers")
	}, [refresh])

	const handleQueryFrom = (e, n) => {
		setQueryFrom(n)
	}

	useEffect(() => {
		if (!allTeachers.length) {
			Axios.get(`${process.env.REACT_APP_API_KEY}/teacher?params=id,TeacherName`)
				.then((data) => {
					setAllTeachers(data.data.result)
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}, [])

	return (
		<div className={"fluid-container"}>
			<Snackbar
				anchorOrigin={{vertical: "bottom", horizontal: "center"}}
				open={snackbar.open}
				autoHideDuration={6000}
			>
				<Alert onClose={handleClose} variant={"filled"} severity={snackbar.severity}>
					{snackbar.message}
				</Alert>
			</Snackbar>
			<h2
				style={{
					textAlign: "center",
					marginBottom: 20,
				}}
			>
				Broadcast a Notification
			</h2>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={12} md={6}>
					<Card className="messages-card">
						<CardContent className={"space-between"}>
							<div style={{marginBottom: 30}}>
								<div style={{textAlign: "center"}}>Broadcast Notification to</div>
								<ToggleButtonGroup
									value={broadCastTo}
									size={width < 500 ? "small" : "medium"}
									exclusive
									onChange={(e, n) => setBroadCastTo(n)}
									aria-label="Send to"
								>
									<ToggleButton value="customers" aria-label="customers">
										Customers
									</ToggleButton>
									<ToggleButton value="teachers" aria-label="classname">
										Teachers
									</ToggleButton>
								</ToggleButtonGroup>
							</div>
							{broadCastTo === "customers" ? (
								<>
									<div>Filter Customers By</div>
									<div>
										<ToggleButtonGroup
											value={queryFrom}
											size={width < 500 ? "small" : "medium"}
											exclusive
											onChange={handleQueryFrom}
											aria-label="text formatting"
										>
											<ToggleButton value="customers" aria-label="customers">
												Customers
											</ToggleButton>
											<ToggleButton value="classname" aria-label="classname">
												Class Name
											</ToggleButton>
											<ToggleButton value="teacher" aria-label="teacher">
												Teacher
											</ToggleButton>
											<ToggleButton value="agent" aria-label="agent">
												Agent
											</ToggleButton>
										</ToggleButtonGroup>
									</div>
									<RenderAllFilters
										isForAll={isForAll}
										setIsForAll={setIsForAll}
										queryFrom={queryFrom}
										allAdminIds={allAdminIds}
										setAllAdminIds={setAllAdminIds}
										allCustomers={allCustomers}
										agentStateAndSetStates={{
											allAgents,
											setAllAgents,
											selectedAgents,
											setSelectedAgents,
										}}
										teacherStateAndSetState={{
											allTeachers,
											setAllTeachers,
											selectedTeachers,
											setSelectedTeachers,
										}}
										classStateAndSetStates={{
											selectedClassNames,
											setSelectedClassNames,
											allClassNames,
											setAllClassNames,
										}}
									/>
								</>
							) : (
								<Autocomplete
									style={{
										maxWidth: 400,
										margin: "auto",
									}}
									limitTags={5}
									getOptionSelected={(option, value) => option.id === value.id}
									fullWidth
									options={allTeachers}
									getOptionLabel={(name) => name.TeacherName}
									onChange={(event, value) => {
										if (value) {
											setbroadCastedToTeachers(value)
										}
									}}
									multiple
									value={broadCastedToTeachers}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Select Teachers"
											variant="outlined"
											placeholder="Customers"
											margin="normal"
										/>
									)}
								/>
							)}
							<div style={{width: 400}}>
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<DateTimePicker
										margin="normal"
										fullWidth
										disablePast
										id="date-picker-dialog"
										label="Select Expiry date"
										inputVariant="outlined"
										value={expiryDate}
										onChange={(date) => {
											setExpiryDate(new Date(date))
										}}
									/>
								</MuiPickersUtilsProvider>
							</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									margin: 20,
								}}
							>
								<Button variant="contained" onClick={submitForm} color="primary">
									Broadcast
								</Button>
							</div>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={12} md={6}>
					<Card className="messages-card">
						<CardContent className={"space-between"}>
							<h2
								style={{
									textAlign: "center",
									margin: 10,
								}}
							>
								Live Preview
							</h2>
							<div style={{position: "relative"}}>
								<div className="pickers-row-icons">
									<div
										className="icons-picker"
										style={{
											backgroundColor:
												typeof notificationData.color === "object"
													? notificationData.color.hex
													: notificationData.color,
										}}
									>
										<div
											style={{
												borderTopColor:
													typeof notificationData.color === "object"
														? notificationData.color.hex
														: notificationData.color,
											}}
											className="icon-picker-triangle"
										/>
										{["alert-circle", "alert-triangle", "check-circle", "info"].map((icon) => (
											<IconButton
												size={"small"}
												onClick={() =>
													setNotificationData((prev) => ({
														...prev,
														icon,
													}))
												}
											>
												<ReactSVG src={require(`./icons/${icon}.svg`)} />
											</IconButton>
										))}
									</div>
								</div>
								<SingleNotification
									{...notificationData}
									setNotificationData={setNotificationData}
								/>
								<div className="pickers-row-color">
									<BlockPicker
										color={notificationData.color}
										key={notificationData.color}
										onChangeComplete={(c) => setNotificationData((prev) => ({...prev, color: c}))}
										colors={[
											"#fc5c65",
											"#fed330",
											"#4b6584",
											"#3B3B98",
											"#2C3A47",
											"#2ecc71",
											"#b33939",
										]}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</div>
	)
}

export default NotificationSettings
