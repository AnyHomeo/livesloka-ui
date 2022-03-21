import React, {useMemo, useState} from "react"
import "./scheduler.css"
import {updateScheduleDangerously} from "../../../Services/Services"
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Slide,
	Switch,
	TextField,
	CircularProgress,
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import {Link} from "react-router-dom"
import Axios from "axios"

import {useConfirm} from "material-ui-confirm"
import AdjustIcon from "@material-ui/icons/Adjust"

import {copyToClipboard, retrieveMeetingLink} from "../../../Services/utils"
import {Copy, XCircle} from "react-feather"
import TableCard from "./TableCard"
import {useSnackbar} from "notistack"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const SchedulerModal = ({
	open,
	setOpen,
	selectedSchedule,
	setSelectedSchedule,
	fetchSchedules,
	teacherObj,
}) => {
	const confirm = useConfirm()
	const [scheduleId, setScheduleId] = useState("")
	const [toggleLoading, setToggleLoading] = useState(false)
	const meetingLink = useMemo(() => retrieveMeetingLink(selectedSchedule), [selectedSchedule])
	const {enqueueSnackbar} = useSnackbar()

	const deleteSchedule = async () => {
		try {
			setScheduleId("")
			confirm({
				description: "Do you Really want to Delete!",
				confirmationText: "Yes! delete",
			})
				.then(async () => {
					await Axios.get(`${process.env.REACT_APP_API_KEY}/schedule/delete/${scheduleId}`)
					fetchSchedules()
				})
				.catch(() => {})
		} catch (error) {}
	}
	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={() => setOpen(!open)}
			fullWidth
		>
			<DialogTitle id="alert-dialog-slide-title">{teacherObj.TeacherName}</DialogTitle>

			<div
				style={{
					display: "flex",
					marginTop: -10,
					justifyContent: "space-between",
					paddingLeft: 5,
					paddingRight: 5,
					alignItems: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Button
						style={{width: 10}}
						onClick={() => {
							copyToClipboard(meetingLink)
						}}
						edge="end"
					>
						<Copy />
					</Button>
					<p style={{fontSize: 10}}>Zoom</p>
				</div>

				<div>
					{selectedSchedule && (
						<>
							{toggleLoading ? (
								<CircularProgress style={{height: 30, width: 30}} />
							) : (
								<>
									<Switch
										checked={selectedSchedule.isClassTemperarilyCancelled}
										onChange={() => {
											updateScheduleDangerously(selectedSchedule._id, {
												isClassTemperarilyCancelled: !selectedSchedule.isClassTemperarilyCancelled,
											})
												.then((response) => {
													setSelectedSchedule((prev) => {
														let prevData = {...prev}
														prevData.isClassTemperarilyCancelled =
															!selectedSchedule.isClassTemperarilyCancelled
														return prevData
													})
													enqueueSnackbar("Schedule updated successfully", {variant: "success"})
													fetchSchedules()
												})
												.catch((error) => {
													console.log(error)
													enqueueSnackbar(
														error?.response?.data?.message || "Error updating schedule",
														{variant: "error"}
													)
													setToggleLoading(false)
												})
										}}
										color="primary"
										inputProps={{"aria-label": "primary checkbox"}}
									/>
									<p style={{fontSize: 10}}>Cancel Class</p>
								</>
							)}
						</>
					)}
				</div>
			</div>

			<DialogContent style={{padding: 6}}>
				{selectedSchedule && (
					<div
						style={{
							width: "100%",
						}}
					>
						<TableCard data={selectedSchedule.students} />
					</div>
				)}

				<span style={{}}>
					{selectedSchedule ? (
						<>
							<div
								style={{
									width: "100%",
									marginTop: "5px",
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
									}}
								>
									{selectedSchedule.isClassTemperarilyCancelled ? (
										<>
											<TextField
												id="message"
												label="Message"
												fullWidth
												variant="outlined"
												value={selectedSchedule.message}
												onChange={(e) => {
													e.persist()
													setSelectedSchedule((prev) => {
														let oldSchedule = {...prev}
														let newSchedule = {
															...oldSchedule,
															message: e.target.value,
														}
														return newSchedule
													})
												}}
											/>
											<Button
												variant="contained"
												style={{marginLeft: "10px"}}
												color="primary"
												onClick={() => {
													updateScheduleDangerously(selectedSchedule._id, {
														message: selectedSchedule.message,
													})
														.then((response) => {
															fetchSchedules()
															enqueueSnackbar("Updated schedule successfully", {variant: "success"})
														})
														.catch((error) => {
															console.error(error)
															enqueueSnackbar("error updating Schedule", {variant: "error"})
														})
												}}
											>
												{" "}
												Submit{" "}
											</Button>
										</>
									) : (
										""
									)}
								</div>
							</div>
						</>
					) : (
						""
					)}
				</span>
			</DialogContent>
			<DialogActions
				style={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						width: "100%",
						marginBottom: 10,
						marginLeft: 8,
					}}
				>
					<Button onClick={() => setOpen(false)} variant="outlined" color="primary">
						<XCircle />
					</Button>
					<Link style={{textDecoration: "none"}} to={`/edit-schedule/${scheduleId}`}>
						<Button
							style={{width: "100%"}}
							variant="outlined"
							color="primary"
							// startIcon={<EditIcon />}
						>
							<EditIcon />
						</Button>
					</Link>
					<Button
						onClick={() => deleteSchedule()}
						variant="outlined"
						color="secondary"
						// startIcon={<DeleteIcon />}
					>
						<DeleteIcon />
					</Button>

					<Button
						onClick={() => window.open(meetingLink)}
						variant="outlined"
						style={{backgroundColor: "#2ecc71", color: "white"}}
						// startIcon={<AdjustIcon />}
					>
						<AdjustIcon />
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	)
}

export default SchedulerModal
