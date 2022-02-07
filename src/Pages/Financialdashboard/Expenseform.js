import {
	Button,
	CircularProgress,
	Container,
	FormControl,
	IconButton,
	makeStyles,
	TextField,
} from "@material-ui/core"
import React from "react"
import {useState} from "react"
import axios from "axios"
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import {useHistory} from "react-router-dom"
import {firebase} from "../../Firebase"
import {Paperclip} from "react-feather"
function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles(() => ({
	containter: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
		flexDirection: "column",
	},
	formContainer: {
		marginTop: 20,
		display: "flex",
		flexDirection: "column",
	},
	formField: {
		width: 275,
		marginTop: 15,
	},
	btn: {
		width: 275,
		border: "1px solid #2d3436",
		height: 40,
		marginTop: 15,
	},
}))
const Expenseform = () => {
	const history = useHistory()
	const classes = useStyles()
	const [selectedDate, handleDateChange] = useState(new Date())
	const [snackBarOpen, setSnackBarOpen] = useState(false)

	const [invoiceAttachment, setInvoiceAttachment] = useState()
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [amount, setAmount] = useState("")
	const [dollarAmount, setDollarAmount] = useState("")
	const [indianAmount, setIndianAmount] = useState("")
	const [gtsAmount, setGtsAmount] = useState("")
	const [loading, setLoading] = useState(false)
	const [alertData, setAlertData] = useState()
	const handleSnackBarClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setSnackBarOpen(false)
	}

	const postExpense = async (e) => {
		setLoading(true)
		e.preventDefault()

		let url = ""

		if (invoiceAttachment && invoiceAttachment.length > 0 === true) {
			let storageRef = firebase
				.storage()
				.ref(`${invoiceAttachment[0].type}/${invoiceAttachment[0].name}`)
			await storageRef.put(invoiceAttachment[0])
			url = await storageRef.getDownloadURL()
		}

		const formData = {
			name,
			description,
			date: selectedDate,
			dollarAmount,
			amount: indianAmount,
			attachment: url,
			gst: gtsAmount,
		}

		const data = await axios.post(`${process.env.REACT_APP_API_KEY}/admin/add/expenses`, formData)

		if (data.status === 200) {
			setSnackBarOpen(true)
			setAlertData(data?.data?.message)
			history.push("/financial")
			setName("")
			setDescription("")
			setAmount("")
		}

		setLoading(false)
	}

	return (
		<Container className={classes.containter}>
			<Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleSnackBarClose}>
				<Alert onClose={handleSnackBarClose} severity={"success" ? "success" : "warning"}>
					{alertData}
				</Alert>
			</Snackbar>

			<h1>Expenses Manger</h1>

			<form onSubmit={postExpense} className={classes.formContainer}>
				<TextField
					className={classes.formField}
					onChange={(e) => setName(e.target.value)}
					label="Expense name"
					variant="outlined"
				/>
				<TextField
					className={classes.formField}
					onChange={(e) => setDescription(e.target.value)}
					label="Expense Description"
					variant="outlined"
				/>
				<TextField
					className={classes.formField}
					onChange={(e) => setDollarAmount(e.target.value)}
					label="Dollar Amount"
					variant="outlined"
				/>
				<TextField
					className={classes.formField}
					onChange={(e) => setIndianAmount(e.target.value)}
					label="Indian Amount"
					variant="outlined"
				/>
				<TextField
					className={classes.formField}
					onChange={(e) => setGtsAmount(e.target.value)}
					label="GST"
					variant="outlined"
				/>

				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<DatePicker
						className={classes.formField}
						label="Date"
						value={selectedDate}
						onChange={handleDateChange}
						animateYearScrolling
						inputVariant="outlined"
					/>
				</MuiPickersUtilsProvider>

				<FormControl
					variant="outlined"
					style={{
						width: "100%",
					}}
				>
					<div
						style={{
							backgroundColor: "#F5F5F5",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
							marginTop: 20,
						}}
					>
						{
							// eslint-disable-next-line
							invoiceAttachment && invoiceAttachment.length > 0 === true ? (
								<>
									{invoiceAttachment[0].type === "application/pdf" ? (
										<div style={{display: "flex", alignItems: "center"}}>
											<p style={{marginTop: 15}}>{invoiceAttachment[0].name}</p>
											{/* <p
												style={{
													color: "red",
													cursor: "pointer",
													marginTop: 15,
													marginLeft: 10,
												}}
												onClick={() => setInvoiceAttachment()}
											>
												<i className="fas fa-times-circle"></i>
											</p> */}
										</div>
									) : (
										<img
											src={URL.createObjectURL(invoiceAttachment[0])}
											alt=""
											style={{
												height: "100%",
												width: 275,
												objectFit: "cover",
												marginTop: 10,
												height: "250px",
											}}
										/>
									)}
								</>
							) : (
								<>
									<IconButton variant="contained" component="label">
										<Paperclip />
										<input
											onChange={(e) => setInvoiceAttachment(e.target.files)}
											type="file"
											hidden
										/>
									</IconButton>
									<p style={{color: "#C4C4C4", fontWeight: "bold"}}>Choose attachment</p>
								</>
							)
						}
					</div>

					{invoiceAttachment && invoiceAttachment.length > 0 === true ? (
						<p
							style={{
								color: "red",
								marginBottom: 20,
								cursor: "pointer",
								marginTop: 20,
							}}
							onClick={() => setInvoiceAttachment()}
						>
							<i className="fas fa-times-circle"></i> Delete Attachment
						</p>
					) : null}
				</FormControl>

				{loading ? (
					<div
						style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: 20}}
					>
						<CircularProgress />
					</div>
				) : (
					<Button onClick={postExpense} className={classes.btn}>
						Submit
					</Button>
				)}
			</form>
		</Container>
	)
}

export default Expenseform
