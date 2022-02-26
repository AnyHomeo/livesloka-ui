import React, {useCallback, useEffect, useState} from "react"
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
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import {useSnackbar} from "notistack"
import moment from "moment"
import {capitalize, CircularProgress, Grid, Tooltip} from "@material-ui/core"
import {Copy, RefreshCcw, Trash, User} from "react-feather"
import {useConfirm} from "material-ui-confirm"
import styles from "./style.module.scss"
import {deleteOptions, getOptions, retryScheduleWithOptions} from "../../Services/Services"

let days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]

const useRowStyles = makeStyles({
	root: {
		"& > *": {
			borderBottom: "unset",
		},
	},
})

const copyToClipboard = (text) => {
	var textField = document.createElement("textarea")
	textField.innerText = text
	document.body.appendChild(textField)
	textField.select()
	document.execCommand("copy")
	textField.remove()
}

const Row = ({row, getBackData}) => {
	console.log(row)

	const confirm = useConfirm()
	const {enqueueSnackbar} = useSnackbar()

	const [open, setOpen] = React.useState(false)
	const classes = useRowStyles()
	const [loading, setLoading] = useState(false)

	const onDeleteRow = async (id) => {
		setLoading(true)
		try {
			confirm({
				title: "Do you really want to delete?",
				confirmationText: "Yes!, Delete",
			})
			await deleteOptions(id)
			setLoading(false)
			getBackData(true)
			enqueueSnackbar("Deleted option successfully")
		} catch (error) {
			console.log(error)
			setLoading(false)
			enqueueSnackbar(error?.response?.data?.message || "Failed deleting option")
		}
	}

	const onRetrySchedule = async (id) => {
		try {
			await confirm({
				title: "Do you really want to manually schedule from options?",
				confirmationText: "Yes!",
			})
			await retryScheduleWithOptions(id)
			getBackData(true)
			enqueueSnackbar("Scheduled class successfully")
		} catch (error) {
			console.log(error)
			enqueueSnackbar(error?.response?.data?.message || "Failed to schedule class")
		}
	}

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.studentName}
				</TableCell>
				<TableCell align="right">{row.teacherName}</TableCell>
				<TableCell align="right">{moment(row.createdAt).format("MMMM Do YYYY")}</TableCell>
				<TableCell align="right">
					<Tooltip title="Copy options link">
						<IconButton
							onClick={() => copyToClipboard(`https://mylivesloka.com/options/${row.id}`)}
						>
							<Copy />
						</IconButton>
					</Tooltip>
					{/* <Tooltip title="Retry scheduling the options">
						<IconButton onClick={() => onRetrySchedule(row.id)}>
							<RefreshCcw />
						</IconButton>
					</Tooltip> */}
					<Tooltip title="Delete options">
						<IconButton onClick={() => onDeleteRow(row.id)} disabled={loading}>
							{loading ? <CircularProgress style={{height: 30, width: 30}} /> : <Trash />}
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Slots & Schedules
							</Typography>
							<Grid container spacing={2}>
								{row.history[0].map((item, i) => (
									<Grid item sm={12} md={4} lg={3}>
										<div
											className={styles.option}
											style={
												item._id === row.selectedSlotId
													? {border: "2px solid green", borderRadius: 5}
													: {}
											}
										>
											{days.map((day, i) =>
												item[day.toLowerCase()] ? (
													<div>
														{`${capitalize(day.toLowerCase())}:${
															item[day.toLowerCase()].split("-")[1]
														}`}
													</div>
												) : (
													""
												)
											)}
										</div>
									</Grid>
								))}
								{row.history[1].map((item, i) => {
									let slots = item.scheduleDescription
										.split("(")
										.slice(1)
										.reduce((acc, singleSlot) => {
											let singleSlotArr = singleSlot.split("-")
											acc = {...acc, [singleSlotArr[0]]: singleSlotArr[1]}
											return acc
										}, {})
									return (
										<Grid item sm={12} md={4} lg={3}>
											<div
												className={styles.option}
												style={
													item._id === row.selectedSlotId
														? {border: "2px solid green", borderRadius: 5}
														: {}
												}
											>
												{days.map((day, i) =>
													slots[day] ? (
														<div>
															{capitalize(day.toLowerCase())}:{slots[day]}
														</div>
													) : (
														""
													)
												)}
												<div className={styles.scheduledClass}>
													<Tooltip title={item.className}>
														<User />
													</Tooltip>
												</div>
											</div>
										</Grid>
									)
								})}
							</Grid>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}

export default function Optionstable({refresh}) {
	const [rows, setRows] = useState([])

	const fetchOptions = useCallback(async () => {
		try {
			const optionsResponse = await getOptions()
			setRows(
				optionsResponse?.data?.result?.map((option) => ({
					...option,
					studentName: option?.customer?.firstName || "Deleted User",
					teacherName: option?.teacherData?.TeacherName || "Deleted Teacher",
					createdAt: option?.createdAt,
					history: [option.options, option.schedules],
					id: option._id,
				}))
			)
		} catch (error) {
			console.log(error)
		}
	}, [])

	useEffect(() => {
		fetchOptions()
	}, [refresh, fetchOptions])

	const getBackData = (flag) => {
		if (flag) {
			fetchOptions()
		}
	}

	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>Student name</TableCell>
						<TableCell align="right">Teacher name</TableCell>
						<TableCell align="right">Created at</TableCell>
						<TableCell align="right">Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row, i) => (
						<Row key={i} row={row} getBackData={getBackData} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
