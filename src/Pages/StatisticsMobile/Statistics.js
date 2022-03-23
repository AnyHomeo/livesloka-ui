import React, {useEffect, useMemo, useState} from "react"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import SingleDayStats from "./SingleDayStats"
import WhatsAppIcon from "@material-ui/icons/WhatsApp"
import "./stats.css"
import {Box, Button, IconButton, InputAdornment, DialogActions} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import momentTZ from "moment-timezone"
import useDocumentTitle from "../../Components/useDocumentTitle"
import Snackbar from "@material-ui/core/Snackbar"
import Alert from "@material-ui/lab/Alert"
import {getTimeZones} from "../../Services/Services"
import {editCustomer} from "./../../Services/Services"
import {Link} from "react-router-dom"
import Axios from "axios"
import {useConfirm} from "material-ui-confirm"
import {retrieveMeetingLink} from "../../Services/utils"
import StatisticsMobile from "./StatisticsMobile"
import {Copy, XCircle} from "react-feather"
import AdjustIcon from "@material-ui/icons/Adjust"
import ToggleCancelClass from "../../Components/ToggleCancelClass"

let days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]

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

function TabPanel(props) {
	const {children, value, index, ...other} = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && <Box style={{padding: 5}}>{children}</Box>}
		</div>
	)
}

function Statistics() {
	useDocumentTitle("Statistics")
	const confirm = useConfirm()
	let initialValue = days.indexOf(
		momentTZ(new Date()).tz("Asia/Kolkata").format("dddd").toUpperCase()
	)
	const [value, setValue] = useState(initialValue)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogData, setDialogData] = useState({})
	const [successOpen, setSuccessOpen] = React.useState(false)
	const [alert, setAlert] = useState("")
	const [alertColor, setAlertColor] = useState("")
	const [refresh, setRefresh] = useState(false)
	const [timeZoneLookup, setTimeZoneLookup] = useState({})
	const [searchField, setsearchField] = useState("")
	useEffect(() => {
		getTimeZones()
			.then((result) => {
				return result.data.result
			})
			.then((data) => {
				console.log("getTimeZones data")
				console.log(data)

				var dynamicLookup = {}
				if (data) {
					data.forEach((timeZoneObj) => {
						dynamicLookup[timeZoneObj.id] = timeZoneObj.timeZoneName
					})
				}
				console.log("getTimeZones dynamicLookup")
				console.log(dynamicLookup)
				setTimeZoneLookup(dynamicLookup)
			})
	}, [])

	const handleSuccessClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setSuccessOpen(false)
	}

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const toggleJoinButton = async (rowData, i) => {
		console.log(rowData)
		try {
			await editCustomer({
				isJoinButtonEnabledByAdmin: !rowData.isJoinButtonEnabledByAdmin,
				_id: rowData._id,
			})
			setDialogData((prev) => {
				// let index = rowData.tableData.id
				let prevData = {...prev}
				prevData.students[i] = {
					...rowData,
					isJoinButtonEnabledByAdmin: !rowData.isJoinButtonEnabledByAdmin,
				}
				return prevData
			})
		} catch (error) {
			console.log(error)
		}
	}

	const toggleNewOldButton = async (rowData, i) => {
		try {
			await editCustomer({
				autoDemo: !rowData?.autoDemo,
				_id: rowData._id,
			})
			setDialogData((prev) => {
				// let index = rowData.tableData.id
				let prevData = {...prev}
				prevData.students[i] = {
					...rowData,
					autoDemo: !rowData?.autoDemo,
				}
				return prevData
			})
		} catch (error) {
			console.log(error)
		}
	}
	const deleteSchedule = async (id) => {
		setRefresh(false)
		try {
			confirm({
				description: "Do you Really want to Delete!",
				confirmationText: "Yes! delete",
			})
				.then(async () => {
					await Axios.get(`${process.env.REACT_APP_API_KEY}/schedule/delete/${id}`)
					// getAllSchedulesData()
					setDialogOpen(false)
					setRefresh(true)
				})
				.catch(() => {})
		} catch (error) {
			console.log(error.response)
		}
	}

	const meetingLink = useMemo(() => retrieveMeetingLink(dialogData), [dialogData])

	return (
		<div>
			<Snackbar
				open={successOpen}
				autoHideDuration={6000}
				onClose={handleSuccessClose}
				anchorOrigin={{vertical: "bottom", horizontal: "center"}}
			>
				<Alert variant="filled" onClose={handleSuccessClose} severity={alertColor}>
					{alert}
				</Alert>
			</Snackbar>
			<Dialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth={"md"}
			>
				<DialogTitle id="alert-dialog-title">
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
						<h2 style={{fontSize: 15}}>{dialogData?.teacher?.TeacherName}</h2>

						<IconButton
							onClick={() =>
								window.open(
									`https://api.whatsapp.com/send?phone=${
										dialogData.teacher &&
										dialogData.teacher.Phone_number.split("+")[1].split(" ").join("")
									}`
								)
							}
							edge="end"
						>
							<WhatsAppIcon />
						</IconButton>
					</div>
				</DialogTitle>

				<div
					style={{
						display: "flex",
						marginTop: 10,
						marginBottom: 20,
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<InputAdornment position="end">
						<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
							<Button onClick={() => copyToClipboard(meetingLink)} edge="end">
								<Copy />
							</Button>
							<p style={{fontSize: 10}}>Zoom</p>
						</div>
					</InputAdornment>
					<InputAdornment position="end">
						<ToggleCancelClass
							schedule={dialogData}
							setSchedule={setDialogData}
							onToggleSuccess={() => setRefresh((prev) => !prev)}
						/>
					</InputAdornment>
				</div>
				<DialogContent style={{padding: 6}}>
					<StatisticsMobile
						data={dialogData.students}
						timeZoneLookup={timeZoneLookup}
						toggleNewOldButton={toggleNewOldButton}
						toggleJoinButton={toggleJoinButton}
					/>
				</DialogContent>
				<DialogActions style={{padding: 6, justifyContent: "center"}}>
					<Button onClick={() => setDialogOpen(false)} variant="outlined" color="primary">
						<XCircle />
					</Button>
					<Link style={{textDecoration: "none"}} to={`/edit-schedule/${dialogData._id}`}>
						<Button variant="outlined" color="primary">
							<EditIcon />
						</Button>
					</Link>
					<Button
						onClick={() => deleteSchedule(dialogData._id)}
						variant="outlined"
						color="secondary"
					>
						<DeleteIcon />
					</Button>
					<Button
						onClick={() => window.open(meetingLink)}
						variant="outlined"
						style={{backgroundColor: "#2ecc71", color: "white"}}
					>
						<AdjustIcon />
					</Button>
				</DialogActions>
			</Dialog>
			<Tabs
				value={value}
				onChange={handleChange}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				aria-label="Statistics Page Tabs"
			>
				{days.map((day) => (
					<Tab key={day} label={`${day[0]}${day[1]}${day[2]}`} />
				))}
			</Tabs>

			{days.map((day, i) => (
				<TabPanel key={day} value={value} index={i} style={{padding: 0}}>
					<SingleDayStats
						refresh={refresh}
						day={day}
						setDialogOpen={setDialogOpen}
						setDialogData={setDialogData}
						alertSetStates={{setAlert, setAlertColor, setRefresh, setSuccessOpen}}
						value={value}
						isToday={value === initialValue}
						searchField={searchField}
					/>
				</TabPanel>
			))}
		</div>
	)
}

export default Statistics
