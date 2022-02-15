import {Card, Chip, IconButton, Tooltip} from "@material-ui/core"
import React, {useEffect, useRef, useState} from "react"
import {UserCheck, UserMinus, Video, UserX, Flag} from "react-feather"
import LoopIcon from "@material-ui/icons/Loop"
import {useConfirm} from "material-ui-confirm"
import {updateSchedulesOfAdminToday, updateZoomLinkToNewOne} from "../../Services/Services"
import DoneIcon from "@material-ui/icons/Done"
import Checkbox from "@material-ui/core/Checkbox"
import {isAutheticated} from "../../auth"
import io from "socket.io-client"
import moment from "moment"
const socket = io(process.env.REACT_APP_API_KEY)
function SingleRow({
	setDialogOpen,
	todayData,
	time,
	day,
	prevTime,
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
				<div
					style={{
						backgroundColor: "#e74c3c",
						borderRadius: "50%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: 20,
						width: 20,
					}}
				>
					<Flag style={{color: "white", height: 15, width: 15}} />
				</div>
			)
		} else {
			return null
		}
	}

	return (
		<div
			className="single-row-container"
			style={{
				backgroundColor:
					selectedSlot === time || selectedSlot === prevTime ? "rgba(56,103,214,0.5)" : undefined,
			}}
		>
			{selectedSlot === time ? <div ref={divRef} /> : ""}
			{todayData.map((singleData) => (
				<>
					{singleData.slots[day.toLowerCase()].includes(time) &&
					!singleData.slots[day.toLowerCase()].includes(prevTime) ? (
						<Card
							className={
								singleData.students.length >= 3 ? "single-card single-card-2" : "single-card"
							}
							style={{
								backgroundColor:
									isToday && scheduleLeavesGen(singleData.teacher && singleData.teacher._id)
										? "rgb(48, 51, 107, 0.5)"
										: singleData.isTeacherJoined
										? "#2ecc7075"
										: singleData.demo
										? "#f1c40fb6"
										: singleData.isClassTemperarilyCancelled
										? "rgb(170, 170, 170)"
										: teacherIds?.includes(singleData.teacher && singleData.teacher._id)
										? "rgb(56, 103, 214, 0.5)"
										: "#ff757562",
								border:
									isToday && scheduleLeavesGen(singleData.teacher && singleData.teacher._id)
										? "2px solid #130f40"
										: singleData.isTeacherJoined
										? "2px solid #56AE69"
										: singleData.isClassTemperarilyCancelled
										? "#bdc3c7"
										: teacherIds?.includes(singleData.teacher && singleData.teacher._id)
										? "2px solid #3867d6"
										: "2px solid #d63031",
								overflow: "initial",
								cursor: "pointer",
							}}
						>
							<div className="new-old-customer">
								{singleData.students.some((student) => student.autoDemo) ? "N" : "O"}
							</div>

							<div className="new-old-customer2">{renderFlag(singleData?.students)}</div>

							{singleData?.students?.every((rowData) =>
								console.log(
									singleData?.teacher?.TeacherName,
									moment(rowData.paidTill).diff(moment(new Date()), "days") + 1,
									moment(rowData.paidTill).format("MMM DD, YYYY"),
									moment(rowData.paidTill).diff(moment(new Date()), "days") <= 0 + 1
								)
							)}
							{/* <div className="new-old-customer2">
								{singleData?.students?.some(
									(rowData) =>
										rowData.numberOfClassesBought <= 0 ||
										(rowData.autoDemo &&
											moment(rowData.paidTill).diff(moment(new Date()), "days") <= 0)
								) ? (
									<div
										style={{
											backgroundColor: "#e74c3c",
											borderRadius: "50%",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											height: 20,
											width: 20,
										}}
									>
										<Flag style={{color: "white", height: 15, width: 15}} />
									</div>
								) : (
									""
								)}
							</div> */}

							<div
								className="teacher-name"
								style={{
									fontSize: 12,
									width: "67%",
									marginTop: teacherIds?.includes(singleData.teacher && singleData.teacher._id)
										? 10
										: singleData.demo
										? 10
										: 0,
								}}
								onClick={() => {
									setDialogOpen((prev) => !prev)
									setDialogData(singleData)
								}}
							>
								{singleData.teacher && singleData.teacher.TeacherName}
							</div>

							<div
								className="students"
								style={{marginLeft: 3, marginBottom: 10, cursor: "pointer"}}
								onClick={() => {
									setDialogOpen((prev) => !prev)
									setDialogData(singleData)
								}}
							>
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
							<div className="bottom-left-buttons">
								<Tooltip title="Create New Zoom Link">
									<IconButton size="small" onClick={() => resetZoomLink(singleData._id)} edge="end">
										<LoopIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Join Zoom">
									<IconButton onClick={() => window.open(singleData.meetingLink)} size="small">
										<Video style={{height: 18, width: 18, color: "#0984e3"}} />
									</IconButton>
								</Tooltip>
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
													checked={
														schedulesAssignedToMe && schedulesAssignedToMe.includes(singleData._id)
													}
												/>
											</Tooltip>
										) : (
											""
										)}
									</>
								)}
							</div>

							{singleData.demo ? (
								<Tooltip
									title="Demo"
									style={{cursor: "pointer"}}
									onClick={() => {
										setDialogOpen((prev) => !prev)
										setDialogData(singleData)
									}}
								>
									<Chip
										label={
											teacherIds?.includes(singleData.teacher && singleData.teacher._id)
												? "Demo & Leave"
												: "Demo"
										}
										style={{
											position: "absolute",
											top: "-1%",
											transform: "translateX(-50%)",
											left: "50%",
											width: "100%",
											borderRadius: 20,
											height: 16,
											backgroundColor: "#d63031",
											color: "white",
										}}
									/>
								</Tooltip>
							) : teacherIds?.includes(singleData.teacher && singleData.teacher._id) ? (
								<Tooltip
									title="Entire day leave"
									style={{cursor: "pointer"}}
									onClick={() => {
										setDialogOpen((prev) => !prev)
										setDialogData(singleData)
									}}
								>
									<Chip
										label="Entire day leave"
										style={{
											position: "absolute",
											top: "-1%",
											transform: "translateX(-50%)",
											left: "50%",
											height: 16,
											width: "100%",
											borderRadius: 20,
											backgroundColor: "#3867d6",
											color: "white",
											border: "2px solid #3867d6",
										}}
									/>
								</Tooltip>
							) : scheduleLeavesGen(singleData.teacher && singleData.teacher._id) ? (
								<Tooltip
									title="Scheduled Leave"
									style={{cursor: "pointer"}}
									onClick={() => {
										setDialogOpen((prev) => !prev)
										setDialogData(singleData)
									}}
								>
									<Chip
										label="Scheduled leave"
										style={{
											position: "absolute",
											top: "-1%",
											transform: "translateX(-50%)",
											left: "50%",
											height: 40,
											width: "100%",
											borderRadius: 20,
											backgroundColor: "#130f40",
											color: "white",
											border: "2px solid #130f40",
										}}
									/>
								</Tooltip>
							) : (
								""
							)}
						</Card>
					) : (
						""
					)}
				</>
			))}
		</div>
	)
}

export default SingleRow
