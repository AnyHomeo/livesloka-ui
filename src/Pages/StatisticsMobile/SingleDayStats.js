import React, {useCallback, useEffect, useState} from "react"
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
import {Grid} from "@material-ui/core"
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
	alertSetStates,
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

	let todayDay = moment().get("day")
	let daysToAddToday = value >= todayDay ? value - todayDay : 7 - (todayDay - value)

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
				setTodayData(createObject(data.data.result))
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
	}, [refresh])

	useEffect(() => {
		getEntireDayStatistics(day.toLowerCase())
			.then((data) => {
				setTodayData(createObject(data.data.result))
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

	const createObject = (data) => {
		let obj = {}

		times.forEach((time, i) => {
			let prevTime = i !== 0 ? `${day}-${times[i - 1]}` : ""
			let timeNow = `${day}-${time}`

			data.forEach((singleData) => {
				if (
					singleData.slots[day.toLowerCase()].includes(timeNow) &&
					!singleData.slots[day.toLowerCase()].includes(prevTime)
				) {
					obj[time] = obj[time] || {data: []}
					obj[time].data.push(singleData)
				}
			})
		})

		return obj
	}

	console.log(todayData)
	return (
		<section className="statistics-container">
			<Grid container>
				{Object.keys(todayData).map((item, i) => {
					return (
						<Grid key={i} item sx={12} style={{width: "100%"}}>
							<div className="hour">
								<Card
									style={{
										width: "100%",
										height: "auto",
										display: "flex",
										flexDirection: "column",
										marginTop: 10,
										borderRadius: "0px !important",
										border: "1px solid rgb(9, 132, 227)",
										boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
									}}
								>
									<Card style={{backgroundColor: "rgb(9, 132, 227)"}}>
										<p style={{textAlign: "center", padding: 5, color: "white"}}>{`${
											item.split(" ")[0]
										} ${item.split(" ")[1].split("-")[0]}`}</p>
									</Card>
									{todayData[item].data.map((singleData, i) => (
										<SingleRow
											key={i}
											setDialogData={setDialogData}
											day={day}
											selectedSlot={selectedSlot}
											singleData={singleData}
											setDialogOpen={setDialogOpen}
											leaves={leaves}
											alertSetStates={alertSetStates}
											schedulesAssignedToMe={schedulesAssignedToMe}
											setSchedulesAssignedToMe={setSchedulesAssignedToMe}
											otherSchedules={otherSchedules}
											allAgents={allAgents}
											teacherIds={teacherIds}
											isToday={isToday}
											scheduleLeaves={scheduleLeaves}
											searchField={searchField}
										/>
									))}
								</Card>
							</div>
						</Grid>
					)
				})}
			</Grid>
		</section>
	)
}

export default SingleDayStats
