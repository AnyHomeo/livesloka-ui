import React, {useEffect, useState} from "react"
import hours from "../../Services/hours.json"
import times from "../../Services/times.json"
import SingleRow from "./SingleRow"
import {
	getAdminAssignedClasses,
	getData,
	getEntireDayStatistics,
	getTodayLeaves,
} from "../../Services/Services"
import io from "socket.io-client"
import {Card} from "@material-ui/core"
import {Clock} from "react-feather"
import Axios from "axios"
const socket = io(process.env.REACT_APP_API_KEY)

const getSlotFromTime = (date) => {
	let daysarr = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
	let newDate = new Date(date)
	let dayToday = newDate.getDay()
	let hoursRightNow = newDate.getHours()
	let minutesRightNow = newDate.getMinutes()
	let secondsRightNow = newDate.getSeconds()
	let isAm = hoursRightNow < 12
	hoursRightNow = !isAm ? hoursRightNow - 12 : hoursRightNow
	let is30 = minutesRightNow > 30
	let secondsLeft =
		(is30 ? 59 - minutesRightNow : 29 - minutesRightNow) * 60 + (60 - secondsRightNow)
	if ((hoursRightNow === 11) & is30) {
		return {
			slot: `${daysarr[dayToday]}-11:30 ${isAm ? "AM" : "PM"}-12:00 ${!isAm ? "AM" : "PM"}`,
			secondsLeft,
		}
	} else if (hoursRightNow === 12 && is30) {
		return {
			slot: `${daysarr[dayToday]}-12:30 ${isAm ? "AM" : "PM"}-01:00 ${isAm ? "AM" : "PM"}`,
			secondsLeft,
		}
	} else if (hoursRightNow === 0) {
		return {
			slot: `${daysarr[dayToday]}-12:${is30 ? "30" : "00"} ${isAm ? "AM" : "PM"}-${
				is30 ? "01" : "12"
			}:${is30 ? "00" : "30"} ${isAm ? "AM" : "PM"}`,
			secondsLeft,
		}
	} else {
		return {
			slot: `${daysarr[dayToday]}-${("0" + hoursRightNow).slice(-2)}${is30 ? ":30" : ":00"} ${
				isAm ? "AM" : "PM"
			}-${is30 ? ("0" + (hoursRightNow + 1)).slice(-2) : ("0" + hoursRightNow).slice(-2)}${
				is30 ? ":00" : ":30"
			} ${isAm ? "AM" : "PM"}`,
			secondsLeft,
		}
	}
}

