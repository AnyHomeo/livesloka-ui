import {
	Chip,
	Container,
	makeStyles,
	TextField,
	Button,
	CircularProgress,
	Snackbar,
	Grid,
} from "@material-ui/core"
import MuiAlert from "@material-ui/lab/Alert"
import Autocomplete from "@material-ui/lab/Autocomplete"
import React, {useState, useEffect} from "react"
import PropTypes from "prop-types"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Box from "@material-ui/core/Box"
import Axios from "axios"
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab"
import Lottie from "react-lottie"
import loadingAnimation from "../../Images/loading.json"

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: loadingAnimation,
	rendererSettings: {
		preserveAspectRatio: "xMidYMid slice",
	},
}

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
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
			{value === index && (
				<Box p={3}>
					<div>{children}</div>
				</Box>
			)}
		</div>
	)
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
}

function a11yProps(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`,
	}
}

const useStyles = makeStyles(() => ({
	container: {
		display: "flex",
	},
	formcontainer: {
		width: 300,
	},
	root: {
		marginTop: 20,
		marginLeft: -30,
	},
}))
const SubscriptionScheduler = () => {
	const [value, setValue] = React.useState(0)

	let days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

	const [demoCustomers, setDemoCustomers] = useState()
	const [teachertimeslots, setTeachertimeslots] = useState()
	const [selectedSlots, setSelectedSlots] = useState([])
	const [radioday, setRadioday] = useState(() => ["MONDAY"])
	const [customerId, setCustomerId] = useState()
	const [btnloading, setBtnloading] = useState(false)
	const [open, setOpen] = useState(false)
	const [success, setSuccess] = useState(false)
	const [response, setResponse] = useState("")
	const [loading, setLoading] = useState(false)
	const [formats, setFormats] = React.useState(() => ["MONDAY"])

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleFormat = (event, newFormats) => {
		setRadioday(newFormats)
	}

	useEffect(() => {
		getDemoCustomers()
	}, [])
	const getDemoCustomers = async () => {
		setLoading(true)
		try {
			const data = await Axios.get(
				`${process.env.REACT_APP_API_KEY}/options/demo/students?select=firstName,email,subjectId,teacherId`
			)
			setDemoCustomers(data?.data?.result)
		} catch (error) {}
		setLoading(false)
	}

	const handleDemoCustomer = (event, values) => {
		setCustomerId(values?._id)
		getTeachertimeslots(values?.teacherId)
	}

	const getTeachertimeslots = async (id) => {
		setLoading(true)

		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/options/teacher/slots/${id}`)
			setTeachertimeslots(data?.data?.result)
			let stateData = []

			data &&
				data.data &&
				data.data.result.map((item) => {
					let obj = {
						teacher: item._id,
						slots: [],
					}

					stateData.push(obj)
				})
			setSelectedSlots(stateData)
		} catch (error) {}
		setLoading(false)
	}

	const handleDayChange = (event, value) => {
		setRadioday(value)
	}

	const removeOrAddSlot = (slots, slot) => {
		if (slots.includes(slot)) {
			let index = slots.indexOf(slot)
			slots.splice(index, 1)
			return slots
		} else {
			return [...slots, slot]
		}
	}

	const handleSlotSelect = (slot, teacherUnderscoreId) => {
		setSelectedSlots((prev) => {
			let prevData = [...prev]
			return prevData.map((teacherWithSlotsObject) => {
				if (teacherWithSlotsObject.teacher === teacherUnderscoreId) {
					return {
						...teacherWithSlotsObject,
						slots: removeOrAddSlot(teacherWithSlotsObject.slots, slot),
					}
				}
				return teacherWithSlotsObject
			})
		})
	}

	const classes = useStyles()

	const handleSlotColor = (slot, id) => {
		let flag
		selectedSlots.forEach((item) => {
			if (item.teacher === id) {
				flag = item.slots.includes(slot)
			}
		})
		return flag
	}

	const onSubmit = async () => {
		setBtnloading(true)
		let finalSlots = []

		selectedSlots &&
			selectedSlots.map((item) => {
				if (item.slots.length !== 0) {
					finalSlots.push(item)
				}
			})
		const formData = {
			customer: customerId,
			slots: finalSlots,
		}

		try {
			const data = await Axios.post(`${process.env.REACT_APP_API_KEY}/options`, formData)

			if (data.status === 200) {
				// setTeachertimeslots()
				setOpen(true)
				setResponse("Inserted Successfully")
				setSuccess(true)
			}
		} catch (error) {
			console.log(error)
		}
		setBtnloading(false)
	}
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setOpen(false)
	}

	// if (loading) {
	// 	return <Lottie options={defaultOptions} height={400} width={400} />
	// }

	return (
		<Container className={classes.container}>
			<Snackbar open={open} autoHideDuration={6000} onClose={() => handleClose()}>
				<Alert onClose={() => handleClose()} severity={success ? "success" : "warning"}>
					{response}
				</Alert>
			</Snackbar>
			<div style={{width: "80%"}}>
				<div className={classes.formcontainer}>
					{demoCustomers && (
						<Autocomplete
							freeSolo
							disableClearable
							options={demoCustomers}
							getOptionLabel={(option) => option.firstName}
							onChange={handleDemoCustomer}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Select Customer"
									margin="normal"
									variant="outlined"
									InputProps={{...params.InputProps, type: "search"}}
								/>
							)}
						/>
					)}
				</div>

				<div className={classes.root}>
					{/* <Tabs
						value={value}
						onChange={handleChange}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="auto"
						aria-label="scrollable auto tabs example"
					>
						{teachertimeslots &&
							teachertimeslots.map((item, i) => (
								<Tab
									key={item._id}
									label={`${item.TeacherName.split(" ")[0]} ${item.TeacherName.split(" ")[1]}`}
									{...a11yProps(i)}
								/>
							))}
					</Tabs> */}

					{teachertimeslots && (
						<>
							<ToggleButtonGroup value={radioday} onChange={handleFormat}>
								{days.map((day) => (
									<ToggleButton key={day} value={day}>
										<p style={{color: "black"}}>{day.slice(0, 3)}</p>
									</ToggleButton>
								))}
							</ToggleButtonGroup>

							<div>
								<p style={{marginLeft: 10, marginBottom: 20, marginTop: 20}}>Available Slots</p>

								<Grid container>
									{radioday.map((day) => (
										<Grid
											lg={4}
											sm={6}
											xs={12}
											item
											style={{display: "flex", flexDirection: "column"}}
										>
											{day}

											{teachertimeslots.availableSlots.map((slot) => (
												<>
													{slot.startsWith(day) ? (
														<Chip
															size="small"
															// onClick={() => handleSlotSelect(slot, item._id)}
															// label={slot}
															label={`${slot.split(" ")[0].split("-")[1]} ${slot.split(" ")[2]}`}
															variant="outlined"
															style={{
																margin: 5,
																width: 100,
															}}

															// style={{
															// 	margin: 5,
															// 	backgroundColor: handleSlotColor(slot, item._id)
															// 		? "#bdc3c7"
															// 		: "#f5f6fa",
															// 	width: 80,
															// }}
														/>
													) : (
														""
													)}
												</>
											))}
										</Grid>
									))}
								</Grid>
							</div>
						</>
					)}
				</div>
				{teachertimeslots && (
					<Button
						style={{height: 40, width: 150}}
						onClick={onSubmit}
						variant="contained"
						disabled={btnloading}
					>
						{btnloading ? <CircularProgress style={{height: 25, width: 25}} /> : "Submit"}
					</Button>
				)}
			</div>

			<div style={{width: "50%"}}>
				<div>
					<div style={{display: "flex", flexDirection: "row"}}>
						{selectedSlots.map((sel) => (
							<>
								{teachertimeslots &&
									teachertimeslots.map((item, i) => {
										if (sel.teacher === item._id) {
											return (
												<div
													style={{display: "flex", flexDirection: "column", alignItems: "center"}}
												>
													<p style={{margin: 20}}>{`${item.TeacherName.split(" ")[0]} ${
														item.TeacherName.split(" ")[1]
													}`}</p>
													<div style={{display: "flex", flexDirection: "column"}}>
														{sel.slots.map((slot) => (
															<Chip
																size="small"
																label={`${slot.split(" ")[0].split("-")[1]} ${slot.split(" ")[2]}`}
																variant="outlined"
																style={{
																	margin: 5,
																	width: 80,
																}}
															/>
														))}
													</div>
												</div>
											)
										}
									})}
							</>
						))}
					</div>
				</div>
			</div>
		</Container>
	)
}

export default SubscriptionScheduler
