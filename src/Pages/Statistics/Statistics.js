import React, {useCallback, useEffect, useMemo, useState} from "react"
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
	TextField,
	Drawer,
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
import {getCommentsByCustomerIds, getTimeZones} from "../../Services/Services"
import {editCustomer} from "./../../Services/Services"
import {Link} from "react-router-dom"
import Axios from "axios"
import {useConfirm} from "material-ui-confirm"
import {copyToClipboard, getDaysToAdd, retrieveMeetingLink} from "../../Services/utils"
import {MessageCircle, Smartphone} from "react-feather"
import {useHistory} from "react-router-dom"
import Comments from "../Admin/Crm/Comments"
import ApplyTeacherLeaves from "../Leaves/ApplyTeacherLeaves"
import ToggleCancelClass from "../../Components/ToggleCancelClass"
import moment from "moment"

let days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]

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
	const [searchField, setSearchField] = useState("")
	const history = useHistory()
	useDocumentTitle("Statistics")
	const confirm = useConfirm()
	let initialValue = days.indexOf(
		momentTZ(new Date()).tz("Asia/Kolkata").format("dddd").toUpperCase()
	)
	const [value, setValue] = useState(initialValue)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogData, setDialogData] = useState({})
	const [refresh, setRefresh] = useState(false)
	const [timeZoneLookup, setTimeZoneLookup] = useState({})
	const [selectedCommentsCustomerId, setSelectedCommentsCustomerId] = useState("")
	const [latestComments, setLatestComments] = useState([])
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
		try {
			await confirm({
				description: "Do you Really want to Delete!",
				confirmationText: "Yes! delete",
			})
			await Axios.get(`${process.env.REACT_APP_API_KEY}/schedule/delete/${id}`)
			setDialogOpen(false)
			setRefresh((prev) => !prev)
		} catch (error) {
			console.log(error.response)
		}
	}
	console.log(dialogData)
	const meetingLink = useMemo(() => retrieveMeetingLink(dialogData), [dialogData])

	const mapLatestComments = useCallback(async () => {
		try {
			if (!selectedCommentsCustomerId && Object.keys(dialogData).length) {
				const commentsResponse = await getCommentsByCustomerIds(
					dialogData.students.map(({_id}) => _id)
				)
				const {result} = commentsResponse.data
				setLatestComments(result)
			}
		} catch (error) {
			console.log(error)
		}
	}, [dialogData, selectedCommentsCustomerId])

	useEffect(() => {
		mapLatestComments()
	}, [mapLatestComments])

	const [drawerState, setDrawerState] = useState({
		left: false,
	})

	const toggleDrawer = (anchor, open) => (event) => {
		setDrawerState({...drawerState, [anchor]: open})
	}

	return (
		<div>
			<ApplyTeacherLeaves
				isAddLeaveDialogOpen={openLeaveDialog}
				setIsAddLeaveDialogOpen={setOpenLeaveDialog}
				{...leaveData}
			/>
			<Drawer anchor={"left"} open={drawerState["left"]} onClose={toggleDrawer("left", false)}>
				<Comments
					commentsCustomerId={selectedCommentsCustomerId}
					drawerState={drawerState}
					setDrawerState={setDrawerState}
				/>
			</Drawer>
			<Dialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth="md"
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
								value={dialogData.teacher?.joinLink}
								fullWidth
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											onClick={() => copyToClipboard(dialogData.teacher?.joinLink)}
											edge="end"
										>
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
								title: "Comment",
								width: "1%",
								align: "left",
								editable: "never",
								cellStyle: {whiteSpace: "wrap"},
								headerStyle: {whiteSpace: "nowrap"},
								field: "comment",
								render: (rowData) => {
									let commentIndex = latestComments.findIndex(
										(comment) => comment.customer === rowData._id
									)
									if (commentIndex > -1) {
										let comment = latestComments[commentIndex]
										return comment.text
									}
								},
							},

							{
								field: "autoDemo",
								title: "Customer Type",
								type: "boolean",
								render: (rowData) => (
									<Chip label={rowData.autoDemo ? "New" : "Old"} size="small" color="primary" />
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
									setSelectedCommentsCustomerId(rowData._id)
									setDrawerState({...drawerState, left: true})
								},
							}),
						]}
					/>
				</DialogContent>
				<DialogActions>
					<ToggleCancelClass
						schedule={dialogData}
						setSchedule={setDialogData}
						onToggleSuccess={() => setRefresh((prev) => !prev)}
					/>
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
				{days.map((day, i) => (
					<Tab
						key={day}
						label={
							<div>
								<div style={{fontSize: 12, color: "#341f97"}}>{day}</div>
								<div style={{fontSize: 10, color: "#341f97", textTransform: "capitalize"}}>
									{moment().add(getDaysToAdd(i), "day").format("DD MMM")}{" "}
								</div>
							</div>
						}
					/>
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
				onClick={() => setRefresh((prev) => !prev)}
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
