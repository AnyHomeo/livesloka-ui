import React, {useCallback, useEffect, useMemo, useState} from "react"
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
import moment from "moment"
import {getDaysToAdd} from "../../Services/utils"
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

function SingleDayStats({
	day,
	value,
	setDialogOpen,
	setDialogData,
	refresh,
	setRefresh,
	isToday,
	searchField,
}) {
	const [todayData, setTodayData] = useState([])
	const [selectedSlot, setSelectedSlot] = useState("")
	const [leaves, setLeaves] = useState([])
	const [schedulesAssignedToMe, setSchedulesAssignedToMe] = useState([])
	const [otherSchedules, setOtherSchedules] = useState({})
	const [allAgents, setAllAgents] = useState({})
	const [teacherLeaves, setTeacherLeaves] = useState([])

	const [filteredData, setFilteredData] = useState(todayData)
	let daysToAddToday = useMemo(() => getDaysToAdd(value), [value])

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
			const {slot} = getSlotFromTime(date)
			setSelectedSlot(slot)
			setInterval(() => {
				let date = new Date().toLocaleString("en-US", {
					timeZone: "Asia/Kolkata",
				})
				const {slot} = getSlotFromTime(date)
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
		getTodayLeaves(moment().add(daysToAddToday, "day").format("YYYY-MM-DD"))
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
	}, [day, daysToAddToday, refresh])

	useEffect(() => {
		getEntireDayStatistics(day.toLowerCase())
			.then((data) => {
				setTodayData(data.data.result)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [refresh, day])

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
	const getTeacherLeaves = useCallback(async () => {
		try {
			const data = await Axios.get(
				`${process.env.REACT_APP_API_KEY}/teacher-leaves/single-day/${moment()
					.set("day", value)
					.format()}`
			)
			setTeacherLeaves(data?.data?.result || {})
		} catch (error) {
			console.log(error)
		}
	}, [value])

	useEffect(() => {
		getTeacherLeaves()
	}, [getTeacherLeaves])

	const [teacherIds, setTeacherIds] = useState()

	const [scheduleLeaves, setscheduleLeaves] = useState()
	const arrayOfTeacherIds = useCallback(() => {
		let arrofObj = {}
		let ids = []
		teacherLeaves &&
			teacherLeaves.entireDayLeaves &&
			teacherLeaves.entireDayLeaves.map((id) => ids.push(id.teacherId))
		setTeacherIds(ids)

		teacherLeaves &&
			teacherLeaves.scheduleLeaves &&
			teacherLeaves.scheduleLeaves.forEach((id) => {
				let date = getSlotFromTime(moment(id.date).add(2, "minutes"))

				if (arrofObj[date.slot]) {
					arrofObj[date.slot].push(id.teacherId)
				} else {
					arrofObj[date.slot] = [id.teacherId]
				}
			})
		setscheduleLeaves(arrofObj)
	}, [teacherLeaves])

	useEffect(() => {
		arrayOfTeacherIds()
	}, [arrayOfTeacherIds])

	useEffect(() => {
		handleOnChange(searchField)
	}, [searchField, todayData])

	const arraySearch = (array, keyword) => {
		const searchTerm = keyword.toLowerCase()
		return array.filter((value) => {
			return value?.className?.toLowerCase().match(new RegExp(searchTerm, "g"))
		})
	}

	const handleOnChange = async (e) => {
		let value = e

		if (value.length > 2) {
			let search = await arraySearch(todayData, value)
			setFilteredData(search)
		} else {
			setFilteredData(todayData)
		}
	}

	return (
		<section className="statistics-container">
			<div className="hours-display">
				{hours.map((hour) => (
					<div key={hour} className="hour" style={{width: 80}}>
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
						todayData={filteredData}
						setDialogOpen={setDialogOpen}
						leaves={leaves}
						schedulesAssignedToMe={schedulesAssignedToMe}
						setSchedulesAssignedToMe={setSchedulesAssignedToMe}
						otherSchedules={otherSchedules}
						allAgents={allAgents}
						teacherIds={teacherIds}
						isToday={isToday}
						scheduleLeaves={scheduleLeaves}
						setRefresh={setRefresh}
					/>
				))}
			</div>
		</section>
	)
}

export default SingleDayStats
