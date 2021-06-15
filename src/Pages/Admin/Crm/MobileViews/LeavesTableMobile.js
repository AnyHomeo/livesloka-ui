import React, {useState} from "react"
import {makeStyles} from "@material-ui/core/styles"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import DateFnsUtils from "@date-io/date-fns"
import {MuiPickersUtilsProvider, DateTimePicker} from "@material-ui/pickers"
import moment from "moment"
import {CircularProgress, IconButton, Snackbar} from "@material-ui/core"
import {Edit, ArrowRightCircle} from "react-feather"
import {deleteALeave, updateLeave} from "../../../../Services/Services"
import Alert from "@material-ui/lab/Alert"
import MaterialTable from "material-table"
import useWindowDimensions from "../../../../Components/useWindowDimensions"
import {useEffect} from "react"

const useStyles = makeStyles((theme) => ({
	root: {
		width: "95%",
		margin: "0 auto",
		marginTop: 5,
		marginBottom: 5,
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
		// marginRight: 20,
	},
	expanded: {},
	content: {
		"&$expanded": {
			marginBottom: 0,
			display: "flex",
			justifyContent: "space-between",
		},
	},
	subTitle: {
		marginTop: 10,
		marginBottom: 10,
	},
	noStudent: {
		fontSize: 14,
		opacity: 0.8,
	},
	flexContainer: {
		display: "flex",
		alignItems: "center",
		flexWrap: "wrap",
	},
}))

const AccordianInside = ({data, setRefresh, tables}) => {
	const [rows, setRows] = useState(data)
	const classes = useStyles()

	const handleSnackBarClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setSnackBarOpen(false)
	}

	const [editableDate, setEditableDate] = useState(false)

	const [selectedDate, setSelectedDate] = React.useState(data.cancelledDate)
	const [snackBarOpen, setSnackBarOpen] = useState(false)
	const [success, setSuccess] = useState(false)
	const [response, setResponse] = useState("")

	const [loading, setLoading] = useState(false)
	const handleDateChange = (date) => {
		setSelectedDate(date)
	}

	const onSubmitData = async () => {
		setLoading(true)
		const formData = {
			cancelledDate: selectedDate,
			className: data.className,
			firstName: data.firstName,
			lastName: data.lastName,
			_id: data._id,
		}

		try {
			const res = await updateLeave(formData)
			if (res?.status === 200) {
				setSuccess(true)
				setResponse(res?.data?.message)
				setSnackBarOpen(true)
				setEditableDate(false)
				setRefresh(true)
			}
		} catch (error) {
			if (error.response.status === 400) {
				setSuccess(false)
				setResponse("Something went wrong,Try again later")
				setSnackBarOpen(true)
			}
		}
		setLoading(false)
	}

	return (
		<div className={classes.root}>
			<Accordion>
				<AccordionSummary
					classes={{content: classes.content, expanded: classes.expanded}}
					expandIcon={<ExpandMoreIcon />}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<Typography className={classes.heading}>
							{data.studentId.firstName} {`(${data.studentId.lastName})`}
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails style={{display: "flex", flexDirection: "column"}}>
					<div>
						<div className={classes.flexContainer}></div>

						<div style={{marginTop: 5}}>
							<p className={classes.subTitle}>
								First Name: <span>{data.studentId.firstName}</span>{" "}
							</p>

							<p className={classes.subTitle}>
								Last Name: <span>{data.studentId.lastName}</span>{" "}
							</p>

							{editableDate ? (
								<div style={{marginTop: 15, marginLeft: -5}}>
									<MuiPickersUtilsProvider utils={DateFnsUtils}>
										<DateTimePicker
											label="Date (Timezone)"
											inputVariant="outlined"
											value={selectedDate}
											onChange={handleDateChange}
										/>
									</MuiPickersUtilsProvider>
								</div>
							) : (
								<p className={classes.subTitle}>
									Date (User Timezone):{" "}
									<span>{moment(data.cancelledDate).format("MMMM Do YYYY, h:mm:ss A")}</span>{" "}
								</p>
							)}

							<IconButton onClick={() => setEditableDate(true)}>
								{editableDate ? (
									<>
										{loading ? (
											<CircularProgress />
										) : (
											<ArrowRightCircle onClick={() => onSubmitData()} style={{color: "#2ecc71"}} />
										)}
									</>
								) : (
									<Edit />
								)}
							</IconButton>
						</div>
					</div>
				</AccordionDetails>
			</Accordion>
			<Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleSnackBarClose}>
				<Alert onClose={handleSnackBarClose} severity={success ? "success" : "warning"}>
					{response}
				</Alert>
			</Snackbar>
		</div>
	)
}

