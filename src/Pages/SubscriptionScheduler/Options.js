import React, {useEffect, useState} from "react"
import {getDemoCustomers, getTeacherSlotsForOptions, getData} from "./../../Services/Services"
import {Autocomplete, Alert} from "@material-ui/lab"
import {TextField, Card, Grid, capitalize, Snackbar, Chip, Button} from "@material-ui/core"
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab"
import styles from "./style.module.scss"
import times from "../../Services/times.json"
import {X} from "react-feather"

let days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
let snackbarInitialState = {
	isShown: false,
	message: "",
	type: "error",
}
function Options() {
	const [customers, setCustomers] = useState([])
	const [selectedCustomer, setSelectedCustomer] = useState({})
	const [selectedDays, setSelectedDays] = useState([])
	const [message, setMessage] = useState(snackbarInitialState)
	const [selectedTeacher, setSelectedTeacher] = useState("")
	const [teachers, setTeachers] = useState([])
	const [teacherData, setTeacherData] = useState({})
	const [tempOption, setTempOption] = useState({})
	const [options, setOptions] = useState([])

	useEffect(() => {
		;(async () => {
			try {
				const data = await getDemoCustomers()
				setCustomers(data?.data?.result || [])
				const teachersData = await getData("Teacher")
				setTeachers(
					teachersData?.data?.result.map((item) => ({
						id: item.id,
						name: item.TeacherName,
					})) || []
				)
			} catch (error) {
				console.log(error)
			}
		})()
	}, [])

	useEffect(() => {
		if (selectedTeacher) {
			;(async () => {
				try {
					const data = await getTeacherSlotsForOptions(selectedTeacher.id)
					if (data.data.result.availableSlots) {
						let slots = data.data.result.availableSlots.reduce(
							(slots, slot) => {
								let day = slot.split("-")[0].toLowerCase()
								if (day && days.includes(day.toUpperCase())) {
									slots[day].push(slot)
								}
								return slots
							},
							{
								monday: [],
								tuesday: [],
								wednesday: [],
								thursday: [],
								friday: [],
								saturday: [],
								sunday: [],
							}
						)
						Object.keys(slots).forEach((day) => {
							let timesInSlots = slots[day].map((item) => {
								let splittedSlot = item.split("-")
								return `${splittedSlot[1]}-${splittedSlot[2]}`
							})
							slots[day] = times
								.reduce((slotTimes, slot, index) => {
									if (timesInSlots.includes(slot) && timesInSlots.includes(times[index + 1])) {
										slotTimes.push(slot)
									}
									return slotTimes
								}, [])
								.map((i) => `${day.toUpperCase()}-${i}`)
						})
						setTeacherData({...data.data.result, availableSlots: slots})
					} else {
						setMessage({
							isShown: true,
							message: "No available slots for Teacher",
							type: "warning",
						})
					}
				} catch (error) {
					console.log(error)
					setMessage({
						isShown: true,
						message: "Cannot select Teacher",
						type: "error",
					})
				}
			})()
		}
	}, [selectedTeacher])

	const handleSnackbarClose = () => setMessage(snackbarInitialState)

	return (
		<>
			<Snackbar
				open={message.isShown}
				autoHideDuration={6000}
				anchorOrigin={{vertical: "top", horizontal: "right"}}
				onClose={() => handleSnackbarClose()}
			>
				<Alert onClose={() => handleSnackbarClose()} variant="filled" severity={message.type}>
					{message.message}
				</Alert>
			</Snackbar>
			<div className={styles.maxWidth1200}>
				<h2 className={styles.title}>Create Regular classes Schedule Options to customers</h2>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6} md={8} lg={9}>
						<Card className={styles.card}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={12} md={6}>
									<Autocomplete
										freeSolo
										disableClearable
										options={customers}
										getOptionLabel={(option) => option.firstName || " "}
										onChange={(e, v) => {
											setSelectedCustomer(v)
											let teacher = teachers.filter((teacher) => teacher.id === v.teacherId)[0]
											if (teacher) {
												setSelectedTeacher(teacher)
											} else {
												setMessage({
													isShown: true,
													message: "No Teacher For selected Customer",
													type: "warning",
												})
											}
										}}
										className={styles.autocomplete}
										value={selectedCustomer}
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
								</Grid>
								<Grid item xs={12} sm={12} md={6}>
									<Autocomplete
										freeSolo
										disableClearable
										options={teachers}
										getOptionLabel={(option) => option.name || " "}
										onChange={(e, v) => {
											setSelectedTeacher(v)
										}}
										className={styles.autocomplete}
										key={teachers}
										value={selectedTeacher}
										getOptionSelected={(option, value) => option.id === value.id}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Select Teacher"
												margin="normal"
												variant="outlined"
												InputProps={{...params.InputProps, type: "search"}}
											/>
										)}
									/>
								</Grid>
							</Grid>
							<ToggleButtonGroup
								className={styles.radioGroup}
								value={selectedDays}
								onChange={(e, n) => setSelectedDays(n)}
							>
								{days.map((day) => (
									<ToggleButton key={day} value={day}>
										<p style={{color: "black"}}>{day.slice(0, 3)}</p>
									</ToggleButton>
								))}
							</ToggleButtonGroup>
							<Grid container spacing={3}>
								{days.map((day) => {
									let lowerCasedDay = day.toLowerCase()
									return selectedDays.includes(day) ? (
										<Grid item key={day} xs={12} sm={6} md={4}>
											<div className={styles.dayCard}>
												<div className={styles.dayTitle}>{capitalize(lowerCasedDay)}</div>
												{teacherData?.availableSlots
													? teacherData?.availableSlots[lowerCasedDay].map((slot) => (
															<Chip
																key={slot}
																className={styles.chip}
																label={slot.split("-")[1]}
																variant={
																	tempOption[lowerCasedDay] === slot ? "default" : "outlined"
																}
																size="small"
																color="primary"
																onClick={() =>
																	setTempOption((prev) => ({
																		...prev,
																		[lowerCasedDay]:
																			prev[lowerCasedDay] === slot ? undefined : slot,
																	}))
																}
															/>
													  ))
													: ""}
											</div>
										</Grid>
									) : (
										""
									)
								})}
							</Grid>
							<Button
								className={styles.addButton}
								disabled={!Object.keys(tempOption).some((i) => !!tempOption[i])}
								variant="contained"
								color="primary"
								onClick={() => {
									setOptions((prev) => [...prev, tempOption])
									setTempOption({})
								}}
							>
								Add Option
							</Button>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={3}>
						<Card className={styles.selectedOptions}>
							<h5 className={styles.selectedSlotsTitle}>Selected Options</h5>
							{options.map((option, i) => (
								<div className={styles.selectedOptionsSingleCard}>
									<div className={styles.xWrapper}>
										<X
											style={{textAlign: "right"}}
											onClick={() => {
												setOptions((prev) => {
													let prevData = [...prev]
													prevData.splice(i, 1)
													return prevData
												})
											}}
										/>
									</div>
									{Object.keys(option).map((day) => (
										<div>
											<b>{capitalize(day)}: </b> {option[day].split("-")[1]}
										</div>
									))}
								</div>
							))}
						</Card>
					</Grid>
				</Grid>
			</div>
		</>
	)
}

export default Options
