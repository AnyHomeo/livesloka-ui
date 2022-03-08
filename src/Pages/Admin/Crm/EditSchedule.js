import React, {useState, useEffect} from "react"
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
	Switch,
} from "@material-ui/core/"
import SaveIcon from "@material-ui/icons/Save"
import {makeStyles} from "@material-ui/core/styles"
import Autocomplete from "@material-ui/lab/Autocomplete"
import Axios from "axios"
import AvailableTimeSlotChip from "../../../Components/AvailableTimeSlotChip"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import {MuiPickersUtilsProvider, KeyboardDatePicker} from "@material-ui/pickers"
import {useParams, useLocation, useHistory} from "react-router-dom"
import useDocumentTitle from "../../../Components/useDocumentTitle"
import {useCallback} from "react"
import {useSnackbar} from "notistack"
import {showError} from "../../../Services/utils"

function useQuery() {
	return new URLSearchParams(useLocation().search)
}

let days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

const useStyles = makeStyles(() => ({
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

const EditSchedule = () => {
	useDocumentTitle("Edit Schedule")
	const {enqueueSnackbar} = useSnackbar()
	const classes = useStyles()
	let query = useQuery()

	const [selectedDate, setSelectedDate] = useState(new Date())
	const [students, setStudents] = useState([])
	const [teacher, setTeacher] = useState("")
	const [demo, setDemo] = useState(false)
	const [radioday, setRadioday] = useState("MONDAY")
	const [teachers, setTeacherName] = useState([])
	const [studentOptions, setStudentOptions] = useState([])
	const [availableTimeSlots, setAvailableTimeSlots] = useState([])
	const [timeSlotState, setTimeSlotState] = useState([])
	const [loading, setLoading] = useState(false)
	const [prevTeacher, setPrevTeacher] = useState("")
	const [prevSlots, setPrevSlots] = useState([])
	const [subjects, setSubjects] = useState("")
	const [subjectNameId, setSubjectNameId] = useState("")
	const [ClassName, setClassName] = useState("")
	const [isMeetingLinkChangeNeeded, setIsMeetingLinkChangeNeeded] = useState(false)
	const [oneToOne, setOneToOne] = useState(true)

	const {id} = useParams()
	const history = useHistory()

	const handleDateChange = (date) => {
		setSelectedDate(date)
	}
	const handleDayChange = (event) => {
		setRadioday(event.target.value)
	}

	const getTimeSlots = useCallback(
		async (teacher, prevTeacher) => {
			const timeSlotsData = await Axios.get(
				`${process.env.REACT_APP_API_KEY}/teacher/available/${teacher}?day=MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY`
			)
			if (teacher === prevTeacher) {
				setAvailableTimeSlots(timeSlotsData.data.result.concat(prevSlots))
				setTimeSlotState(prevSlots)
			} else {
				setAvailableTimeSlots(timeSlotsData.data.result)
			}
		},
		[prevSlots]
	)

	const getScheduleData = useCallback(async () => {
		try {
			const schedule = await Axios.get(`${process.env.REACT_APP_API_KEY}/schedule/${id}`)
			const {
				teacher,
				className,
				demo,
				OneToOne,
				subject,
				startDate,
				students,
				slots: {monday, tuesday, wednesday, thursday, friday, saturday, sunday},
			} = schedule.data.result

			setTeacher(teacher)
			setClassName(className)
			setPrevTeacher(teacher)
			setDemo(demo)
			setOneToOne(OneToOne)
			setSubjectNameId(subject || "")
			setSelectedDate(startDate)
			setStudents(students)
			let slots = [
				...monday,
				...tuesday,
				...wednesday,
				...thursday,
				...friday,
				...saturday,
				...sunday,
			]
			setTimeSlotState(slots)
			setPrevSlots(slots)
		} catch (error) {
			console.log(error)
		}
	}, [id])

	const getSubjects = useCallback(async () => {
		const subjectsResponse = await Axios.get(`${process.env.REACT_APP_API_KEY}/admin/get/Subject`)
		setSubjects(subjectsResponse.data.result)
	}, [])

	// Service calls
	useEffect(() => {
		getTeachers()
		getStudents()
		getSubjects()
		getScheduleData()
	}, [getScheduleData, getSubjects])

	useEffect(() => {
		if (teacher && prevTeacher) {
			getTimeSlots(teacher, prevTeacher)
			setTimeSlotState([])
		}
	}, [teacher, prevTeacher, prevSlots, getTimeSlots])

	const getTeachers = async () => {
		const teacherNames = await Axios.get(
			`${process.env.REACT_APP_API_KEY}/teacher?params=id,TeacherName`
		)
		setTeacherName(teacherNames.data.result)
	}

	const getStudents = async () => {
		const studentNames = await Axios.get(
			`${process.env.REACT_APP_API_KEY}/customers/all?params=firstName,lastName`
		)
		setStudentOptions(studentNames.data.result)
	}

	const submitForm = async (e) => {
		e.preventDefault()
		if (!!timeSlotState.length) {
			setLoading(true)
			let formData = {
				slots: {},
			}
			days.forEach((day) => {
				formData["slots"][day.toLowerCase()] = timeSlotState
					.filter((slot) => slot.startsWith(day))
					.map((slot) => slot.split("!@#$%^&*($%^")[0])
			})
			if (!teacher) {
				return enqueueSnackbar("Please select a teacher", {
					variant: "error",
				})
			}

			formData = {
				...formData,
				className: ClassName,
				teacher: teacher,
				students: students.map((student) => student._id),
				demo: demo,
				OneToOne: oneToOne,
				oneToMany: !oneToOne,
				subject: subjectNameId,
				startDate: selectedDate,
				isMeetingLinkChangeNeeded,
			}
			try {
				const res = await Axios.post(
					`${process.env.REACT_APP_API_KEY}/schedule/edit/${id}`,
					formData
				)
				enqueueSnackbar(res.data?.message || "Schedule edit successful!", {
					variant: "success",
				})
				setDemo(false)
				setStudents([])
				setSubjectNameId("")
				setLoading(false)
				setRadioday("")
				setClassName("")
				setTimeSlotState([])
				setOneToOne("")
				setTimeout(() => {
					history.push(query.get("goto") ? query.get("goto") : "/scheduler")
				}, 2000)
			} catch (error) {
				console.error(error.response)
				showError(error, enqueueSnackbar)
				setLoading(false)
			}
		} else {
			showError("Please Select TimeSlots", enqueueSnackbar)
			setLoading(false)
		}
	}

	return (
		<>
			<form onSubmit={submitForm}>
				<h1 className="heading" style={{fontSize: "20px", marginTop: "20px", textAlign: "center"}}>
					Edit the Schedule
				</h1>
				<Grid container style={{width: "100%"}}>
					<Grid item xs={false} md={4} />
					<Grid item xs={12} style={{padding: "20px 50px"}} md={4}>
						<FormControl
							style={{
								width: "100%",
							}}
							variant="outlined"
							className={classes.formControl}
						>
							<InputLabel id="Select-subject-label">Select Teacher</InputLabel>
							<Select
								fullWidth
								labelId="Select-subject-label"
								id="select-subject"
								value={teacher}
								onChange={(e) => setTeacher(e.target.value)}
								label="Select Subject"
							>
								{teachers &&
									teachers.map((teacher) => (
										<MenuItem value={teacher.id}>{teacher.TeacherName}</MenuItem>
									))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4} />
					<Grid item xs={12} md={4} />
					<Grid item xs={12} md={4} style={{display: "flex", justifyContent: "center"}}>
						<div
							style={{
								width: "100%",
								margin: "0 20px",
							}}
						>
							<Autocomplete
								filterSelectedOptions
								options={studentOptions}
								getOptionSelected={(option, value) => option._id === value._id}
								getOptionLabel={(option) =>
									`${option.firstName ? option.firstName : ""} ${
										option.lastName ? option.lastName : ""
									}`
								}
								multiple
								onChange={(e, v) => setStudents(v)}
								value={students}
								renderInput={(params) => (
									<TextField
										{...params}
										style={{width: "100%"}}
										label="Students"
										variant="outlined"
										margin="normal"
									/>
								)}
							/>
						</div>
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
						<FormControl component="fieldset" style={{marginTop: "50px"}}>
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
								state={timeSlotState}
								setState={setTimeSlotState}
								timeSlots
								valueFinder={(item) => item}
								labelFinder={(item) => item}
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
								onChange={(e) => setSubjectNameId(e.target.value)}
								label="Select Subject"
							>
								{subjects &&
									subjects.map((subject) => (
										<MenuItem value={subject._id}>{subject.subjectName}</MenuItem>
									))}
							</Select>
						</FormControl>
						<TextField
							fullWidth
							id="outlined-basic"
							label="ClassName"
							variant="outlined"
							value={ClassName}
							required
							onChange={(e) => setClassName(e.target.value)}
							style={{
								maxWidth: "400px",
								minWidth: "300px",
								marginTop: "10px",
							}}
						/>
						<FormControl component="fieldset">
							<RadioGroup
								row
								aria-label="position"
								onChange={() => setOneToOne((prev) => !prev)}
								name="position"
								value={oneToOne}
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
						</FormControl>
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
					<FormControlLabel
						control={
							<Switch
								checked={isMeetingLinkChangeNeeded}
								onChange={() => setIsMeetingLinkChangeNeeded((prev) => !prev)}
								name="checkedA"
							/>
						}
						label="Create new Meeting Link"
					/>

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
								Save Changes
							</Button>
						)}
					</div>
				</div>
			</form>
		</>
	)
}

export default EditSchedule
