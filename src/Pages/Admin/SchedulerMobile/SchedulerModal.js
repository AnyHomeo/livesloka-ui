import React, {useMemo, useState} from "react"
import "./scheduler.css"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import {Link} from "react-router-dom"
import Axios from "axios"

import {useConfirm} from "material-ui-confirm"
import AdjustIcon from "@material-ui/icons/Adjust"

import {copyToClipboard, retrieveMeetingLink} from "../../../Services/utils"
import {Copy, XCircle} from "react-feather"
import TableCard from "./TableCard"
import ToggleCancelClass from "../../../Components/ToggleCancelClass"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const SchedulerModal = ({selectedSchedule, setSelectedSchedule, fetchSchedules, teacher}) => {
	const confirm = useConfirm()
	const [scheduleId, setScheduleId] = useState("")
	const meetingLink = useMemo(() => retrieveMeetingLink(selectedSchedule), [selectedSchedule])

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
			open={Object.keys(selectedSchedule).length}
			TransitionComponent={Transition}
			keepMounted
			onClose={() => setSelectedSchedule({})}
			fullWidth
		>
			<DialogTitle id="alert-dialog-slide-title">{teacher?.TeacherName}</DialogTitle>

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
				<ToggleCancelClass
					schedule={selectedSchedule}
					setSchedule={setSelectedSchedule}
					onToggleSuccess={fetchSchedules}
				/>
			</div>

			<DialogContent style={{padding: 6}}>
				{selectedSchedule && <TableCard data={selectedSchedule.students} />}
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
					<Button onClick={() => setSelectedSchedule({})} variant="outlined" color="primary">
						<XCircle />
					</Button>
					<Link style={{textDecoration: "none"}} to={`/edit-schedule/${scheduleId}`}>
						<Button style={{width: "100%"}} variant="outlined" color="primary">
							<EditIcon />
						</Button>
					</Link>
					<Button onClick={() => deleteSchedule()} variant="outlined" color="secondary">
						<DeleteIcon />
					</Button>

					<Button
						onClick={() => window.open(meetingLink)}
						variant="outlined"
						style={{backgroundColor: "#2ecc71", color: "white"}}
					>
						<AdjustIcon />
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	)
}

export default SchedulerModal
