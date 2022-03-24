import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	Switch,
	TextField,
} from "@material-ui/core"
import React, {useCallback, useMemo, useState} from "react"
import {useSnackbar} from "notistack"
import {updateScheduleDangerously} from "../Services/Services"
import {isFuture} from "../Services/utils"
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"

const MessageAndDateDialog = ({isOpen, handleClose, onSubmit, schedule}) => {
	const [message, setMessage] = useState("")
	const [cancelledTill, setCancelledTill] = useState(new Date().setHours(0, 0, 0, 0))

	return (
		<Dialog open={isOpen}>
			<DialogTitle onClose={handleClose}>
				{schedule.className && schedule.className.length > 40
					? `Cancel ${schedule.className.slice(0,40)}...`
					: schedule.className}
			</DialogTitle>
			<DialogContent dividers>
				<TextField
					id="message"
					label="Message"
					style={{marginBottom: 20}}
					fullWidth
					variant="outlined"
					value={message}
					onChange={(e) => {
						e.persist()
						setMessage(e.target.value)
					}}
				/>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<DateTimePicker
						margin="normal"
						fullWidth
						disablePast
						id="date-picker-dialog"
						label="Select Leave Date"
						inputVariant="outlined"
						variant="static"
						value={cancelledTill}
						onChange={setCancelledTill}
					/>
				</MuiPickersUtilsProvider>
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" color="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="contained" color="primary" onClick={onSubmit({message, cancelledTill})}>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	)
}

const ToggleCancelClass = ({onToggleSuccess, schedule, setSchedule}) => {
	const [openModal, setOpenModal] = useState(false)
	const {enqueueSnackbar} = useSnackbar()

	const onSubmit = useCallback(
		({cancelledTill, message}) =>
			() => {
				let doesPrevCancelledTillExists = schedule.cancelledTill && isFuture(schedule.cancelledTill)
				updateScheduleDangerously(schedule?._id, {
					cancelledTill: doesPrevCancelledTillExists ? new Date() : cancelledTill,
					message,
				})
					.then((response) => {
						enqueueSnackbar(
							!doesPrevCancelledTillExists
								? "Cancelled class successfully"
								: "Enabled class successfully"
						)
						onToggleSuccess()
						setSchedule((prev) => ({
							...prev,
							cancelledTill: doesPrevCancelledTillExists ? new Date() : cancelledTill,
							message,
						}))
						setOpenModal(false)
					})
					.catch((error) => {
						console.log(error)
						enqueueSnackbar("Toggle cancelling class failed")
						setOpenModal(false)
					})
			},
		[enqueueSnackbar, onToggleSuccess, schedule?._id, schedule?.cancelledTill, setSchedule]
	)

	const handleDialogClose = () => {
		setOpenModal(false)
	}

	const isChecked = useMemo(
		() => !!(schedule.cancelledTill && isFuture(schedule.cancelledTill)),
		[schedule.cancelledTill]
	)

	console.log(schedule.cancelledTill)

	return (
		<>
			<FormControl variant="outlined">
				<FormControlLabel
					control={
						<Switch
							checked={isChecked}
							onChange={() => {
								!isChecked
									? setOpenModal(true)
									: onSubmit({cancelledTill: new Date(), message: ""})()
							}}
							name="cancelledTill"
						/>
					}
					label="Toggle class Cancellation"
				/>
			</FormControl>
			<MessageAndDateDialog
				isOpen={openModal}
				schedule={schedule}
				handleClose={handleDialogClose}
				onSubmit={onSubmit}
				setSchedule={setSchedule}
			/>
		</>
	)
}

export default ToggleCancelClass
