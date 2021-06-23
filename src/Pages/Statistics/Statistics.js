import React, {useState} from "react"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import SingleDayStats from "./SingleDayStats"
import WhatsAppIcon from "@material-ui/icons/WhatsApp"
import "./stats.css"
import {Box, FormControl, IconButton, InputAdornment, InputLabel, Tooltip} from "@material-ui/core"
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
import LoopIcon from "@material-ui/icons/Loop"
import {useConfirm} from "material-ui-confirm"
import {updateZoomLinkToNewOne} from "../../Services/Services"
import Snackbar from "@material-ui/core/Snackbar"
import Alert from "@material-ui/lab/Alert"

let days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]

const copyToClipboard = (text) => {
	var textField = document.createElement("textarea")
	textField.innerText = text
	document.body.appendChild(textField)
	textField.select()
	document.execCommand("copy")
	textField.remove()
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
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	)
}

function Statistics() {
	useDocumentTitle("Statistics")

	const [value, setValue] = useState(
		days.indexOf(momentTZ(new Date()).tz("Asia/Kolkata").format("dddd").toUpperCase())
	)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogData, setDialogData] = useState({})
	const [successOpen, setSuccessOpen] = React.useState(false)
	const [alert, setAlert] = useState("")
	const [alertColor, setAlertColor] = useState("")
  const [refresh, setRefresh] = useState(false);

	const confirm = useConfirm()

	const handleSuccessClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setSuccessOpen(false)
	}

	const resetZoomLink = (id) => {
		setDialogData({})
		setDialogOpen(false)
		confirm({
			description: "Do you Really want to Update Zoom Link!",
			confirmationText: "Yes!",
		})
			.then(() => {
				updateZoomLinkToNewOne(id)
					.then((data) => {
						console.log(data)
						setRefresh((prev) => !prev)
						setAlert(data.data.message)
            setAlertColor("success")
						setSuccessOpen(true)

          })
					.catch((err) => {
						console.log(err)
						setAlert(err.response.data.error)
						setAlertColor("warning")
            setSuccessOpen(true)
          })
			})
			.catch((err) => {})
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
										<IconButton onClick={() => resetZoomLink(dialogData._id)} edge="end">
											<LoopIcon />
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
										<CheckCircleIcon style={{color: "green"}} />
									) : (
										<CancelIcon style={{color: "red"}} />
									),
							},
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
															rowData.whatsAppnumber.indexOf("+") !== -1
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
			{days.map((day, i) => (
				<TabPanel key={day} value={value} index={i}>
					<SingleDayStats
						refresh={refresh}
						day={day}
						setDialogOpen={setDialogOpen}
						setDialogData={setDialogData}
					/>
				</TabPanel>
			))}
		</div>
	)
}

export default Statistics