const LeavesTableMobile = ({data, setRefresh, tables}) => {
	const [rows, setRows] = useState([])

	const handleSnackBarClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setSnackBarOpen(false)
	}

	const [snackBarOpen, setSnackBarOpen] = useState(false)
	const [success, setSuccess] = useState(false)
	const [response, setResponse] = useState("")
	useEffect(() => {
		setRows(data.data)
	}, [])
	const classes = useStyles()
	const {height} = useWindowDimensions()

	console.log(rows)
	return (
		<div className={classes.root}>
			<Accordion>
				<AccordionSummary
					classes={{content: classes.content, expanded: classes.expanded}}
					expandIcon={<ExpandMoreIcon />}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<Typography className={classes.heading}>
							{/* {moment(data.cancelledDate).format("MMMM Do YYYY")} */}
							{data.date}
						</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					{tables ? (
						<>
							<MaterialTable
								title=""
								columns={[
									{
										title: "First Name",
										field: "studentId.firstName",
										type: "string",
										editable: "never",
									},
									{
										title: "Last Name",
										field: "studentId.lastName",
										type: "string",
										editable: "never",
									},
									{
										title: "Class Name",
										field: "scheduleId.className",
										editable: "never",
										type: "string",
									},
									{
										title: "Date(User TimeZone)",
										field: "cancelledDate",
										type: "datetime",
										customFilterAndSearch: (filter, row, col) => {
											return col.render(row).toLowerCase().indexOf(filter.toLowerCase()) !== -1
										},
										render: (rowData) =>
											moment(rowData.cancelledDate).format("MMMM Do YYYY, h:mm:ss A"),
									},
								]}
								style={{
									margin: "20px",
									padding: "20px",
								}}
								data={rows}
								options={{search: false}}
								editable={{
									onRowUpdate: (newData, oldData) => {
										return updateLeave(newData)
											.then((fetchedData) => {
												if (fetchedData.data) {
													const dataUpdate = [...rows]
													const index = oldData.tableData.id
													dataUpdate[index] = newData
													setRows([...dataUpdate])
													setSuccess(true)
													setResponse(fetchedData.data.message)
													setSnackBarOpen(true)
												} else {
													setSuccess(false)
													setResponse(
														fetchedData.data.error || "Something went wrong,Try again later"
													)
													setSnackBarOpen(true)
												}
											})
											.catch((err) => {
												console.error(err)
												setSuccess(false)
												setResponse("Something went wrong,Try again later")
												setSnackBarOpen(true)
											})
									},
									onRowDelete: (oldData) =>
										deleteALeave(oldData._id)
											.then((res) => {
												const dataDelete = [...rows]
												const index = oldData.tableData.id
												dataDelete.splice(index, 1)
												setRows([...dataDelete])
												setSuccess(true)
												setResponse(res.data.message)
												setSnackBarOpen(true)
											})
											.catch((err) => {
												console.error(err, err.response)
												setSuccess(false)
												setResponse("unable to delete customer, Try again")
												setSnackBarOpen(true)
											}),
								}}
							/>
						</>
					) : (
						<>
							{data.data.map((item) => (
								<div style={{display: "flex", flexDirection: "column", flex: 1}}>
									<AccordianInside data={item} setRefresh={setRefresh} tables={tables} />
								</div>
							))}
						</>
					)}
				</AccordionDetails>
			</Accordion>
			<Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleSnackBarClose}>
				<Alert onClose={handleSnackBarClose} severity={success ? "success" : "warning"}>
					{response}
				</Alert>
			</Snackbar>
		</div>
	)
}

export default LeavesTableMobile
