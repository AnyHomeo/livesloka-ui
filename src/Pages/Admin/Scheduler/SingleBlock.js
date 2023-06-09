import React, {useEffect, useState} from "react"
import Checkbox from "@material-ui/core/Checkbox"
import {IconButton, makeStyles, Tooltip} from "@material-ui/core"
import {
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	ChevronUp,
	Send,
	Star,
	UserCheck,
} from "react-feather"
import {getNewSlots} from "./helpers"
import {useSnackbar} from "notistack"
import Axios from "axios"
import {useConfirm} from "material-ui-confirm"
import {isFuture} from "../../../Services/utils"

function SingleBlock({
	day,
	time,
	j,
	categorizedData,
	category,
	teacher,
	addOrRemoveAvailableSlot,
	setScheduleId,
	availableSlotsEditingMode,
	allSchedules,
	setRefresh,
	selectedSlots,
	setSelectedSlots,
	createGroup,
	setLoading,
	toggleShiftScheduleMode,
	options,
}) {
	const [schedule, setSchedule] = useState({})
	const classes = useStyles()
	const {enqueueSnackbar} = useSnackbar()
	const confirm = useConfirm()

	useEffect(() => {
		if (categorizedData[category][teacher].scheduledSlots[`${day.toUpperCase()}-${time}`]) {
			setSchedule(
				allSchedules.filter(
					(schedule) =>
						schedule._id ===
						categorizedData[category][teacher].scheduledSlots[`${day.toUpperCase()}-${time}`]
				)[0]
			)
		} else {
			setSchedule({})
		}
	}, [allSchedules, categorizedData, teacher, category, day, time])

	const moveSchedule = (direction, count) => async (e) => {
		e.stopPropagation()
		try {
			await confirm({
				title: "Are you sure to shift the schedule?",
			})
			setLoading(true)
			let teacherData = categorizedData[category][teacher]
			let slots = getNewSlots(schedule.slots, direction, count)
			console.log(slots, direction, schedule, teacherData)
			let doesDaysExist = false
			let doesHaveBlockingSchedules = false
			for (let i = 0; i < Object.keys(slots).length; i++) {
				const day = Object.keys(slots)[i]
				if (slots[day].length) {
					doesDaysExist = true
					let hasSchedules = slots[day].some((slot) => {
						return (
							teacherData.scheduledSlots[slot] && schedule._id !== teacherData.scheduledSlots[slot]
						)
					})
					console.log(hasSchedules)
					if (hasSchedules) {
						doesHaveBlockingSchedules = true
						break
					}
				}
			}
			if (!doesDaysExist) {
				enqueueSnackbar("No Available slots to move", {
					variant: "error",
				})
				setLoading(false)
				return
			}
			if (doesHaveBlockingSchedules) {
				enqueueSnackbar("Blocked by other schedule", {
					variant: "error",
				})
				setLoading(false)
				return
			}

			const res = await Axios.post(
				`${process.env.REACT_APP_API_KEY}/schedule/edit/${schedule._id}`,
				{
					...schedule,
					slots,
				}
			)
			setTimeout(() => {
				setLoading(false)
			}, 2000)
			if (res.status === 200) {
				setRefresh((prev) => !prev)
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<div
				key={j}
				className={`day-time-intersection-box`}
				style={{
					cursor:
						categorizedData[category][teacher].scheduledSlots[`${day.toUpperCase()}-${time}`] ||
						availableSlotsEditingMode
							? "pointer"
							: "not-allowed",
				}}
				onClick={() => {
					if (Object.keys(schedule).length) {
						setScheduleId(
							categorizedData[category][teacher].scheduledSlots[`${day.toUpperCase()}-${time}`]
						)
					} else if (availableSlotsEditingMode) {
						addOrRemoveAvailableSlot(`${day.toUpperCase()}-${time}`)
					}
				}}
			>
				<div
					style={{
						cursor:
							categorizedData[category][teacher].scheduledSlots[`${day.toUpperCase()}-${time}`] ||
							availableSlotsEditingMode
								? "pointer"
								: "default",
						background:
							schedule && Object.keys(schedule).length
								? schedule.cancelledTill && isFuture(schedule.cancelledTill)
									? "#aaa"
									: schedule.demo
									? "linear-gradient(315deg, #e84118 0%, #e84118 74%)"
									: schedule.isSummerCampClass
									? "#3867D6"
									: "linear-gradient(315deg, #f39c12 0%, #f39c12 74%)"
								: categorizedData[category][teacher].availableSlots.includes(
										`${day.toUpperCase()}-${time}`
								  )
								? "linear-gradient(315deg, #3bb78f 0%, #0bab64 74%)"
								: undefined,
					}}
					className="blockName"
				>
					<div>
						{options &&
							options[`${day.toUpperCase()}-${time}`] &&
							options[`${day.toUpperCase()}-${time}`].map((customer) => (
								<Tooltip title={customer}>
									<div style={{position: "absolute", bottom: 0, left: 0}}>
										<Star size={16} color="#000" />
									</div>
								</Tooltip>
							))}
					</div>
					{schedule && Object.keys(schedule).length ? (
						<>
							{schedule.className}
							<Tooltip
								onClick={(e) => {
									e.stopPropagation()
									createGroup(schedule)
								}}
								className={classes.topLeft}
								title={schedule.group ? "Group Already Created" : "Create Group"}
							>
								<IconButton size="small">
									{schedule.group ? <UserCheck size={20} /> : <Send size={20} />}
								</IconButton>
							</Tooltip>
							{toggleShiftScheduleMode ? (
								<div className={classes.topRight}>
									<Tooltip title={"Move up by half an Hour"}>
										<IconButton size="small" onClick={moveSchedule("up", 0)}>
											<ChevronUp size={20} />
										</IconButton>
									</Tooltip>
									<Tooltip title={"Move up by one Hour"}>
										<IconButton size="small" onClick={moveSchedule("up", 1)}>
											<ChevronsUp size={20} />
										</IconButton>
									</Tooltip>
									<Tooltip title={"Move down by half an Hour"}>
										<IconButton size="small" onClick={moveSchedule("down", 0)}>
											<ChevronDown size={20} />
										</IconButton>
									</Tooltip>
									<Tooltip title={"Move down by one Hour"}>
										<IconButton size="small" onClick={moveSchedule("down", 1)}>
											<ChevronsDown size={20} />
										</IconButton>
									</Tooltip>
								</div>
							) : (
								<div className={classes.topRight}>
									<div className={classes.flex}>
										{schedule.students && schedule.students.length
											? schedule.students.map((student) =>
													student.age ? (
														<Tooltip title={student?.firstName}>
															<div className={classes.smallAvatar}>{student.age}</div>
														</Tooltip>
													) : (
														""
													)
											  )
											: ""}
									</div>
								</div>
							)}
						</>
					) : categorizedData[category][teacher].availableSlots.includes(
							`${day.toUpperCase()}-${time}`
					  ) ? (
						<>
							<Checkbox
								style={{position: "absolute", left: "5px", top: "5px"}}
								checked={selectedSlots.includes(`${day.toUpperCase()}-${time}`)}
								onChange={() =>
									setSelectedSlots((prev) => {
										let prevData = [...prev]
										let str = `${day.toUpperCase()}-${time}`
										if (prevData.includes(str)) {
											let index = prevData.indexOf(str)
											prevData.splice(index, 1)
											return prevData
										} else {
											return [...prevData, str]
										}
									})
								}
								inputProps={{"aria-label": "primary checkbox"}}
							/>
							Available
						</>
					) : (
						""
					)}
				</div>
			</div>
		</>
	)
}

const useStyles = makeStyles(() => ({
	topLeft: {
		position: "absolute",
		top: 5,
		left: 5,
	},
	topRight: {
		position: "absolute",
		top: 5,
		right: 5,
	},
	flex: {
		display: "flex",
		alignItems: "center",
		gap: 5,
	},
	smallAvatar: {
		borderRadius: 10,
		padding: "0px 8px",
		backgroundColor: "#3A68D5",
		display: "grid",
		placeItems: "center",
	},
}))

export default SingleBlock