function SingleDayStats({day, setDialogOpen, setDialogData, refresh, alertSetStates}) {
	const [todayData, setTodayData] = useState([])
	const [selectedSlot, setSelectedSlot] = useState("")
	const [leaves, setLeaves] = useState([])
	const [schedulesAssignedToMe, setSchedulesAssignedToMe] = useState([])
	const [otherSchedules, setOtherSchedules] = useState({})
	const [allAgents, setAllAgents] = useState({})

	useEffect(() => {
		socket.on("teacher-joined", ({scheduleId}) => {
			setTodayData((prev) => {
				let prevData = [...prev]
				return prevData.map((singleObj) => ({
					...singleObj,
					isTeacherJoined: singleObj._id === scheduleId ? true : singleObj.isTeacherJoined,
				}))
			})
		})
		socket.on("student-joined", ({scheduleId, email}) => {
			setTodayData((prev) => {
				let prevData = [...prev]
				return prevData.map((singleObj) => {
					return {
						...singleObj,
						students:
							singleObj._id === scheduleId
								? singleObj.students.map((student) => ({
										...student,
										isStudentJoined: email === student.email ? true : student.isStudentJoined,
								  }))
								: singleObj.students,
					}
				})
			})
		})
		socket.on("agent-assigned", (data) => {
			let key = Object.keys(data)[0]
			let value = data[key]
			setOtherSchedules((prev) => {
				let prevObject = {...prev}
				if (prevObject[key]) {
					if (prevObject[key].includes(value)) {
						let index = prevObject[key].indexOf(value)
						prevObject[key].splice(index, 1)
						return prevObject
					} else {
						prevObject[key] = [...prevObject[key], value]
						return prevObject
					}
				} else {
					return prevObject
				}
			})
		})
		let date = new Date().toLocaleString("en-US", {
			timeZone: "Asia/Kolkata",
		})
		const {slot, secondsLeft} = getSlotFromTime(date)
		setSelectedSlot(slot)
		setTimeout(() => {
			let date = new Date().toLocaleString("en-US", {
				timeZone: "Asia/Kolkata",
			})
			const {slot, secondsLeft} = getSlotFromTime(date)
			setSelectedSlot(slot)
			setInterval(() => {
				let date = new Date().toLocaleString("en-US", {
					timeZone: "Asia/Kolkata",
				})
				const {slot, secondsLeft} = getSlotFromTime(date)
				setSelectedSlot(slot)
			}, 30 * 60 * 1000)
		}, (secondsLeft + 3) * 1000)
		getEntireDayStatistics(day.toLowerCase())
			.then((data) => {
				setTodayData(data.data.result)
			})
			.catch((err) => {
				console.log(err)
			})
		getTodayLeaves()
			.then((data) => {
				setLeaves(data.data.result)
			})
			.catch((err) => {
				console.log(err)
			})
		getData("Agent").then((data) => {
			let objectToSet = {}
			data.data.result.forEach((agent) => {
				objectToSet[agent.id] = agent.AgentName
			})
			setAllAgents(objectToSet)
		})
	}, [])

	useEffect(() => {
		getEntireDayStatistics(day.toLowerCase())
			.then((data) => {
				setTodayData(data.data.result)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [refresh])

	useEffect(() => {
		getAdminAssignedClasses()
			.then((data) => {
				setSchedulesAssignedToMe(data.data.result.mySchedules)
				setOtherSchedules(data.data.result.finalObject)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	useEffect(() => {
		getTeacherLeaves()
	}, [])

	const [teacherLeaves, setTeacherLeaves] = useState()
	const getTeacherLeaves = async () => {
		const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/teacher-leaves/today`)
		setTeacherLeaves(data?.data)
	}

	useEffect(() => {
		arrayOfTeacherIds()
	}, [teacherLeaves])

	const [teacherIds, setTeacherIds] = useState()

	const [scheduleLeaves, setscheduleLeaves] = useState()
	const arrayOfTeacherIds = () => {
		let arrofObj = {}
		let ids = []
		teacherLeaves && teacherLeaves.result.entireDayLeaves.map((id) => ids.push(id.teacherId))
		setTeacherIds(ids)

		teacherLeaves &&
			teacherLeaves.result.scheduleLeaves.forEach((id) => {
				console.log(id)
				let date = getSlotFromTime(id.date)

				if (arrofObj[date.slot]) {
					arrofObj[date.slot].push(id.teacherId)
				} else {
					arrofObj[date.slot] = [id.teacherId]
				}
			})

		setscheduleLeaves(arrofObj)
	}

	return (
		<section className="statistics-container">
			<div className="hours-display">
				{hours.map((hour) => (
					<div key={hour} className="hour">
						<Card className="hourCard">
							<Clock />
							{hour}
						</Card>
					</div>
				))}
			</div>
			<div className="stats-display">
				{times.map((time, i) => (
					<SingleRow
						key={time}
						setDialogData={setDialogData}
						day={day}
						selectedSlot={selectedSlot}
						time={`${day}-${time}`}
						prevTime={i !== 0 ? `${day}-${times[i - 1]}` : ""}
						todayData={todayData}
						setDialogOpen={setDialogOpen}
						leaves={leaves}
						alertSetStates={alertSetStates}
						schedulesAssignedToMe={schedulesAssignedToMe}
						setSchedulesAssignedToMe={setSchedulesAssignedToMe}
						otherSchedules={otherSchedules}
						allAgents={allAgents}
						teacherIds={teacherIds}
						scheduleLeaves={scheduleLeaves}
					/>
				))}
			</div>
		</section>
	)
}

export default SingleDayStats
