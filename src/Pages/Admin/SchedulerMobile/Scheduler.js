import React, {useEffect, useMemo, useState} from "react"
import "./scheduler.css"
import OccupancyBars from "./OccupancyBars"
import {getOccupancy, updateScheduleDangerously} from "../../../Services/Services"
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	InputAdornment,
	Slide,
	TextField,
	Tooltip,
	InputLabel,
	FormControl,
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import {FileCopyOutlined} from "@material-ui/icons"
import {Link} from "react-router-dom"
import Axios from "axios"
import {useConfirm} from "material-ui-confirm"
import AdjustIcon from "@material-ui/icons/Adjust"
import useDocumentTitle from "../../../Components/useDocumentTitle"
import MaterialTable from "material-table"
import WhatsAppIcon from "@material-ui/icons/WhatsApp"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import {getData} from "./../../../Services/Services"
import {copyToClipboard, isFuture, retrieveMeetingLink} from "../../../Services/utils"
import {useSnackbar} from "notistack"
import ToggleCancelClass from "../../../Components/ToggleCancelClass"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

function Scheduler() {
	useDocumentTitle("Timetable")
	const {enqueueSnackbar} = useSnackbar()

	const [allSchedules, setAllSchedules] = useState([])
	const confirm = useConfirm()
	const [scheduleId, setScheduleId] = useState("")
	const [selectedSchedule, setSelectedSchedule] = useState({})
	const [timeZones, setTimeZones] = useState([])

	useEffect(() => {
		getAllSchedulesData()
	}, [])

	const getAllSchedulesData = () => {
		getOccupancy().then((data) => {
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

	useEffect(() => {
		setSelectedSchedule(allSchedules.filter((schedule) => schedule._id === scheduleId)[0])
	}, [scheduleId, allSchedules])

	const timeZoneLookup = useMemo(
		() =>
			timeZones.reduce((acc, zone) => {
				acc[zone.id] = zone.timeZoneName
				return acc
			}, {}),
		[timeZones]
	)

	const meetingLink = useMemo(() => retrieveMeetingLink(selectedSchedule), [selectedSchedule])

	useEffect(() => {
		fetchcategorizedTeachers()
	}, [])

	const [teacherCategorizes, setTeacherCategorizes] = useState({})
	const fetchcategorizedTeachers = async () => {
		console.log(process.env.REACT_APP_API_KEY)
		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/api/teachers/categories`)

			console.table(data?.data?.result)
			setTeacherCategorizes(data?.data?.result)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<OccupancyBars categorizedData={teacherCategorizes} />

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
									<ToggleCancelClass
										schedule={selectedSchedule}
										setSchedule={setSelectedSchedule}
										onToggleSuccess={() => getAllSchedulesData()}
									/>
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
										{selectedSchedule.cancelledTill && isFuture(selectedSchedule.cancelledTill) ? (
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
																enqueueSnackbar(response.data.message)
															})
															.catch((error) => {
																console.error(error)
																enqueueSnackbar(
																	error?.response?.data?.message || "Something went wrong",
																	{variant: "error"}
																)
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
		</>
	)
}

export default Scheduler
