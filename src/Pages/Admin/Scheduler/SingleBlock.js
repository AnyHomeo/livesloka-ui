import React, {useEffect, useState} from "react"
import Checkbox from "@material-ui/core/Checkbox"
import {IconButton, makeStyles, Tooltip} from "@material-ui/core"
import {ArrowDown, ArrowUp, Send, UserCheck} from "react-feather"
import { getNewSlots } from './helpers';

function SingleBlock({
	day,
	time,
	i,
	j,
	categorizedData,
	category,
	teacher,
	addOrRemoveAvailableSlot,
	setScheduleId,
	availableSlotsEditingMode,
	allSchedules,
	teacherID,
	selectedSlots,
	setSelectedSlots,
	createGroup,
}) {
	const [schedule, setSchedule] = useState({})
	const classes = useStyles()

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

	const moveSchedule = (direction) => (e) => {
		e.stopPropagation()
		let teacherData = categorizedData[category][teacher]
		let slots = getNewSlots(schedule.slots, direction)
		console.log(slots,direction,schedule,teacherData)
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
						background: Object.keys(schedule).length
							? schedule.isClassTemperarilyCancelled
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
					{Object.keys(schedule).length ? (
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
							<div className={classes.topRight} >
							<Tooltip
								title={"Move up by 1 Hour"}
							>
								<IconButton size="small" onClick={moveSchedule('up')} >
									<ArrowUp size={20} />
								</IconButton>
							</Tooltip>
							<Tooltip
								title={"Move down by 1 Hour"}
							>
								<IconButton size="small" onClick={moveSchedule('down')} >
									<ArrowDown size={20} />
								</IconButton>
							</Tooltip>
							</div>
							
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
}))

export default SingleBlock
