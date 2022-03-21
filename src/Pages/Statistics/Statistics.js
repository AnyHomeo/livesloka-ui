import React, {useEffect, useMemo, useState} from "react"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import SingleDayStats from "./SingleDayStats"
import WhatsAppIcon from "@material-ui/icons/WhatsApp"
import "./stats.css"
import {
	Box,
	Button,
	Chip,
	FormControl,
	Icon,
	IconButton,
	InputAdornment,
	InputLabel,
	Tooltip,
	Switch,
	DialogActions,
	FormControlLabel,
	CircularProgress,
	TextField,
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
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
import {getTimeZones, updateScheduleDangerously} from "../../Services/Services"
import {editCustomer} from "./../../Services/Services"
import {Link} from "react-router-dom"
import Axios from "axios"
import {useConfirm} from "material-ui-confirm"
import {retrieveMeetingLink} from "../../Services/utils"
import {MessageCircle, Smartphone} from "react-feather"
import {useHistory} from "react-router-dom"
import Comments from "../Admin/Crm/Comments"
import ApplyTeacherLeaves from "../Leaves/ApplyTeacherLeaves"
import {useSnackbar} from "notistack"

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
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	)
}

function pageRefresh() {
	window.location.reload()
}

function Statistics() {
	const [searchField, setSearchField] = useState("")
	const history = useHistory()
	useDocumentTitle("Statistics")
	const confirm = useConfirm()
	const {enqueueSnackbar} = useSnackbar()
	let initialValue = days.indexOf(
		momentTZ(new Date()).tz("Asia/Kolkata").format("dddd").toUpperCase()
	)
	const [value, setValue] = useState(initialValue)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogData, setDialogData] = useState({})
	const [refresh, setRefresh] = useState(false)
	const [timeZoneLookup, setTimeZoneLookup] = useState({})
	const [loading, setLoading] = useState(false)
	const [selectedCustomerId, setSelectedCustomerId] = useState("")
	const [selectedCustomerName, setSelectedCustomerName] = useState("")
	const [isCommentsOpen, setIsCommentsOpen] = useState(false)
	const [openLeaveDialog, setOpenLeaveDialog] = useState(false)
	const [leaveData, setLeaveData] = useState({
		scheduleId: "",
		teacherId: "",
	})

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
				setTimeZoneLookup(dynamicLookup)
			})
	}, [])

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const toggleJoinButton = async (rowData) => {
		try {
			await editCustomer({
				isJoinButtonEnabledByAdmin: !rowData.isJoinButtonEnabledByAdmin,
				_id: rowData._id,
			})
			setDialogData((prev) => {
				let index = rowData.tableData.id
				let prevData = {...prev}
				prevData.students[index] = {
					...rowData,
					isJoinButtonEnabledByAdmin: !rowData.isJoinButtonEnabledByAdmin,
				}
				return prevData
			})
		} catch (error) {
			console.log(error)
		}
	}

	const toggleNewOldButton = async (rowData) => {
		try {
			await editCustomer({
				autoDemo: !rowData?.autoDemo,
				_id: rowData._id,
			})
			setDialogData((prev) => {
				let index = rowData.tableData.id
				let prevData = {...prev}
				prevData.students[index] = {
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

	const toggleisClassTemperarilyCancelled = async (id) => {
		setRefresh(false)
		setLoading(true)
		try {
			const data = await updateScheduleDangerously(dialogData._id, {
				isClassTemperarilyCancelled: !dialogData.isClassTemperarilyCancelled,
			})

			if (data.status === 200) {
				setDialogData((prev) => {
					let prevData = {...prev}
					prevData.isClassTemperarilyCancelled = !dialogData.isClassTemperarilyCancelled
					return prevData
				})

				setRefresh(true)
				setLoading(false)
			}
		} catch (error) {
			setLoading(false)
		}
	}

	const meetingLink = useMemo(() => retrieveMeetingLink(dialogData), [dialogData])

	return (
		<div>
			<ApplyTeacherLeaves
				isAddLeaveDialogOpen={openLeaveDialog}
				setIsAddLeaveDialogOpen={setOpenLeaveDialog}
				{...leaveData}
			/>

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
								value={meetingLink}
								fullWidth
								endAdornment={
									<InputAdornment position="end">
										<IconButton onClick={() => copyToClipboard(meetingLink)} edge="end">
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
								title: "Join",
								width: "1%",
								align: "center",
								editable: "never",
								cellStyle: {whiteSpace: "nowrap"},
								headerStyle: {whiteSpace: "nowrap"},
								field: "isJoinButtonEnabledByAdmin",
								render: (rowData) => (
									<Switch
										onChange={() => toggleJoinButton(rowData)}
										checked={rowData.isJoinButtonEnabledByAdmin}
										name="isJoinButtonEnabledByAdmin"
										inputProps={{"aria-label": "secondary checkbox"}}
									/>
								),
							},

							{
								title: "New/Old",
								width: "1%",
								align: "center",
								editable: "never",
								cellStyle: {whiteSpace: "nowrap"},
								headerStyle: {whiteSpace: "nowrap"},
								field: "autoDemo",
								render: (rowData) => (
									<Switch
										onChange={() => toggleNewOldButton(rowData)}
										checked={rowData?.autoDemo}
										name="autoDemo"
										inputProps={{"aria-label": "secondary checkbox"}}
									/>
								),
							},

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
								field: "autoDemo",
								title: "Customer Type",
								type: "boolean",
								render: (rowData) => {
									return (
										<>
											{rowData.autoDemo ? (
												<Chip label="New" size="small" color="primary" />
											) : (
												<Chip label="Old" size="small" color="secondary" />
											)}
										</>
									)
								},
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
								render: (rowData) =>
									rowData.autoDemo && rowData.paidTill
										? momentTZ(rowData.paidTill).format("MMM DD, YYYY")
										: rowData.numberOfClassesBought,
							},
							{
								title: "Time Zone",
								field: "timeZoneId",
								lookup: timeZoneLookup,
							},
							{
								field: "email",
								title: "User Id",
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
																: rowData.countryCode
																? rowData.countryCode + rowData.whatsAppnumber.split(" ").join("")
																: rowData.whatsAppnumber.split(" ").join("")
														}`
													)
												}
											>
												<WhatsAppIcon />
											</IconButton>
										</Tooltip>
										{rowData.countryCode} {rowData.whatsAppnumber}
									</div>
								),
							},
						]}
						data={dialogData.students}
						options={{
							paging: false,
						}}
						actions={[
							(rowData) => ({
								icon: () => <MessageCircle />,
								tooltip: "Add Comment",
								onClick: (event, rowData) => {
									setSelectedCustomerId(rowData._id)
									setSelectedCustomerName(rowData.firstName)
									setIsCommentsOpen(true)
								},
							}),
						]}
					/>
				</DialogContent>
				<Comments
					commentsCustomerId={selectedCustomerId}
					name={selectedCustomerName}
					isCommentsOpen={isCommentsOpen}
					setIsCommentsOpen={setIsCommentsOpen}
				/>
				<DialogActions>
					<FormControl variant="outlined">
						{loading ? (
							<CircularProgress style={{height: 30, width: 30, marginLeft: -50}} />
						) : (
							<FormControlLabel
								control={
									<Switch
										checked={dialogData.isClassTemperarilyCancelled}
										onChange={toggleisClassTemperarilyCancelled}
										name="cancelClass"
									/>
								}
								label="Enable to Cancel the Class"
							/>
						)}
					</FormControl>
					<Button
						onClick={() => {
							setDialogOpen(false)
							setOpenLeaveDialog(true)
							console.log(dialogData)
							setLeaveData({
								scheduleId: dialogData._id,
								teacherId: dialogData.teacher.id,
							})
						}}
						variant="text"
						color="primary"
					>
						Apply Leave
					</Button>
					<Button onClick={() => setDialogOpen(false)} variant="outlined" color="primary">
						Cancel
					</Button>
					<Link style={{textDecoration: "none"}} to={`/edit-schedule/${dialogData._id}`}>
						<Button variant="outlined" color="primary" startIcon={<EditIcon />}>
							Edit
						</Button>
					</Link>
					<Button
						onClick={() => deleteSchedule(dialogData._id)}
						variant="outlined"
						color="secondary"
						startIcon={<DeleteIcon />}
					>
						Delete
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
					<Tab key={day} label={day} />
				))}
			</Tabs>

			<TextField
				label="Search"
				variant="outlined"
				style={{
					color: "white",
					float: "right",
					marginRight: 5,
					marginTop: 5,
				}}
				size="small"
				onChange={(e) => setSearchField(e.target.value)}
			/>

			<Button
				variant="contained"
				color="primary"
				size="small"
				onClick={pageRefresh}
				endIcon={<Icon>refresh</Icon>}
				style={{
					marginLeft: 24,
					marginRight: 10,
					color: "white",
					float: "right",
					height: 40,
					marginTop: 5,
				}}
			>
				Refresh
			</Button>

			<IconButton
				onClick={() => history.push("/statistics/mobile")}
				variant="contained"
				color="primary"
				size="small"
				style={{
					marginTop: 10,
					float: "right",
				}}
			>
				<Smartphone style={{color: "black"}} />
			</IconButton>

			{days.map((day, i) => (
				<TabPanel key={day} value={value} index={i}>
					<SingleDayStats
						refresh={refresh}
						day={day}
						setDialogOpen={setDialogOpen}
						setDialogData={setDialogData}
						value={value}
						setRefresh={setRefresh}
						isToday={value === initialValue}
						searchField={searchField}
					/>
				</TabPanel>
			))}
		</div>
	)
}

export default Statistics
