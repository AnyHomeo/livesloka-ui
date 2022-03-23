import {Card, Checkbox, IconButton} from "@material-ui/core"
import React, {useState} from "react"
import {UserCheck, MessageSquare} from "react-feather"
import {isFuture} from "../../../Services/utils"
import SchedulerModal from "./SchedulerModal"
const SchedulerCard = ({
	isAvailable,
	schedules,
	fetchSchedules,
	selectedSlots,
	teacher,
	setSelectedSlots,
}) => {
	const [selectedData, setSelectedData] = useState()
	const [open, setOpen] = useState(false)
	const onCardClick = () => {
		setOpen(!open)
		setSelectedData(schedules.schedule)
	}

	return (
		<div>
			{isAvailable ? (
				<Card
					// onClick={onCardClick}
					style={{
						height: 45,
						width: "100%",
						margin: 1,
						display: "flex",
						marginTop: 1,
						marginBottom: 1,
						flexDirection: "column",
						background: "#2ecc7075",
					}}
				>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
						<div
							style={{
								height: "100%",
								width: 50,
								backgroundColor: "rgb(9, 132, 227",
								borderTopRightRadius: 15,
								borderBottomRightRadius: 15,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								color: "white",
								flexDirection: "column",
								marginTop: 3,
							}}
						>
							<p style={{fontSize: 12}}>{schedules.hour.split(" ")[0]}</p>
							<p style={{fontSize: 12}}>{schedules.hour.split(" ")[1]}</p>
						</div>

						<p style={{fontSize: 12, textAlign: "center"}}>Available</p>
						<div>
							<Checkbox
								checked={selectedSlots.includes(schedules?.slot)}
								onChange={() =>
									setSelectedSlots((prev) => {
										let prevData = [...prev]
										let str = schedules?.slot
										if (prevData.includes(str)) {
											let index = prevData.indexOf(str)
											prevData.splice(index, 1)
											return prevData
										} else {
											return [...prevData, str]
										}
									})
								}
							/>
						</div>
					</div>
				</Card>
			) : (
				<Card
					onClick={onCardClick}
					style={{
						height: 45,
						width: "100%",
						margin: 1,
						display: "flex",
						marginTop: 1,
						marginBottom: 1,
						flexDirection: "column",
						background:
							schedules.schedule.cancelledTill && isFuture(schedules.schedule.cancelledTill)
								? "rgb(170 170 170 / 39%)"
								: schedules.schedule?.available
								? "#2ecc7075"
								: schedules.schedule.isSummerCampClass
								? "rgba(241, 196, 15, 0.619)"
								: schedules.schedule.demo
								? "rgb(56, 103, 214, 0.5)"
								: "#ff757562",
					}}
				>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
						<div
							style={{
								height: "100%",
								width: 50,
								backgroundColor: "rgb(9, 132, 227",
								borderTopRightRadius: 15,
								borderBottomRightRadius: 15,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								color: "white",
								flexDirection: "column",
								marginTop: 3,
							}}
						>
							<p style={{fontSize: 12}}>{schedules.hour.split(" ")[0]}</p>
							<p style={{fontSize: 12}}>{schedules.hour.split(" ")[1]}</p>
						</div>

						<p style={{fontSize: 12, textAlign: "center"}}>{schedules.schedule.className}</p>
						<div style={{display: "flex", alignItems: "center", paddingRight: 5}}>
							<IconButton size="small">
								{schedules.schedule.group ? <UserCheck size={20} /> : <MessageSquare size={20} />}
							</IconButton>
						</div>
					</div>
				</Card>
			)}

			<SchedulerModal
				open={open}
				setOpen={setOpen}
				selectedSchedule={selectedData}
				setSelectedSchedule={setSelectedData}
				fetchSchedules={fetchSchedules}
				teacherObj={teacher}
			/>
		</div>
	)
}

export default SchedulerCard
