import {Card, IconButton, Tooltip} from "@material-ui/core"
import React, {useEffect, useRef} from "react"
import {UserCheck, UserMinus, Video, UserX, Flag} from "react-feather"
import LoopIcon from "@material-ui/icons/Loop"
import {useConfirm} from "material-ui-confirm"
import {updateSchedulesOfAdminToday, updateZoomLinkToNewOne} from "../../Services/Services"
import DoneIcon from "@material-ui/icons/Done"
import Checkbox from "@material-ui/core/Checkbox"
import {isAutheticated} from "../../auth"
import io from "socket.io-client"
import moment from "moment"
import {isFuture} from "../../Services/utils"
const socket = io(process.env.REACT_APP_API_KEY)
function SingleRow({
	setDialogOpen,
	singleData,
	time,
	selectedSlot,
	setDialogData,
	leaves,
	alertSetStates,
	schedulesAssignedToMe,
	setSchedulesAssignedToMe,
	otherSchedules,
	allAgents,
	teacherIds,
	isToday,
	scheduleLeaves,
}) {
	const divRef = useRef(null)
	const confirm = useConfirm()
	const {setAlert, setAlertColor, setRefresh, setSuccessOpen} = alertSetStates

	useEffect(() => {
		if (divRef.current) {
			divRef.current.scrollIntoView({behavior: "smooth"})
		}
	}, [selectedSlot, time])
	const updateClassesAssignedToMe = async (id) => {
		if (schedulesAssignedToMe.includes(id)) {
			let updatedSchedules = []
			setSchedulesAssignedToMe((prev) => {
				let prevIds = [...prev]
				let index = prevIds.indexOf(id)
				prevIds.splice(index, 1)
				updatedSchedules = prevIds
				return prevIds
			})
			await updateSchedulesOfAdminToday(updatedSchedules)
			socket.emit("agent-assigned-class", {
				[allAgents[isAutheticated().agentId]]: id,
			})
		} else {
			let updatedSchedules = [...schedulesAssignedToMe, id]
			setSchedulesAssignedToMe((prev) => [...prev, id])
			await updateSchedulesOfAdminToday(updatedSchedules)
			socket.emit("agent-assigned-class", {
				[allAgents[isAutheticated().agentId]]: id,
			})
		}
	}

	const resetZoomLink = (id) => {
		confirm({
			description: "Do you Really want to Update Zoom Link!",
			confirmationText: "Yes!",
		})
			.then(() => {
				updateZoomLinkToNewOne(id)
					.then((data) => {
						setRefresh((prev) => !prev)
						setAlert(data.data.message)
						setAlertColor("success")
						setSuccessOpen(true)
					})
					.catch((err) => {
						console.log(err)
						setAlert(err.response.data.error)
						setAlertColor("warning")
						setSuccessOpen(true)
					})
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const scheduleLeavesGen = (id) => {
		return scheduleLeaves && scheduleLeaves[time]?.includes(id)
	}

	const renderFlag = (student) => {
		if (
			student.every((rowData) =>
				rowData.autoDemo
					? moment(rowData.paidTill).diff(moment(new Date()), "days") + 1 <= 0
					: rowData.numberOfClassesBought <= 0
			)
		) {
			return (
				<div>
					<Flag style={{color: "#d63031", height: 18, width: 18}} />
				</div>
			)
		} else {
			return null
		}
	}

	return (
		<Card
			style={{
				height: 45,
				width: "100%",
				margin: 1,
				display: "flex",
				background:
					isToday && scheduleLeavesGen(singleData.teacher && singleData.teacher._id)
						? "rgb(48, 51, 107, 0.5)"
						: singleData.isTeacherJoined
						? "#2ecc7075"
						: singleData.demo
						? "#f1c40fb6"
						: singleData.cancelledTill && isFuture(singleData.cancelledTill)
						? "rgb(170, 170, 170)"
						: teacherIds?.includes(singleData.teacher && singleData.teacher._id)
						? "rgb(56, 103, 214, 0.5)"
						: "#ff757562",
			}}
		>
			<div
				style={{
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flex: 0.1,
				}}
			>
				{singleData.demo ? (
					<div className="small-chip" style={{height: 30, width: 30, backgroundColor: "#eb4d4b"}}>
						<p style={{fontSize: 14}}>
							{teacherIds?.includes(singleData.teacher && singleData.teacher._id) ? "L" : "D"}
						</p>
					</div>
				) : teacherIds?.includes(singleData.teacher && singleData.teacher._id) ? (
					<div className="small-chip" style={{height: 30, width: 30, backgroundColor: "#3867d6"}}>
						<p style={{fontSize: 14}}>L</p>
					</div>
				) : scheduleLeavesGen(singleData.teacher && singleData.teacher._id) ? (
					<div className="small-chip" style={{height: 30, width: 30, backgroundColor: "#130f40"}}>
						<p style={{fontSize: 14}}>L</p>
					</div>
				) : (
					<div style={{height: 30, width: 30}}></div>
				)}

				{renderFlag(singleData?.students)}
			</div>

			<div
				style={{
					flex: 0.6,
				}}
				onClick={() => {
					setDialogOpen((prev) => !prev)
					setDialogData(singleData)
				}}
			>
				<div style={{padding: 3}}>
					<p style={{fontSize: 12}}>{singleData.teacher && singleData.teacher.TeacherName}</p>

					<div style={{display: "flex", alignItems: "center"}}>
						{singleData.students.map((student) => (
							<>
								{isToday && student.isStudentJoined ? (
									<Tooltip title={student.firstName} key={student.firstName}>
										<div
											className="small-chip"
											style={{
												background: "#007500",
											}}
										>
											<UserCheck
												style={{
													color: "white",
													height: 12,
													width: 12,
												}}
											/>
										</div>
									</Tooltip>
								) : (
									<Tooltip title={student.firstName} key={student.firstName}>
										{leaves.find((leave) => leave.studentId === student._id) ? (
											<div
												className="small-chip"
												style={{
													background: "black",
												}}
											>
												<UserX
													style={{
														color: "white",
														height: 12,
														width: 12,
														marginLeft: 2,
													}}
												/>
											</div>
										) : (
											<div
												className="small-chip"
												style={{
													background: "#b33939",
												}}
											>
												<UserMinus
													style={{
														color: "white",
														height: 12,
														width: 12,
														marginLeft: 2,
													}}
												/>
											</div>
										)}
									</Tooltip>
								)}
							</>
						))}
					</div>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flex: 0.255,
				}}
			>
				<IconButton size="small" onClick={() => resetZoomLink(singleData._id)} edge="end">
					<LoopIcon />
				</IconButton>
				<a target="_blank" href={singleData?.teacher?.joinLink} rel="noreferrer">
					<IconButton size="small">
						<Video style={{height: 18, width: 18, color: "#0984e3"}} />
					</IconButton>
				</a>

				{isToday && (
					<>
						{Object.keys(otherSchedules)
							.filter((agentName) => otherSchedules[agentName].includes(singleData._id))
							.map((agentName) => (
								<Tooltip title={"assigned to " + agentName}>
									<IconButton size="small">
										<div className="small-chip">
											{agentName.split(" ").map((word) => word[0].toUpperCase())}
										</div>
									</IconButton>
								</Tooltip>
							))}
						{!Object.keys(otherSchedules).some((agentName) =>
							otherSchedules[agentName].includes(singleData._id)
						) ? (
							<Tooltip
								title={
									schedulesAssignedToMe && schedulesAssignedToMe.includes(singleData._id)
										? "Assigned to you"
										: "Assign this class"
								}
							>
								<Checkbox
									size="small"
									checkedIcon={<DoneIcon />}
									onChange={() => updateClassesAssignedToMe(singleData._id)}
									checked={schedulesAssignedToMe && schedulesAssignedToMe.includes(singleData._id)}
								/>
							</Tooltip>
						) : (
							""
						)}
					</>
				)}
			</div>
		</Card>
	)
}

export default SingleRow
