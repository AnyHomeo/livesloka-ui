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
	ButtonBase,
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
import {Video, Copy, XCircle} from "react-feather"
import TableCard from "./TableCard"
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const copyToClipboard = (text) => {
	navigator.clipboard.writeText(text).then(
		function () {
			console.log("Async: Copying to clipboard was successful!")
		},
		function (err) {
			console.error("Async: Could not copy text: ", err)
		}
	)
}
const SchedulerModal = ({
	open,
	setOpen,
	selectedSchedule,
	setSelectedSchedule,
	fetchSchedules,
	teacherObj,
}) => {
	const [teacher, setTeacher] = useState("")
	const [teacherId, setTeacherId] = useState("")
	const [category, setCategory] = useState("")
	const {width} = useWindowDimensions()
	const [categorizedData, setCategorizedData] = useState({})
	const [allSchedules, setAllSchedules] = useState([])
	const confirm = useConfirm()
	const [availableSlotsEditingMode, setAvailableSlotsEditingMode] = useState(false)
	const [scheduleId, setScheduleId] = useState("")
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
	const meetingLink = useMemo(() => retrieveMeetingLink(selectedSchedule), [selectedSchedule])

	// useEffect(() => {
	// 	fetchSchedules()
	// }, [refresh])

	const timeZoneLookup = useMemo(
		() =>
			timeZones.reduce((acc, zone) => {
				acc[zone.id] = zone.timeZoneName
				return acc
			}, {}),
		[timeZones]
	)

	const deleteSchedule = async () => {
		try {
			setScheduleId("")
			confirm({
				description: "Do you Really want to Delete!",
				confirmationText: "Yes! delete",
			})
				.then(async () => {
					await Axios.get(`${process.env.REACT_APP_API_KEY}/schedule/delete/${scheduleId}`)
					fetchSchedules()
				})
				.catch(() => {})
		} catch (error) {
			console.error(error.response)
		}
	}

	console.log(selectedSchedule)
	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={() => setOpen(!open)}
			fullWidth
		>
			<DialogTitle id="alert-dialog-slide-title">{teacherObj.TeacherName}</DialogTitle>

			<div
				style={{
					display: "flex",
					marginTop: -10,
					justifyContent: "space-between",
					paddingLeft: 5,
					paddingRight: 5,
					alignItems: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Button
						style={{width: 10}}
						onClick={() => {
							copyToClipboard(meetingLink)
						}}
						edge="end"
					>
						<Copy />
					</Button>
					<p style={{fontSize: 10}}>Zoom</p>
				</div>

				<div>
					{selectedSchedule && (
						<>
							{toggleLoading ? (
								<CircularProgress style={{height: 30, width: 30}} />
							) : (
								<>
									<Switch
										checked={selectedSchedule.isClassTemperarilyCancelled}
										onChange={() => {
											// setToggleLoading(true)
											updateScheduleDangerously(selectedSchedule._id, {
												isClassTemperarilyCancelled: !selectedSchedule.isClassTemperarilyCancelled,
											})
												.then((response) => {
													setSelectedSchedule((prev) => {
														let prevData = {...prev}
														prevData.isClassTemperarilyCancelled =
															!selectedSchedule.isClassTemperarilyCancelled
														return prevData
													})

													fetchSchedules()
													// setToggleLoading(false)
												})
												.catch((error) => {
													console.log(error)
													setSuccess(false)
													setResponse("Something went wrong")
													setSnackBarOpen(true)
													setToggleLoading(false)
												})
										}}
										color="primary"
										inputProps={{"aria-label": "primary checkbox"}}
									/>
									<p style={{fontSize: 10}}>Cancel Class</p>
									{/* <div
										style={{
											height: 30,
											width: 30,
											borderRadius: "50%",
											backgroundColor: selectedSchedule.isClassTemperarilyCancelled
												? "#eb4d4b"
												: "#20bf6b",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											marginRight: 5,
										}}
									>
										<p
											style={{color: "white", fontSize: 18}}
											// onClick={() => toggleJoinButton(item, i)}

											onClick={() => {
												// setToggleLoading(true)
												updateScheduleDangerously(selectedSchedule._id, {
													isClassTemperarilyCancelled:
														!selectedSchedule.isClassTemperarilyCancelled,
												})
													.then((response) => {
														setSelectedSchedule((prev) => {
															let prevData = {...prev}
															prevData.isClassTemperarilyCancelled =
																!selectedSchedule.isClassTemperarilyCancelled
															return prevData
														})

														fetchSchedules()
														// setToggleLoading(false)
													})
													.catch((error) => {
														console.log(error)
														setSuccess(false)
														setResponse("Something went wrong")
														setSnackBarOpen(true)
														setToggleLoading(false)
													})
											}}
										>
											{selectedSchedule.isClassTemperarilyCancelled ? "E" : "C"}
										</p>
									</div> */}
								</>
							)}
						</>
					)}
				</div>
			</div>

			<DialogContent style={{padding: 6}}>
				{selectedSchedule && (
					<div
						style={{
							width: "100%",
						}}
					>
						<TableCard data={selectedSchedule.students} />
					</div>
				)}

				<span style={{}}>
					{selectedSchedule ? (
						<>
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
															fetchSchedules()
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
			<DialogActions
				style={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						width: "100%",
						marginBottom: 10,
						marginLeft: 8,
					}}
				>
					<Button onClick={() => setOpen(false)} variant="outlined" color="primary">
						<XCircle />
					</Button>
					<Link style={{textDecoration: "none"}} to={`/edit-schedule/${scheduleId}`}>
						<Button
							style={{width: "100%"}}
							variant="outlined"
							color="primary"
							// startIcon={<EditIcon />}
						>
							<EditIcon />
						</Button>
					</Link>
					<Button
						onClick={() => deleteSchedule()}
						variant="outlined"
						color="secondary"
						// startIcon={<DeleteIcon />}
					>
						<DeleteIcon />
					</Button>

					<Button
						onClick={() => window.open(meetingLink)}
						variant="outlined"
						style={{backgroundColor: "#2ecc71", color: "white"}}
						// startIcon={<AdjustIcon />}
					>
						<AdjustIcon />
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	)
}

export default SchedulerModal
