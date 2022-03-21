import React, {useEffect, useMemo, useState} from "react"
import "./scheduler.css"
import OccupancyBars from "./OccupancyBars"
import useWindowDimensions from "../../../Components/useWindowDimensions"
import {
	addAvailableTimeSlot,
	deleteAvailableTimeSlot,
	getOccupancy,
	updateScheduleDangerously,
	createAChatGroupFromScheduleId,
	getOptionsOfATeacher,
} from "../../../Services/Services"
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	IconButton,
	InputAdornment,
	Slide,
	Switch,
	TextField,
	Snackbar,
	Tooltip,
	InputLabel,
	FormControl,
	Backdrop,
	CircularProgress,
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import {FileCopyOutlined} from "@material-ui/icons"
import {Link} from "react-router-dom"
import Axios from "axios"
import SingleBlock from "./SingleBlock"
import MuiAlert from "@material-ui/lab/Alert"
import {useConfirm} from "material-ui-confirm"
import AdjustIcon from "@material-ui/icons/Adjust"
import useDocumentTitle from "../../../Components/useDocumentTitle"
import MaterialTable from "material-table"
import WhatsAppIcon from "@material-ui/icons/WhatsApp"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import {getData} from "./../../../Services/Services"
import hours from "../../../Services/hours.json"
import times from "../../../Services/times.json"
import {retrieveMeetingLink} from "../../../Services/utils"

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

