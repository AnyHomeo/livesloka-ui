import React, {useState} from "react"
import DateFnsUtils from "@date-io/date-fns" // choose your lib
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"
import {makeStyles} from "@material-ui/core/styles"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import {Button} from "@material-ui/core/"
import axios from "axios"
import moment from "moment"
import {useSnackbar} from "notistack"

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: "80%",
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}))

const HistoricCurrency = () => {
	const {enqueueSnackbar} = useSnackbar()

	const [selectedDate, handleDateChange] = useState(new Date())
	const classes = useStyles()

	const [inrData, setInrData] = useState()
	const [age, setAge] = React.useState("USD")

	const handleChange = (event) => {
		setAge(event.target.value)
	}

	const fetchData = async () => {
		let formattedDate = moment(selectedDate).format("YYYY-MM-DD")
		try {
			const data = await axios.get(
				`https://api.fastforex.io/historical?date=${formattedDate}&from=${age}&api_key=87e7062ef6-8eaf830444-r6xdqd`
			)

			setInrData(data?.data)
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.error, {variant: "error"})
		}
	}
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				marginTop: 20,
				flexDirection: "column",
			}}
		>
			<p style={{fontSize: 19, marginBottom: 10}}>Currency History</p>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DatePicker
					className={classes.formControl}
					inputVariant="outlined"
					label="Select date"
					value={selectedDate}
					onChange={handleDateChange}
					animateYearScrolling
				/>
			</MuiPickersUtilsProvider>

			<FormControl variant="outlined" className={classes.formControl}>
				<InputLabel>Currency</InputLabel>
				<Select value={age} onChange={handleChange} label="Currency">
					<MenuItem value={"INR"}>INR</MenuItem>
					<MenuItem value={"USD"}>USD</MenuItem>
					<MenuItem value={"SGD"}>SGD</MenuItem>
					<MenuItem value={"AED"}>AED</MenuItem>
				</Select>
			</FormControl>
			<Button variant="contained" color="primary" onClick={fetchData}>
				Get INR Value
			</Button>

			<p style={{fontSize: 40, fontWeight: "bold", marginTop: 20}}>
				{inrData && inrData?.results?.INR}
			</p>
		</div>
	)
}

export default HistoricCurrency
