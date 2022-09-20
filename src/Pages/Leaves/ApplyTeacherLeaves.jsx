import React, {useCallback, useEffect, useState} from "react"
import {applyTeacherLeave, getData, getSchedulesOfTeacher} from "../../Services/Services"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers"
import TextField from "@material-ui/core/TextField"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import Autocomplete from "@material-ui/lab/Autocomplete"
import useWindowDimensions from "../../Components/useWindowDimensions"
import {Button} from "@material-ui/core"
import {useSnackbar} from "notistack"

const defaultLeaveData = {
	date: new Date(),
	entireDay: false,
	reason: "",
}

const ApplyTeacherLeaves = ({
	isAddLeaveDialogOpen,
	setIsAddLeaveDialogOpen,
	setRefresh,
	teacherId,
	scheduleId,
}) => {
	const [teachers, setTeachers] = useState([])
	const {width} = useWindowDimensions()
	const [teacher, setTeacher] = useState({})
	const [schedule, setSchedule] = useState({})
	const {enqueueSnackbar} = useSnackbar()

	const [schedulesOfTeacher, setSchedulesOfTeacher] = useState([])
	const [leaveData, setLeaveData] = useState(defaultLeaveData)

	const getTeachers = useCallback(() => {
		getData("Teacher").then((teachersResponse) => {
			setTeachers(teachersResponse.data.result)
		})
	}, [])

	const getAllSchedulesOfTeacher = useCallback((teacherId) => {
		getSchedulesOfTeacher(teacherId).then((teachersResponse) => {
			if (teachersResponse.data.result.schedules) {
				setSchedulesOfTeacher(teachersResponse.data.result.schedules)
			}
		})
	}, [])

	useEffect(() => {
		getTeachers()
	}, [getTeachers])

	useEffect(() => {
		if (teacher.id) {
			getAllSchedulesOfTeacher(teacher.id)
		}
	}, [teacher, getAllSchedulesOfTeacher])

	useEffect(() => {
		if (teacherId && teachers.length) {
			let teacherIndex = teachers.findIndex((teacher) => teacher.id === teacherId)
			if (teacherIndex !== -1) {
				setTeacher(teachers[teacherIndex])
			}
		}
	}, [teacherId, teachers])

	useEffect(() => {
		if (scheduleId && schedulesOfTeacher.length) {
			let scheduleIndex = schedulesOfTeacher.findIndex((schedule) => schedule._id === scheduleId)
			if (scheduleIndex !== -1) {
				setSchedule(schedulesOfTeacher[scheduleIndex])
			}
		}
	}, [scheduleId, schedulesOfTeacher])

	const applyALeave = () => {
		let {entireDay, date, reason} = leaveData
		if (!reason) {
			return enqueueSnackbar("Reason is required", {
				variant: "error",
			})
		}
		applyTeacherLeave({
			scheduleId: entireDay ? "" : schedule._id,
			teacherId: teacher.id,
			date,
			entireDay,
			reason,
		})
			.then((data) => {
				enqueueSnackbar(data.data.message, {
					variant: "success",
				})
				setIsAddLeaveDialogOpen(false)
				setLeaveData(defaultLeaveData)
				setRefresh((prev) => !prev)
			})
			.catch((err) => {
				let message =
					err.response && err.response.data && err.response.data.error
						? err.response.data.error
						: "Something went wrong!"
				enqueueSnackbar(message, {
					variant: "error",
				})

				setLeaveData(defaultLeaveData)
			})
	}

	return (
		<Dialog
			open={isAddLeaveDialogOpen}
			onClose={() =>
				setLeaveData((prev) => ({
					scheduleId: "",
					teacherId: "",
					date: new Date(),
					entireDay: false,
					isHidden: true,
					editingMode: false,
				}))
			}
			fullScreen={width < 400}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">Apply Leave for a Teacher</DialogTitle>
			<DialogContent>
				<Autocomplete
					id="auto-com-1"
					options={teachers}
					fullWidth
					value={teacher}
					getOptionLabel={(option) => option.TeacherName}
					style={{
						margin: "10px 0",
						minWidth: 310,
					}}
					renderInput={(params) => <TextField {...params} label="Teacher" variant="outlined" />}
					onChange={(e, value) => {
						setTeacher(value)
					}}
				/>
				<Autocomplete
					id="combo-box-demo-2"
					options={schedulesOfTeacher}
					fullWidth
					style={{
						margin: "10px 0",
						minWidth: 310,
					}}
					value={schedule}
					getOptionLabel={(option) => option.className}
					renderInput={(params) => <TextField {...params} label="Class" variant="outlined" />}
					onChange={(e, value) => {
						setSchedule(value)
					}}
				/>
				<div>
					<div style={{color: "red", fontSize: 10, paddingBottom: 10}}>
						* This message will be displayed directly to customer
					</div>
					<TextField
						id="reason"
						label="Reason for leave"
						multiline
						rows={3}
						variant="outlined"
						fullWidth
						value={leaveData.reason}
						onChange={(e) => setLeaveData((prev) => ({...prev, reason: e.target.value}))}
					/>
				</div>
				<FormControlLabel
					control={
						<Checkbox
							checked={leaveData.entireDay}
							onChange={() => setLeaveData((prev) => ({...prev, entireDay: !prev.entireDay}))}
							name="checkedA"
						/>
					}
					label="Apply Leave for Entire Day"
				/>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<DatePicker
						margin="normal"
						fullWidth
						disablePast
						id="date-picker-dialog"
						label="Select Leave Date"
						inputVariant="outlined"
						variant="static"
						// shouldDisableDate={(date) => !(new Date(date).getDay() === value)}
						value={leaveData.date}
						onChange={(date) => {
							setLeaveData((prev) => ({...prev, date: new Date(date)}))
						}}
					/>
				</MuiPickersUtilsProvider>
			</DialogContent>
			<DialogActions>
				<Button
					variant={"contained"}
					color="secondary"
					onClick={() => {
						setLeaveData((prev) => ({
							date: new Date(),
							entireDay: false,
						}))
						setIsAddLeaveDialogOpen(false)
					}}
				>
					cancel
				</Button>
				<Button variant={"contained"} color={"primary"} onClick={applyALeave}>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ApplyTeacherLeaves
