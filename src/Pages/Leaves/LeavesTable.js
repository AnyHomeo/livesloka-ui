import MaterialTable from "material-table"
import React from "react"
import useWindowDimensions from "./../../Components/useWindowDimensions"
import {PlusCircle} from "react-feather"
import {useEffect} from "react"
import {useState} from "react"
import {Button, IconButton, Snackbar} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import moment from "moment"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import Axios from "axios"
import {isAutheticated} from "../../auth"
import LeavesTableMobile from "../Admin/Crm/MobileViews/LeavesTableMobile"
import useDocumentTitle from "../../Components/useDocumentTitle"
import {getAllLeaves} from "../../Services/Services"
let arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function LeavesTable() {
	useDocumentTitle("Leaves")

	const {height} = useWindowDimensions()
	const [rows, setRows] = useState([])
	const [snackBarOpen, setSnackBarOpen] = useState(false)
	const [success, setSuccess] = useState(false)
	const [response, setResponse] = useState("")
	const [dialogOpen, setDialogOpen] = useState(false)
	const [selectedDateToCancel, setSelectedDateToCancel] = useState(new Date())
	const [allUsers, setAllUsers] = useState([])
	const [selectedCustomer, setSelectedCustomer] = useState({})
	const [refresh, setRefresh] = useState(false)
	const [scheduleDays, setScheduleDays] = useState([])
	const [time, setTime] = useState("")

	useEffect(() => {
		getAllLeaves()
			.then((data) => {
				setRows(
					data.data.result.map((leave) => {
						return {
							_id: leave._id,
							firstName: leave.studentId.firstName,
							lastName: leave.studentId.lastName,
							className: leave.scheduleId.className,
							cancelledDate: leave.cancelledDate,
						}
					})
				)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [refresh])

	const handleSnackBarClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setSnackBarOpen(false)
	}

	const applyLeave = () => {
		Axios.post(`${process.env.REACT_APP_API_KEY}/cancelclass?isAdmin=true`, {
			cancelledDate: time,
			studentId: selectedCustomer._id,
		})
			.then((data) => {
				setDialogOpen(false)
				setSuccess(true)
				setResponse(data.data.message)
				setSnackBarOpen(true)
				setSelectedDateToCancel(new Date())
				setRefresh((prev) => !prev)
			})
			.catch((err) => {
				setDialogOpen(false)
				setSuccess(false)
				setResponse((err.response && err.response.data.error) || "Something went wrong!!")
				setSnackBarOpen(true)
				setSelectedDateToCancel(new Date())
				setRefresh((prev) => !prev)
			})
	}

	useEffect(() => {
		if (!allUsers.length && dialogOpen) {
			Axios.get(
				`${process.env.REACT_APP_API_KEY}/customers/all?params=firstName,lastName,subjectId`
			)
				.then((data) => {
					setAllUsers(data.data.result)
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}, [dialogOpen])

	useEffect(() => {
		if (Object.keys(selectedCustomer).length && selectedDateToCancel) {
			Axios.get(
				`${process.env.REACT_APP_API_KEY}/cancelclass/start/end?date=${moment(
					selectedDateToCancel
				).format("YYYY-MM-DD")}&agent=${isAutheticated().agentId}&customerId=${
					selectedCustomer._id
				}`
			)
				.then((data) => {
					setTime(data.data.result[0])
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}, [selectedDateToCancel, selectedCustomer])

	useEffect(() => {
		if (Object.keys(selectedCustomer).length) {
			Axios.get(
				`${process.env.REACT_APP_API_KEY}/cancelclass/days/${selectedCustomer._id}?agent=${
					isAutheticated().agentId
				}`
			)
				.then((data) => {
					setScheduleDays(data.data.result)
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}, [selectedCustomer])

	const {width} = useWindowDimensions()

	const [searchField, setSearchField] = useState()
	const [filteredData, setFilteredData] = useState()

	useEffect(() => {
		filterData()
	}, [searchField])

	const filterData = () => {
		function capitalizeFirstLetter(string) {
			return string?.charAt(0)?.toUpperCase() + string.slice(1)
		}

		let value = searchField

		let regex = new RegExp(`^${value}`, `i`)
		const sortedArr =
			groupedData &&
			groupedData.filter((x) => {
				return regex.test(x.date)
			})

		setFilteredData(sortedArr)
	}

	const [groupedData, setGroupedData] = useState()

	useEffect(() => {
		getLeavesGroupedData()
	}, [])

	const getLeavesGroupedData = async () => {
		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/cancelclass?groupedByDate=yes
		`)
			if (data) {
				setGroupedData(data?.data?.result)
			}
		} catch (error) {
			console.log(error.response)
		}
	}
	return (
		<div>
			<Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleSnackBarClose}>
				<Alert onClose={handleSnackBarClose} severity={success ? "success" : "warning"}>
					{response}
				</Alert>
			</Snackbar>
			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
				<DialogTitle id="alert-dialog-title">
					<h3>{"Add a Leave"}</h3>
				</DialogTitle>
				<DialogContent>
					<Autocomplete
						id="combo-box-demo"
						value={selectedCustomer}
						onChange={(e, v) => {
							if (v) {
								setSelectedCustomer(v)
							} else {
								setSelectedCustomer({})
							}
						}}
						options={allUsers}
						fullWidth
						style={{
							margin: "10px 0",
							minWidth: 310,
						}}
						getOptionLabel={(option) =>
							option.firstName
								? `${option.firstName ? option.firstName : ""} (${
										option.lastName ? option.lastName : ""
								  })`
								: ""
						}
						renderInput={(params) => (
							<TextField {...params} label="Select Customer" variant="outlined" />
						)}
					/>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<DatePicker
							margin="normal"
							fullWidth
							disablePast
							id="date-picker-dialog"
							label="Select Leave Date"
							key={scheduleDays}
							inputVariant="outlined"
							variant="static"
							value={selectedDateToCancel}
							onChange={(date, value) => {
								setSelectedDateToCancel(new Date(date))
							}}
							shouldDisableDate={(date) => {
								return !scheduleDays.includes(arr[new Date(date).getDay()])
							}}
						/>
					</MuiPickersUtilsProvider>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={applyLeave} color="primary">
						Add Leave
					</Button>
				</DialogActions>
			</Dialog>

			{width > 768 ? (
				<>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginTop: 15,
							marginBottom: 10,
						}}
					>
						<TextField
							onChange={(e) => setSearchField(e.target.value)}
							variant="outlined"
							label="Search"
							style={{width: "91%"}}
						/>

						<IconButton onClick={() => setDialogOpen(true)}>
							<PlusCircle />
						</IconButton>
					</div>

					{searchField ? (
						<>
							{filteredData?.map((data) => (
								<LeavesTableMobile data={data} setRefresh={setRefresh} tables={true} />
							))}
						</>
					) : (
						<>
							{groupedData?.map((data) => (
								<LeavesTableMobile data={data} setRefresh={setRefresh} tables={true} />
							))}
						</>
					)}
				</>
			) : (
				<div>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginTop: 15,
							marginBottom: 10,
						}}
					>
						<TextField
							onChange={(e) => setSearchField(e.target.value)}
							variant="outlined"
							label="Search"
							style={{width: "79%"}}
						/>
						<IconButton onClick={() => setDialogOpen(true)}>
							<PlusCircle />
						</IconButton>
					</div>

					{searchField ? (
						<>
							{filteredData &&
								filteredData.map((data) => (
									<LeavesTableMobile data={data} setRefresh={setRefresh} />
								))}
						</>
					) : (
						<>
							{groupedData?.map((data) => (
								<LeavesTableMobile data={data} setRefresh={setRefresh} />
							))}
						</>
					)}
				</div>
			)}
		</div>
	)
}

export default LeavesTable
