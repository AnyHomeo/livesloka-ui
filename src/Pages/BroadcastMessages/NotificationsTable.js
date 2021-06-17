import React, {useEffect, useState} from "react"
import MaterialTable from "material-table"
import {getAllNotifications} from "../../Services/Services"
import {ReactSVG} from "react-svg"
import {Chip} from "@material-ui/core"
import "./notificationTable.css"
import useWindowDimensions from "../../Components/useWindowDimensions"
import NotificationsTableRowOptions from "./NotificationsTableRowOptions"
import Button from "@material-ui/core/Button"
import {Link} from "react-router-dom"

function NotificationsTable() {
	const [data, setData] = useState([])
	const {height} = useWindowDimensions()

	useEffect(() => {
		getAllNotifications()
			.then((data) => {
				if (data.data.result) {
					let {result} = data.data
					setData(
						result.map((message) => {
							let {
								acknowledgedBy,
								admin,
								isForAll,
								usersCount,
								queryType,
								icon,
								background,
								agents,
								schedules,
								schedulesCount,
								users,
								teachers,
								message: text,
								title,
								_id,
							} = message
							let remainingStudentsCount = usersCount - users.length
							let customersDescription = isForAll ? (
								"All Customers"
							) : remainingStudentsCount === 0 ? (
								users.map((user) => (
									<Chip
										className="margin-2"
										size="small"
										key={user.username}
										label={user.username.slice(0, 15) + "..."}
									/>
								))
							) : (
								<>
									{users.map((user) => (
										<Chip
											className="margin-2"
											size="small"
											key={user.username}
											label={user.username.slice(0, 15) + "..."}
										/>
									))}
									and {remainingStudentsCount} Others Customers
								</>
							)
							let remainingSchedulesCount = schedulesCount - schedules.length
							let referenceObject = {
								agent: () => agents.map((agent) => agent.AgentName),
								classname: () => (
									<div>
										{schedules.map((schedule) => (
											<Chip
												size="small"
												key={schedule.className}
												color="primary"
												className="margin-2"
												label={schedule.className.slice(0, 15) + "..."}
											/>
										))}{" "}
										{remainingSchedulesCount === 0
											? ""
											: `and ${remainingSchedulesCount} Other Classes`}
									</div>
								),
								customers: () => "selected Customers",
								teacher: () =>
									teachers.map((teacher) => (
										<Chip label={teacher.TeacherName} size="small" className="margin-2" />
									)),
							}

							let referenceObjectOnlyText = {
								agent: () => agents.map((agent) => agent.AgentName),
								classname: () =>
									schedules.map((schedule) => schedule.className) +
									(remainingSchedulesCount === 0
										? ""
										: `and ${remainingSchedulesCount} Other Classes`),
								customers: () => "selected Customers",
								teacher: () => teachers.map((teacher) => teacher.TeacherName),
							}

							return {
								acknowledgedBy: acknowledgedBy.length + " Customers",
								agent: admin?.AgentName || "BOT",
								customersDescription,
								iconWithColor: icon + background,
								referedBy: referenceObject[queryType](),
								reference: referenceObjectOnlyText[queryType](),
								iconAndColor: (
									<ReactSVG
										className="color-with-icon"
										style={{background}}
										src={require(`./icons/${icon}.svg`)}
									/>
								),
								title,
								message: text,
								_id,
							}
						})
					)
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	return (
		<>
			<div>
				<Link to="/messages" style={{margin: 20}}>
					<Button
						style={{
							marginTop: 20,
						}}
						variant="contained"
						color="primary"
					>
						New Notification
					</Button>
				</Link>
			</div>
			<div className="notification-table">
				<MaterialTable
					data={data}
					title="Broadcasted Notifications"
					columns={[
						{
							title: "Options",
							render: (data) => <NotificationsTableRowOptions id={data._id} />,
						},
						{
							title: "Broadcasted By",
							field: "agent",
						},
						{
							title: "Title",
							field: "title",
						},
						{
							title: "Message",
							field: "message",
						},
						{
							title: "Customers",
							field: "customersDescription",
						},
						{
							title: "Reference",
							field: "reference",
							render: (data) => data.referedBy,
						},
						{
							title: "Icon/Color",
							field: "iconWithColor",
							align: "center",
							render: (data) => data.iconAndColor,
							width: "1px",
						},
						{
							title: "Acknowledged By",
							field: "acknowledgedBy",
						},
					]}
					style={{
						margin: 20,
						padding: 20,
					}}
					options={{
						maxBodyHeight: height - 220,
						exportButton: true,
					}}
				/>
			</div>
		</>
	)
}

export default NotificationsTable
