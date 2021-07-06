import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Collapse from "@material-ui/core/Collapse"
import IconButton from "@material-ui/core/IconButton"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import TextField from "@material-ui/core/TextField"
import axios from "axios"
import {Edit, Delete} from "react-feather"
import Grid from "@material-ui/core/Grid"

import {getAttendanceByScheduleId} from "../../Services/Services"

import {
	Button,
	InputLabel,
	MenuItem,
	FormControl,
	CircularProgress,
	Snackbar,
	Chip,
	LinearProgress,
	Card,
} from "@material-ui/core"
import {Alert} from "@material-ui/lab"
import moment from "moment"
import Select from "@material-ui/core/Select"
import "./HistoryCells.css"
import useDocumentTitle from "../../Components/useDocumentTitle"
import {useQuery} from "react-query"
import {EnhancedEncryptionOutlined} from "@material-ui/icons"
const useRowStyles = makeStyles({
	root: {
		"& > *": {
			borderBottom: "unset",
		},
	},
})

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
}))

const ExtraTeacherDetails = ({open, scheduleId}) => {
	const [scheduleData, setscheduleData] = useState()

	useEffect(() => {
		if (scheduleId && open === true && !scheduleData) {
			getClassesBySchedule()
		}
	}, [open, scheduleId, scheduleData])

	const getClassesBySchedule = async () => {
		const data = await getAttendanceByScheduleId(scheduleId)
		setscheduleData(data && data.data.result)
	}

	return (
		<Collapse in={open} timeout="auto" unmountOnExit>
			<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Date</TableCell>
						<TableCell align="center">Time</TableCell>
						<TableCell align="center">Attedended Students</TableCell>
						<TableCell align="center">Requested Students</TableCell>
						<TableCell align="center">Absent Students</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{scheduleData ? (
						scheduleData.map((data) => (
							<TableRow>
								<TableCell component="th" scope="row">
									{data.date}
								</TableCell>
								<TableCell align="center">{data.time}</TableCell>
								<TableCell align="center">
									{data.customers.map((student) => (
										<Chip
											key={student._id}
											style={{marginBottom: 5}}
											label={
												student.firstName
													? student.firstName
													: student.email
													? student.email
													: "Noname"
											}
											size="medium"
										/>
									))}
								</TableCell>
								<TableCell align="center">
									{data.requestedStudents.map((student) => (
										<Chip
											key={student._id}
											style={{marginBottom: 5}}
											label={
												student.firstName
													? student.firstName
													: student.email
													? student.email
													: "No name"
											}
											size="medium"
											color="primary"
										/>
									))}
								</TableCell>
								<TableCell align="center">
									{data.absentees.map((student) => (
										<Chip
											key={student._id}
											style={{marginBottom: 5}}
											label={
												student.firstName
													? student.firstName
													: student.email
													? student.email
													: "No name"
											}
											size="medium"
											color="secondary"
										/>
									))}
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={5}>
								<LinearProgress />
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Collapse>
	)
}
function Row({setEditTotalSalary, EditTotalSalary, ...props}) {
	const {row} = props
	const [open, setOpen] = React.useState(false)
	const classes = useRowStyles()
	const [addAmount, setAddAmount] = useState("")
	const [addCommentText, setAddCommentText] = useState("")
	const [addCommentLoading, setAddCommentLoading] = useState(false)
	const [extrasInfo, setExtrasInfo] = useState(props.row.extras)
	const [editComment, setEditComment] = useState(false)
	const [editInfoItem, setEditInfoItem] = useState()

	const handleEditFields = (item) => {
		console.log(item)
		setEditComment(true)
		setEditInfoItem(item)
		setAddAmount(item.amount)
		setAddCommentText(item.comment)
		setEditTotalSalary(row.totalSalary)
	}

	const addComment = async (type) => {
		setAddCommentLoading(true)

		let formData = {}

		if (type === "add") {
			// row.totalSalary = parseInt(row.totalSalary) + parseInt(addAmount)
			formData = {
				month: props.date.split("-")[1] * 1,
				year: props.date.split("-")[0] * 1,
				comment: addCommentText,
				amount: addAmount,
				teacherId: props.row.id,
			}
		} else if (type === "update") {
			formData = {
				month: props.date.split("-")[1] * 1,
				year: props.date.split("-")[0] * 1,
				comment: addCommentText,
				amount: addAmount,
				teacherId: props.row.id,
				id: editInfoItem.id,
			}
		}

		try {
			const data = await axios.post(
				`${process.env.REACT_APP_API_KEY}/admin/${type}/ExtraAmounts`,
				formData
			)

			if (data.status === 200) {
				if (editComment) {
					const editedComment = extrasInfo.map((value) => {
						if (value.id === editInfoItem.id) {
							let editedObj = value
							editedObj.amount = addAmount
							editedObj.comment = addCommentText
							return editedObj
						} else {
							return value
						}
					})

					setExtrasInfo(editedComment)
				} else {
					setExtrasInfo((prev) => [...prev, data?.data?.result])
				}
			}
			setAddCommentText("")
			setAddAmount("")
			setEditComment(false)
		} catch (error) {}
		setAddCommentLoading(false)
	}

	const onDeleteComment = async (item) => {
		try {
			const data = await axios.post(
				`${process.env.REACT_APP_API_KEY}/admin/delete/ExtraAmounts/${item.id}`
			)
			if (data.status === 200) {
				let removeDeletedItem = extrasInfo.filter((arr) => arr.id !== item.id)
				setExtrasInfo(removeDeletedItem)
			}
		} catch (error) {}
	}

	const TableRowDetails = ({
		noOfDays,
		noOfStudents,
		commission,
		totalSalary,
		className,
		scheduleId,
	}) => {
		const [newOpen, setnewOpen] = React.useState(false)

		return (
			<>
				<TableRow key={className}>
					<TableCell>
						<IconButton
							aria-label="expand row"
							size="small"
							onClick={() => {
								setnewOpen(!newOpen)
							}}
						>
							{newOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</TableCell>
					<TableCell component="th" scope="row">
						<p className="Tablecell">{className}</p>
					</TableCell>

					<TableCell>
						<p className="Tablecell">{noOfDays}</p>
					</TableCell>

					<TableCell>
						<p className="Tablecell">{noOfStudents}</p>
					</TableCell>
					<TableCell align="right">
						<p className="Tablecell">{commission}</p>
					</TableCell>

					<TableCell align="right">
						<p className="Tablecell">{totalSalary}</p>
					</TableCell>
				</TableRow>

				<TableRow>
					<TableCell colSpan="6">
						<ExtraTeacherDetails open={newOpen} scheduleId={scheduleId} />
					</TableCell>
				</TableRow>
			</>
		)
	}

	const cclasses = useStyles()

	console.log(EditTotalSalary)
	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					<p style={{fontWeight: "bold"}}>{row.name}</p>
				</TableCell>
				<TableCell>
					<p style={{fontWeight: "bold"}}>{row.totalSalary}</p>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<div
								style={{
									marginBottom: "40px",
									marginTop: "20px",
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div>
									<TextField
										id="outlined-basic"
										label="Amount"
										variant="outlined"
										onChange={(e) => setAddAmount(e.target.value)}
										value={addAmount}
									/>

									<TextField
										id="outlined-basic"
										label="Comment"
										variant="outlined"
										onChange={(e) => setAddCommentText(e.target.value)}
										value={addCommentText}
										style={{marginLeft: 20}}
									/>
								</div>

								<Button
									color="primary"
									variant="contained"
									disabled={addCommentLoading}
									onClick={() => {
										if (editComment) {
											addComment("update")
										} else {
											addComment("add")
										}
									}}
								>
									{addCommentLoading ? <CircularProgress /> : editComment ? "Update" : "Add"}
								</Button>
							</div>
							<div>
								<div className={cclasses.root}>
									<Grid container spacing={3}>
										{extrasInfo.map((item) => (
											<Grid key={item._id} item sm={3}>
												<Card
													style={{
														display: "flex",
														flexDirection: "column",
														padding: 10,
														marginTop: 5,
														width: 250,
													}}
												>
													<div
														style={{
															display: "flex",
															flexDirection: "column",
														}}
													>
														<p style={{fontSize: 15, fontWeight: "bold", marginTop: 5}}>
															{item.amount}
														</p>

														<p style={{fontSize: 15}}>{item.comment}</p>
													</div>

													<div
														style={{
															display: "flex",
															width: 100,
														}}
													>
														<IconButton onClick={() => handleEditFields(item)}>
															<Edit />
														</IconButton>

														<IconButton onClick={() => onDeleteComment(item)}>
															<Delete />
														</IconButton>
													</div>
												</Card>
											</Grid>
										))}
									</Grid>
								</div>
							</div>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>
											<p style={{fontWeight: "bold"}}></p>
										</TableCell>
										<TableCell>
											<p style={{fontWeight: "bold"}}>Class Name</p>
										</TableCell>
										<TableCell>
											<p style={{fontWeight: "bold"}}>No Of Days</p>
										</TableCell>
										<TableCell>
											<p style={{fontWeight: "bold"}}>No Of Students</p>
										</TableCell>
										<TableCell align="right">
											<p style={{fontWeight: "bold"}}>Commission</p>
										</TableCell>
										<TableCell align="right">
											<p style={{fontWeight: "bold"}}>Total Salary</p>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{Object.keys(row.details).map((historyRow) => {
										return (
											<>
												<TableRowDetails
													key={row.details[historyRow].scheduleId}
													scheduleId={row.details[historyRow].scheduleId}
													className={historyRow}
													noOfDays={row.details[historyRow].noOfDays}
													noOfStudents={row.details[historyRow].numberOfStudents}
													commission={row.details[historyRow].commission}
													totalSalary={row.details[historyRow].totalSalary}
												/>
											</>
										)
									})}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}

const TeacherSalary = () => {
	useDocumentTitle("Teacher's Salary")
	const [salaryData, setSalaryData] = useState()
	const [getDate, setGetDate] = useState()
	const [loading, setLoading] = useState(false)
	const [salDates, setSalDates] = useState([])
	const [successOpen, setSuccessOpen] = React.useState(false)

	const [totalSalaryVariable, setTotalSalaryVariable] = useState(0)
	const [EditTotalSalary, setEditTotalSalary] = useState()
	let totalSalaryVar = 0

	const handleChange = (event) => {
		setGetDate(event.target.value)
		getSalaries(event.target.value)
	}

	const getSalDates = async () => {
		const data = await axios.get(`${process.env.REACT_APP_API_KEY}/salary/months`)
		setSalDates(data && data.data.result)
	}

	const getSalaries = async (date) => {
		setLoading(true)
		try {
			const data = await axios.get(`${process.env.REACT_APP_API_KEY}/salary/all?month=${date}`)
			setSalaryData(data && data.data.finalDataObjectArr)

			data &&
				data.data.finalDataObjectArr.map((data) => {
					totalSalaryVar = totalSalaryVar + data.totalSalary
					setTotalSalaryVariable(totalSalaryVar)
				})
		} catch (error) {
			console.log(error.response)
			setSuccessOpen(true)
			setSalaryData()
		}
		setLoading(false)
	}

	useEffect(() => {
		getSalDates()
	}, [])

	const handleSuccessClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setSuccessOpen(false)
	}

	return (
		<>
			<Snackbar
				open={successOpen}
				autoHideDuration={6000}
				onClose={handleSuccessClose}
				anchorOrigin={{vertical: "bottom", horizontal: "left"}}
			>
				<Alert onClose={handleSuccessClose} severity="error">
					Error in retrieving salaries
				</Alert>
			</Snackbar>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<div style={{marginTop: "20px", width: 300}}>
					<FormControl variant="outlined" style={{width: "100%"}}>
						<InputLabel id="demo-simple-select-outlined-label">Select Month</InputLabel>
						<Select
							labelId="demo-simple-select-outlined-label"
							id="demo-simple-select-outlined"
							value={getDate}
							onChange={handleChange}
							label="Select Month"
						>
							{salDates &&
								salDates.map((dates) => (
									<MenuItem key={dates} value={dates}>
										{moment(dates).format("MMM YYYY")}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</div>
				<Card
					style={{
						width: 300,
						height: 100,
						marginTop: "30px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						textAlign: "center",
						marginTop: "8px",
						marginBottom: "15px",
						backgroundColor: "#1abc9c",
						color: "white",
					}}
				>
					<h1 style={{fontSize: "20px"}}>
						Total Salary : ₹{totalSalaryVariable.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
					</h1>
				</Card>
				{loading ? (
					<div style={{marginTop: 40}}>
						<CircularProgress />
					</div>
				) : (
					<div style={{width: "80%", marginTop: "40px"}}>
						<TableContainer component={Paper}>
							<Table aria-label="collapsible table">
								<TableHead>
									<TableRow>
										<TableCell />
										<TableCell>
											<h3 style={{color: "#2c3e50"}}>Teacher Name</h3>
										</TableCell>
										<TableCell>
											<h3 style={{color: "#2c3e50"}}>Total Salary</h3>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{salaryData &&
										salaryData.map((row) => (
											<Row
												key={row.id}
												row={row}
												date={getDate}
												setEditTotalSalary={setEditTotalSalary}
												EditTotalSalary={EditTotalSalary}
											/>
										))}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				)}
			</div>
		</>
	)
}

export default TeacherSalary
