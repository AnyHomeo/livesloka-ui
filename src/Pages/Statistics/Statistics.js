import React, { useEffect, useState } from "react"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import SingleDayStats from "./SingleDayStats"
import WhatsAppIcon from "@material-ui/icons/WhatsApp"
import "./stats.css"
import { Box, Button, Chip, FormControl, Icon, IconButton, InputAdornment, InputLabel, Tooltip } from "@material-ui/core"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import MaterialTable from "material-table"
import CancelIcon from "@material-ui/icons/Cancel"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import momentTZ from "moment-timezone"
import useDocumentTitle from "../../Components/useDocumentTitle"
import Snackbar from "@material-ui/core/Snackbar"
import Alert from "@material-ui/lab/Alert"
import { getTimeZones } from "../../Services/Services"


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
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	)
}

function pageRefresh() {
	window.location.reload();
}

function Statistics() {
	useDocumentTitle("Statistics")
	let initialValue = days.indexOf(momentTZ(new Date()).tz("Asia/Kolkata").format("dddd").toUpperCase())
	const [value, setValue] = useState(
		initialValue
	)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogData, setDialogData] = useState({})
	const [successOpen, setSuccessOpen] = React.useState(false)
	const [alert, setAlert] = useState("")
	const [alertColor, setAlertColor] = useState("")
	const [refresh, setRefresh] = useState(false)
	const [timeZoneLookup, setTimeZoneLookup] = useState({})

	useEffect(() => {
		getTimeZones().then((result) => {
			return (result.data.result)
		}).then((data) => {
			console.log("getTimeZones data")
			console.log(data)

			var dynamicLookup = {};
			if (data) {
				data.map((timeZoneObj) => {
					dynamicLookup[timeZoneObj.id] = timeZoneObj.timeZoneName
				})
			}
			console.log("getTimeZones dynamicLookup")
			console.log(dynamicLookup)
			setTimeZoneLookup(dynamicLookup);
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


	return (
		<div>
			<Snackbar
				open={successOpen}
				autoHideDuration={6000}
				onClose={handleSuccessClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
					<h2>Schedule Details</h2>
				</DialogTitle>
				<DialogContent>
					<div className="info-wrapper">
						<FormControl variant="outlined">
							<InputLabel htmlFor="Meeting-Link">Meeting Link</InputLabel>
							<OutlinedInput
								id="Meeting-Link"
								label="Meeting Link"
								value={dialogData.meetingLink}
								fullWidth
								endAdornment={
									<InputAdornment position="end">
										<IconButton onClick={() => copyToClipboard(dialogData.meetingLink)} edge="end">
											<FileCopyIcon />
										</IconButton>
									</InputAdornment>
								}
								labelWidth={70}
							/>
						</FormControl>
						<FormControl variant="outlined">
							<InputLabel htmlFor="teacher-whatsapp">Teacher Details</InputLabel>
							<OutlinedInput
								id="teacher-whatsapp"
								label="Teacher Details"
								value={dialogData.teacher && dialogData.teacher.TeacherName}
								fullWidth
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											onClick={() =>
												window.open(
													`https://api.whatsapp.com/send?phone=${dialogData.teacher &&
													dialogData.teacher.Phone_number.split("+")[1].split(" ").join("")
													}`
												)
											}
											edge="end"
										>
											<WhatsAppIcon />
										</IconButton>
									</InputAdornment>
								}
								labelWidth={70}
							/>
						</FormControl>
					</div>
					<MaterialTable
						title="Student Details"
						columns={[
							{
								field: "isStudentJoined",
								title: "Present",
								type: "boolean",
								render: (rowData) =>
									rowData.isStudentJoined ? (
										<CheckCircleIcon style={{ color: "green" }} />
									) : (
										<CancelIcon style={{ color: "red" }} />
									),
							},
							{
								field: "autoDemo",
								title: "Customer Type",
								type: "boolean",
								render: (rowData) =>
									rowData.autoDemo ? (
										<Chip label="New" size="small" color="primary" />
									) : (
										<Chip label="Old" size="small" color="secondary" />
									),
							},
							{
								field: "firstName",
								title: "Student",
								tooltip: "Sort by First Name",
							},
							{
								field: "lastName",
								title: "Parent",
								tooltip: "Sort by Last Name",
							},
							{
								field: "numberOfClassesBought",
								title: "Classes Left / Due Date",
								tooltip: "Sort by Classes Left",
								width: "1%",
								cellStyle: {whiteSpace: "nowrap"},
								headerStyle: {whiteSpace: "nowrap"},
								render: (rowData) => rowData.autoDemo ? momentTZ(rowData.paidTill).format("MMM DD, YYYY") : rowData.numberOfClassesBought
							},
							{
								title: "Time Zone",
								field: "timeZoneId",
								lookup: timeZoneLookup
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
									<div style={{ display: "flex", alignItems: "center" }}>
										<Tooltip title={`Message ${rowData.firstName} on Whatsapp`}>
											<IconButton
												onClick={() =>
													window.open(
														`https://api.whatsapp.com/send?phone=${rowData.whatsAppnumber.indexOf("+") !== -1
															? rowData.whatsAppnumber.split("+")[1].split(" ").join("")
															: rowData.whatsAppnumber.split(" ").join("")
														}`
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
						data={dialogData.students}
						options={{
							paging: false,
						}}
					/>
				</DialogContent>
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
					<Tab key={day} label={day} />
				))}
			</Tabs>

			<Button
				variant="contained"
				color="primary"
				size="small"
				onClick={pageRefresh}
				endIcon={<Icon>refresh</Icon>}
				style={{
					marginLeft: 24,
					marginRight: 24,
					marginTop: 10,
					color: 'white',
					float: 'right'
				}}
			>
				Refresh
			</Button>

			{days.map((day, i) => (
				<TabPanel key={day} value={value} index={i}>
					<SingleDayStats
						refresh={refresh}
						day={day}
						setDialogOpen={setDialogOpen}
						setDialogData={setDialogData}
						alertSetStates={{ setAlert, setAlertColor, setRefresh, setSuccessOpen }}
						value={value}
						isToday={value === initialValue}
					/>
				</TabPanel>
			))}
		</div>
	)
}

export default Statistics
