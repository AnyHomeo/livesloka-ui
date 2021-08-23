import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
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
import Axios from "axios"
import moment from "moment"
import {capitalize, CircularProgress, Grid, Tooltip} from "@material-ui/core"
import {Edit, Trash, User} from "react-feather"
import {useConfirm} from "material-ui-confirm"
import styles from "./style.module.scss"

let days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]

const useRowStyles = makeStyles({
	root: {
		"& > *": {
			borderBottom: "unset",
		},
	},
})

function createData(studentName, teacherName, createdAt, history, id) {
	return {
		studentName,
		teacherName,
		createdAt,
		history,
		id,
	}
}

function Row(props) {
	const {row, getBackData} = props
	const confirm = useConfirm()

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
				.then(async () => {
					const data = await Axios.delete(`${process.env.REACT_APP_API_KEY}/options/${id}`)
					setLoading(false)
					if (data.status === 200) {
						getBackData(true)
					}
				})
				.catch(() => {
					setLoading(false)
				})
		} catch (error) {
			console.log(error)
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
					<IconButton>
						<Edit />
					</IconButton>
					<IconButton onClick={() => onDeleteRow(row.id)} disabled={loading}>
						{loading ? <CircularProgress style={{height: 30, width: 30}} /> : <Trash />}
					</IconButton>
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
										<div className={styles.option}>
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
											<div className={styles.option}>
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

	useEffect(() => {
		fetchTableData()
	}, [refresh])

	const getBackData = (flag) => {
		if (flag) {
			fetchTableData()
		}
	}
	const fetchTableData = async () => {
		let tempArr = []
		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/options`)

			data &&
				data.data.result.map((item) => {
					let history = [item.options, item.schedules]
					let test = createData(
						item.customer.firstName,
						item.teacherData.TeacherName,
						item.createdAt,
						history,
						item._id
					)
					tempArr.push(test)
				})
		} catch (error) {}
		console.log(tempArr)
		setRows(tempArr)
	}

	console.log(rows)
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
