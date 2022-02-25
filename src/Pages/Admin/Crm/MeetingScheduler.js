import React, {useState, useEffect, useCallback} from "react"
import {
	Button,
	TextField,
	FormControlLabel,
	Checkbox,
	Grid,
	FormControl,
	Radio,
	RadioGroup,
	FormLabel,
	CircularProgress,
	Select,
	InputLabel,
	MenuItem,
	Container,
} from "@material-ui/core/"
import SaveIcon from "@material-ui/icons/Save"
import {makeStyles} from "@material-ui/core/styles"
import Autocomplete from "@material-ui/lab/Autocomplete"
import moment from "moment"
import Axios from "axios"
import AvailableTimeSlotChip from "../../../Components/AvailableTimeSlotChip"
import {useSnackbar} from "notistack"

import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import {MuiPickersUtilsProvider, KeyboardDatePicker} from "@material-ui/pickers"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import useDocumentTitle from "../../../Components/useDocumentTitle"
import {createSchedule} from "../../../Services/Services"
import {useParams} from "react-router-dom"
import {showError} from "../../../Services/utils"

let days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

const useStyles = makeStyles((theme) => ({
	saveButton: {
		marginTop: "1.5rem",
		marginBottom: "2rem",
	},
	Startdate: {
		marginRight: "10px",
	},
	Starttime: {
		marginRight: "10px",
	},
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
}))