const copyToClipboard = () => {
	var textField = document.getElementById("meeting-link")
	textField.select()
	document.execCommand("copy")
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

function Scheduler() {
	useDocumentTitle("Timetable")

	const [teacher, setTeacher] = useState("")
	const [teacherId, setTeacherId] = useState("")
	const [category, setCategory] = useState("")
	const {width} = useWindowDimensions()
	const [categorizedData, setCategorizedData] = useState({})
	const [allSchedules, setAllSchedules] = useState([])
	const confirm = useConfirm()
	const [availableSlotsEditingMode, setAvailableSlotsEditingMode] = useState(false)
	const [scheduleId, setScheduleId] = useState("")
	const [selectedSchedule, setSelectedSchedule] = useState({})
	const [snackBarOpen, setSnackBarOpen] = useState(false)
	const [success, setSuccess] = useState(false)
	const [response, setResponse] = useState("")
	const [selectedSlots, setSelectedSlots] = useState([])
	const [refresh, setRefresh] = useState(false)
	const [loading, setLoading] = useState(false)
	const [toggleLoading, setToggleLoading] = useState(false)
	const [toggleShiftScheduleMode, setToggleShiftScheduleMode] = useState(false)
	const [options, setOptions] = useState({})
	const [timeZones, setTimeZones] = useState([])

	useEffect(() => {
		getAllSchedulesData()
	}, [refresh])

	const getAllSchedulesData = () => {
		getOccupancy().then((data) => {
			setCategorizedData(data.data.data)
			setAllSchedules(data.data.allSchedules)
		})
	}

	useEffect(() => {
		getData("Time Zone")
			.then((response) => {
				setTimeZones(response.data.result)
			})
			.catch((err) => {
				console.error(err)
			})
	}, [])

	const deleteSchedule = async () => {
		try {
			setScheduleId("")
			confirm({
				description: "Do you Really want to Delete!",
				confirmationText: "Yes! delete",
			})
				.then(async () => {
					await Axios.get(`${process.env.REACT_APP_API_KEY}/schedule/delete/${scheduleId}`)
					getAllSchedulesData()
				})
				.catch(() => {})
		} catch (error) {
			console.error(error.response)
		}
	}

	const handleSnackBarClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setSnackBarOpen(false)
	}

	const addOrRemoveAvailableSlot = (slot) => {
		if (!categorizedData[category][teacher].availableSlots.includes(slot)) {
			addAvailableTimeSlot(teacherId, slot)
				.then((data) => {
					setCategorizedData((prev) => ({
						...prev,
						[category]: {
							...prev[category],
							[teacher]: {
								...prev[category][teacher],
								availableSlots: [...prev[category][teacher].availableSlots, slot],
							},
						},
					}))
				})
				.catch((err) => console.error(err))
		} else {
			deleteAvailableTimeSlot(teacherId, slot)
				.then((data) => {
					setCategorizedData((prev) => {
						let allData = {...prev}
						let data = [...allData[category][teacher].availableSlots]
						let index = data.indexOf(slot)
						data.splice(index, 1)
						allData[category][teacher].availableSlots = data
						return allData
					})
				})
				.catch((err) => {
					console.error(err)
				})
		}
	}

	const createGroup = (schedule) => {
		if (!schedule.group) {
			confirm({
				title: "Create Group",
				description: "Do you really want to create group?",
			}).then(() => {
				createAChatGroupFromScheduleId(schedule._id).then((data) => {
					let groupId = data.data.result
					setAllSchedules((prev) => {
						let prevData = [...prev]
						return prevData.map((prevSchedule) => {
							if (prevSchedule._id === schedule._id) {
								return {
									...prevSchedule,
									group: groupId,
								}
							} else {
								return prevSchedule
							}
						})
					})
				})
			})
		}
	}

	useEffect(() => {
		setSelectedSchedule(allSchedules.filter((schedule) => schedule._id === scheduleId)[0])
	}, [scheduleId, allSchedules])

	useEffect(() => {
		if (teacherId) {
			getOptionsOfATeacher(teacherId)
				.then((response) => {
					setOptions(
						response.data.result.reduce((acc, option) => {
							const {options, schedules, customer} = option
							options.forEach((option) => {
								Object.keys(option).forEach((day) => {
									if (day !== "_id") {
										let slot = option[day]
										if (!acc[slot]) {
											acc[slot] = [customer.firstName]
										} else {
											acc[slot].push(customer.firstName)
										}
									}
								})
							})

							schedules.forEach((schedule) => {
								const {slots} = schedule
								Object.keys(slots).forEach((day) => {
									let slot = slots[day]
									slot.forEach((slot) => {
										if (!acc[slot]) {
											acc[slot] = [customer?.firstName]
										} else {
											acc[slot].push(customer?.firstName)
										}
									})
								})
							})

							return acc
						}, {})
					)
				})
				.catch((err) => {
					console.error(err)
				})
		}
	}, [teacherId])

	const timeZoneLookup = useMemo(
		() =>
			timeZones.reduce((acc, zone) => {
				acc[zone.id] = zone.timeZoneName
				return acc
			}, {}),
		[timeZones]
	)

	const meetingLink = useMemo(
		() =>  retrieveMeetingLink(selectedSchedule),
		[selectedSchedule]
	)

	return (
		<>
			<Backdrop style={{zIndex: 5000}} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<OccupancyBars
				categorizedData={categorizedData}
				setTeacher={setTeacher}
				setTeacherId={setTeacherId}
				setCategory={setCategory}
			/>
			<Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleSnackBarClose}>
				<Alert onClose={handleSnackBarClose} severity={success ? "success" : "warning"}>
					{response}
				</Alert>
			</Snackbar>
			<Dialog
				open={!!scheduleId}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setScheduleId("")}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
				fullWidth
				maxWidth={"md"}
			>
				<DialogTitle id="alert-dialog-slide-title">Schedule Details</DialogTitle>
				<DialogContent>
					<span
						style={{
							display: "flex",
							flexDirection: "row",
							flexWrap: "wrap",
						}}
					>
						{selectedSchedule ? (
							<>
								<div
									className="info-wrapper"
									style={{
										width: "100%",
										alignItems: "center",
										marginBottom: "5px",
									}}
								>
									<FormControl variant="outlined">
										<InputLabel htmlFor="Meeting-Link">Meeting Link</InputLabel>
										<OutlinedInput
											id="Meeting-Link"
											label="Meeting Link"
											value={meetingLink}
											fullWidth
											endAdornment={
												<InputAdornment position="end">
													<IconButton onClick={() => copyToClipboard(meetingLink)} edge="end">
														<FileCopyOutlined />
													</IconButton>
												</InputAdornment>
											}
											labelWidth={70}
										/>
									</FormControl>
									<FormControl variant="outlined">
										{toggleLoading ? (
											<CircularProgress style={{height: 30, width: 30}} />
										) : (
											<FormControlLabel
												control={
													<Switch
														checked={selectedSchedule.isClassTemperarilyCancelled}
														onChange={() => {
															setToggleLoading(true)
															updateScheduleDangerously(selectedSchedule._id, {
																isClassTemperarilyCancelled:
																	!selectedSchedule.isClassTemperarilyCancelled,
															})
																.then((response) => {
																	getAllSchedulesData()
																	setToggleLoading(false)
																})
																.catch((error) => {
																	console.log(error)
																	setSuccess(false)
																	setResponse("Something went wrong")
																	setSnackBarOpen(true)
																	setToggleLoading(false)
																})
														}}
														name="cancelClass"
													/> 
												}
												label="Enable to Cancel the Class"
											/>
										)}
									</FormControl>
								</div>
								<MaterialTable
									title="Student Details"
									columns={[
										{
											field: "firstName",
											title: "First Name",
											tooltip: "Sort by First Name",
										},
										{
											field: "lastName",
											title: "Last Name",
											tooltip: "Sort by Last Name",
										},
										{
											field: "timeZoneId",
											title: "Timezone",
											tooltip: "Timezone of customer",
											lookup: timeZoneLookup,
										},
										{
											field: "numberOfClassesBought",
											title: "Classes Left",
											tooltip: "Sort by Classes Left",
										},
										{
											field: "email",
											title: "Email",
											tooltip: "Sort by Email",
										},
										{
											field: "whatsAppnumber",
											title: "WhatsaApp Number",
											tooltip: "Sort by WhatsApp Number",
											render: (rowData) => (
												<div style={{display: "flex", alignItems: "center"}}>
													<Tooltip title={`Message ${rowData.firstName} on Whatsapp`}>
														<IconButton
															onClick={() =>
																window.open(
																	`https://api.whatsapp.com/send?phone=${
																		rowData.countryCode
																			? rowData.countryCode
																					.replace("+", "")
																					.replace(" ", "")
																					.replace("(", "")
																					.replace(")", "")
																					.trim()
																			: ""
																	}${rowData.whatsAppnumber
																		.replace("+", "")
																		.replace(" ", "")
																		.replace("(", "")
																		.replace(")", "")}`
																)
															}
														>
															<WhatsAppIcon />
														</IconButton>
													</Tooltip>
													{rowData.whatsAppnumber}
												</div>
											),
										},
									]}
									data={selectedSchedule.students}
									options={{
										paging: false,
									}}
								/>

								<div
									style={{
										width: "100%",
										marginTop: "5px",
									}}
								>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
										}}
									>
										{selectedSchedule.isClassTemperarilyCancelled ? (
											<>
												<TextField
													id="message"
													label="Message"
													fullWidth
													variant="outlined"
													value={selectedSchedule.message}
													onChange={(e) => {
														e.persist()
														setSelectedSchedule((prev) => {
															let oldSchedule = {...prev}
															let newSchedule = {
																...oldSchedule,
																message: e.target.value,
															}
															return newSchedule
														})
													}}
												/>
												<Button
													variant="contained"
													style={{marginLeft: "10px"}}
													color="primary"
													onClick={() => {
														updateScheduleDangerously(selectedSchedule._id, {
															message: selectedSchedule.message,
														})
															.then((response) => {
																getAllSchedulesData()
																setSuccess(true)
																setResponse(response.data.message)
																setSnackBarOpen(true)
															})
															.catch((error) => {
																console.error(error)
																setSuccess(false)
																setResponse(response.data.message)
																setSnackBarOpen(true)
															})
													}}
												>
													{" "}
													Submit{" "}
												</Button>
											</>
										) : (
											""
										)}
									</div>
								</div>
							</>
						) : (
							""
						)}
					</span>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setScheduleId("")} variant="outlined" color="primary">
						Cancel
					</Button>
					<Link style={{textDecoration: "none"}} to={`/edit-schedule/${scheduleId}`}>
						<Button variant="outlined" color="primary" startIcon={<EditIcon />}>
							Edit
						</Button>
					</Link>
					<Button
						onClick={() => deleteSchedule()}
						variant="outlined"
						color="secondary"
						startIcon={<DeleteIcon />}
					>
						Delete
					</Button>

					<Button
						onClick={() => window.open(meetingLink)}
						variant="outlined"
						style={{backgroundColor: "#2ecc71", color: "white"}}
						startIcon={<AdjustIcon />}
					>
						Join
					</Button>
				</DialogActions>
			</Dialog>
			{teacher && teacherId ? (
				<>
					<h1 style={{textAlign: "center", textTransform: "capitalize"}}>
						{" "}
						{teacher} Week Schedule{" "}
					</h1>
					<div style={{display: "flex", flexDirection: "row", padding: "20px"}}>
						<FormGroup>
							<FormControlLabel
								control={
									<Switch
										checked={availableSlotsEditingMode}
										onChange={() => setAvailableSlotsEditingMode((prev) => !prev)}
									/>
								}
								label="Adjust Slots"
							/>
						</FormGroup>
						<FormControlLabel
							control={
								<Switch
									checked={toggleShiftScheduleMode}
									onChange={() => setToggleShiftScheduleMode((prev) => !prev)}
								/>
							}
							label="DayLight Savings"
						/>
					</div>
					<div
						style={{
							height: "50px",
							display: "flex",
							flexDirection: "row",
							position: "sticky",
							top: "0px",
							backgroundColor: "white",
						}}
					>
						<div
							style={{
								width: width < 700 ? "10%" : "5%",
								backgroundColor: "#f1f2f6",
							}}
						/>
						<div
							style={{
								width: width < 700 ? "90%" : "95%",
								backgroundColor: "#f1f2f6",
							}}
						>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									flexWrap: "wrap",
								}}
							>
								{days.map((day, i) => (
									<div key={i} style={{}} className="schedulerHeader">
										{" "}
										{width < 700 ? day.toUpperCase().slice(0, 3) : day.toUpperCase()}
									</div>
								))}
							</div>
						</div>
					</div>
					<div style={{width: "100%", display: "flex", flexDirection: "row", position: "relative"}}>
						<div
							style={{
								width: width < 700 ? "10%" : "5%",
								backgroundColor: "#EAF0F1",
							}}
						>
							{hours.map((hour, i) => (
								<div key={i} className="time-header">
									{hour}
								</div>
							))}
						</div>
						<div style={{width: width < 700 ? "90%" : "95%"}}>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									flexWrap: "wrap",
								}}
							>
								{times.map((time, i) => {
									return (
										<React.Fragment key={i}>
											{days.map((day, j) => {
												return (
													<SingleBlock
														options={options}
														selectedSlots={selectedSlots}
														setSelectedSlots={setSelectedSlots}
														allSchedules={allSchedules}
														day={day}
														time={time}
														i={i}
														j={j}
														category={category}
														teacher={teacher}
														categorizedData={categorizedData}
														availableSlotsEditingMode={availableSlotsEditingMode}
														setScheduleId={setScheduleId}
														addOrRemoveAvailableSlot={addOrRemoveAvailableSlot}
														teacherID={teacherId}
														createGroup={createGroup}
														setRefresh={setRefresh}
														setLoading={setLoading}
														toggleShiftScheduleMode={toggleShiftScheduleMode}
													/>
												)
											})}
										</React.Fragment>
									)
								})}
							</div>
						</div>
						{selectedSlots.length ? (
							<div className="buttons">
								<Button
									variant="outlined"
									color="secondary"
									style={{marginRight: "20px"}}
									onClick={() => setSelectedSlots([])}
								>
									Cancel
								</Button>
								<Link to={`/availabe-scheduler/${selectedSlots.join(",")}/${teacherId}`}>
									<Button variant="contained" color="primary">
										Schedule
									</Button>
								</Link>
							</div>
						) : (
							""
						)}
					</div>
				</>
			) : (
				<span />
			)}
		</>
	)
}

export default Scheduler