const MeetingScheduler = () => {
	useDocumentTitle("Meeting Scheduler")
	const classes = useStyles()
	const {enqueueSnackbar} = useSnackbar()
	const params = useParams()

	const [selectedDate, setSelectedDate] = React.useState(new Date())

	const handleDateChange = (date) => {
		setSelectedDate(date)
	}

	const [personName, setPersonName] = useState([])
	const [demo, setDemo] = useState(false)
	const [radioday, setRadioday] = useState("MONDAY")
	const [teachers, setTeachers] = useState([])
	const [studentName, setStudentName] = useState([])
	const [availableTimeSlots, setAvailableTimeSlots] = useState([])
	const [timeSlotState, setTimeSlotState] = useState([])
	const [selectedTeacher, setSelectedTeacher] = useState({
		id: "",
		TeacherName: "",
	})
	const [studentNamesFullObject, setStudentNamesFullObject] = useState([])
	const [loading, setLoading] = useState(false)
	const [subjectNames, setSubjectNames] = useState("")
	const [subjectNameId, setSubjectNameId] = useState("")
	const [className, setClassName] = useState("")
	const [oneToOne, setOneToOne] = useState(true)

	const handleDayChange = (event) => {
		setRadioday(event.target.value)
	}

	const getTimeSlots = useCallback(async (teacher, makeSlotsEmpty) => {
		if (teacher) {
			const timeSlotsData = await Axios.get(
				`${process.env.REACT_APP_API_KEY}/teacher/available/${teacher}?day=MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY`
			)
			setAvailableTimeSlots(timeSlotsData.data.result)
			if (makeSlotsEmpty) {
				setTimeSlotState([])
			}
		}
	}, [])

	useEffect(() => {
		if (params.slot) {
			setTimeSlotState(params.slot.split(","))
		}
	}, [params.slot])

	useEffect(() => {
		if (params.teacher && teachers.length) {
			getTimeSlots(params.teacher, false)
			setSelectedTeacher(teachers[teachers.findIndex((teacher) => teacher.id === params.teacher)])
		}
	}, [params.teacher, getTimeSlots, teachers])

	const setInitialState = useCallback(() => {
		setDemo(false)
		setOneToOne("")
		setPersonName("")
		setPersonName("")
		setSubjectNameId("")
		setLoading(false)
		setSelectedTeacher({})
		setStudentNamesFullObject([])
		setRadioday("")
		setClassName("")
		setTimeSlotState([])
		setAvailableTimeSlots([])
	}, [])

	// Service calls
	useEffect(() => {
		getTeachers()
		getStudents()
		getSubjectNames()
	}, [])

	// Get teachers
	const getTeachers = async () => {
		const teacherNames = await Axios.get(
			`${process.env.REACT_APP_API_KEY}/teacher?params=id,TeacherName`
		)
		setTeachers(teacherNames.data.result)
	}

	// Get Students
	const getStudents = async () => {
		const studentNames = await Axios.get(
			`${process.env.REACT_APP_API_KEY}/customers/all?params=firstName,lastName,subjectId,age`
		)

		setStudentName(studentNames.data.result)
	}

	const getSubjectNames = async () => {
		const subjectName = await Axios.get(`${process.env.REACT_APP_API_KEY}/admin/get/Subject`)
		setSubjectNames(subjectName.data.result)
	}

	const submitForm = async (e) => {
		setLoading(true)
		e.preventDefault()
		let formData = {}
		if (!selectedTeacher)
			return enqueueSnackbar("Please Select a teacher", {
				variant: "error",
			})

		days.forEach((day) => {
			formData[day.toLowerCase()] = timeSlotState
				.filter((slot) => slot.startsWith(day))
				.map((slot) => slot.split("!@#$%^&*($%^")[0])
		})

		try {
			formData = {
				...formData,
				teacher: selectedTeacher.id,
				students: personName,
				demo: demo,
				OneToOne: oneToOne,
				OneToMany: !oneToOne,
				subject: subjectNameId,
				startDate: moment(selectedDate).format(),
				className,
			}

			try {
				let createScheduleResponse = await createSchedule(formData)
				setInitialState()
				return enqueueSnackbar(createScheduleResponse.data.message, {
					variant: "success",
				})
			} catch (error) {
				showError(error, enqueueSnackbar)
			}
		} catch (error) {
			return showError(error, enqueueSnackbar)
		}
	}

	const classNameGenerator = useCallback(() => {
		let selectedSubject = subjectNames
			? subjectNames[subjectNames.findIndex((sub) => sub._id === subjectNameId)]
			: ""

		let names = studentNamesFullObject
			? studentNamesFullObject.map((item, i) => {
					if (item.age) {
						return `${item.firstName} ${item.age}Y (${item.lastName})${
							studentNamesFullObject.length - 1 === i ? "" : ","
						} `
					} else {
						return `${item.firstName} (${item.lastName})${
							studentNamesFullObject.length - 1 === i ? "" : ","
						} `
					}
			  })
			: []

		let nameString = names.join(" ")

		let name =
			`${nameString} ${selectedSubject?.[0]?.subjectName}- ${selectedTeacher.TeacherName}`.replace(
				undefined,
				""
			)

		setClassName(name)
	}, [studentNamesFullObject, subjectNameId, subjectNames, selectedTeacher.TeacherName])

	useEffect(() => {
		classNameGenerator()
	}, [classNameGenerator])

	return (
		<>
			<Container>
				<form onSubmit={submitForm}>
					<h1
						className="heading"
						style={{fontSize: "20px", marginTop: "20px", textAlign: "center"}}
					>
						Schedule A Meeting
					</h1>
					<Grid container style={{width: "100%"}}>
						<Grid item xs={false} md={4} />
						<Grid item xs={12} md={4}>
							{teachers.length ? (
								<Autocomplete
									style={{width: "100%", margin: "0 auto"}}
									options={teachers}
									value={selectedTeacher}
									getOptionLabel={(option) => option.TeacherName}
									onChange={(event, value) => {
										if (value) {
											setSelectedTeacher(value)
											getTimeSlots(value.id, true)
										}
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Teachers"
											variant="outlined"
											margin="normal"
											required
										/>
									)}
								/>
							) : (
								""
							)}{" "}
						</Grid>
						<Grid item xs={12} md={4} />
						<Grid item xs={12} md={4} />
						<Grid item xs={12} md={4} style={{display: "flex", justifyContent: "center"}}>
							{studentName.length && studentName[0].firstName ? (
								<Autocomplete
									multiple
									style={{width: "100%", margin: "0 auto"}}
									options={studentName}
									value={studentNamesFullObject}
									getOptionLabel={(name) =>
										`${name.firstName} ${name.lastName ? name.lastName : ""}${
											name.subject ? `(${name.subject.subjectName})` : ""
										}`
									}
									onChange={(event, value) => {
										let tempData = []
										setStudentNamesFullObject(value)
										value &&
											value.forEach((val) => {
												tempData.push(val._id)
												setPersonName(tempData)
											})
									}}
									renderInput={(params) => (
										<TextField {...params} label="Students" variant="outlined" margin="normal" />
									)}
								/>
							) : (
								""
							)}
						</Grid>

						<Grid item xs={12} md={4} />
					</Grid>
					<div
						style={{
							alignItems: "center",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<div className="date-checkbox">
							<FormControl component="fieldset" style={{marginTop: "10px", marginLeft: 10}}>
								<FormLabel component="legend" style={{textAlign: "center"}}>
									Dates
								</FormLabel>
								<RadioGroup
									color="primary"
									aria-label="Dates"
									name="gender1"
									value={radioday}
									onChange={handleDayChange}
									style={{display: "flex", flexDirection: "row"}}
								>
									{days.map((day) => (
										<FormControlLabel
											value={day}
											control={<Radio color="primary" />}
											label={day.slice(0, 3)}
										/>
									))}
								</RadioGroup>
							</FormControl>
						</div>

						<div
							style={{
								display: "flex",
								justifyContent: "center",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							{
								<AvailableTimeSlotChip
									data={availableTimeSlots.filter((slot) => slot.startsWith(radioday)) || []}
									valueFinder={(item) => item}
									labelFinder={(item) => item}
									state={timeSlotState}
									setState={setTimeSlotState}
								/>
							}
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									fullWidth
									disableToolbar
									variant="inline"
									format="dd-MM-yyyy"
									margin="normal"
									label="Start Date"
									value={selectedDate}
									onChange={handleDateChange}
								/>
							</MuiPickersUtilsProvider>
							<FormControl
								style={{
									maxWidth: "400px",
									minWidth: "300px",
									marginTop: "10px",
								}}
								variant="outlined"
								className={classes.formControl}
							>
								<InputLabel id="Select-subject-label">Select Subject</InputLabel>
								<Select
									fullWidth
									labelId="Select-subject-label"
									id="select-subject"
									value={subjectNameId}
									onChange={(e) => {
										setSubjectNameId(e.target.value)
									}}
									label="Select Subject"
								>
									{subjectNames &&
										subjectNames.map((subject) => (
											<MenuItem value={subject._id}>{subject.subjectName}</MenuItem>
										))}
								</Select>
							</FormControl>
							<FormControl
								style={{
									maxWidth: "400px",
									minWidth: "300px",
									marginTop: "10px",
								}}
								variant="outlined"
							>
								<TextField
									fullWidth
									id="outlined-basic"
									label="Class Name "
									variant="outlined"
									value={className}
									onChange={(e) => setClassName(e.target.value)}
									style={{
										maxWidth: "400px",
										minWidth: "300px",
										marginTop: "10px",
									}}
								/>
							</FormControl>

							<RadioGroup
								row
								aria-label="position"
								onChange={() => setOneToOne((prev) => !prev)}
								name="position"
								value={!oneToOne}
							>
								<FormControlLabel
									value={true}
									control={<Radio color="primary" />}
									label="One to One"
								/>
								<FormControlLabel
									value={false}
									control={<Radio color="primary" />}
									label="One to Many"
								/>
							</RadioGroup>
							<FormControlLabel
								style={{marginTop: "20px"}}
								control={
									<Checkbox
										checked={demo}
										onChange={(event) => setDemo(event.target.checked)}
										name="Demo"
										color="primary"
									/>
								}
								label="DEMO"
							/>
						</div>
						<div className={classes.saveButton}>
							{loading ? (
								<CircularProgress />
							) : (
								<Button
									variant="contained"
									color="primary"
									size="large"
									type="submit"
									className={classes.button}
									startIcon={<SaveIcon />}
								>
									Save
								</Button>
							)}
						</div>
					</div>
				</form>
			</Container>
		</>
	)
}

export default MeetingScheduler
