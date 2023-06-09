import React, {useState, useEffect} from "react"
import {Button, Card} from "@material-ui/core"
import {Redirect, useParams} from "react-router-dom"
import {
	getScheduleAndDateAttendance,
	getStudentList,
	postStudentsAttendance,
} from "../../../Services/Services"
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline"
import CancelIcon from "@material-ui/icons/Cancel"
import AttachMoneyIcon from "@material-ui/icons/AttachMoney"
import MoneyOffIcon from "@material-ui/icons/MoneyOff"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import ToggleButton from "@material-ui/lab/ToggleButton"
import useWindowDimensions from "../../../Components/useWindowDimensions"
import useDocumentTitle from "../../../Components/useDocumentTitle"

const BooleanRadioBox = ({value, onChange, label}) => {
	const {width} = useWindowDimensions()

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				width: width > 700 ? "500px" : "90%",
				margin: "0 auto",
				padding: "3px 0",
				marginBottom: 3,
				flexDirection: width > 700 ? "row" : "column",
			}}
		>
			<Card
				style={{
					height: 47,
					marginTop: -10,
					marginRight: 20,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: width > 700 ? "110%" : "100%",
				}}
			>
				{label}
			</Card>
			<div style={{display: "flex"}}>
				<ToggleButtonGroup
					value={value}
					exclusive
					aria-label="text alignment"
					style={{marginBottom: 5}}
				>
					<ToggleButton
						onClick={() => onChange("present")}
						value="present"
						style={{
							backgroundColor: value === "present" ? "#2ecc71" : "#f39c12",
							color: "white",
							fontWeight: "bold",
							border: "0.1px solid #ecf0f1",
							marginTop: width > 700 ? -10 : 10,
							marginBottom: width > 700 ? -10 : 10,
						}}
						aria-label="left aligned"
					>
						<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
							<CheckCircleOutlineIcon style={{marginRight: 5, fontWeight: "bold"}} />{" "}
							<p style={{color: "white", fontSize: 10}}>Present</p>
						</div>
					</ToggleButton>
					<ToggleButton
						onClick={() => onChange("absent")}
						value="absent"
						aria-label="centered"
						style={{
							backgroundColor: value === "absent" ? "#2ecc71" : "#f39c12",
							color: "white",
							fontWeight: "bold",
							border: "0.1px solid #ecf0f1",
							marginTop: width > 700 ? -10 : 10,
							marginBottom: width > 700 ? -10 : 10,
						}}
					>
						<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
							<CancelIcon style={{marginRight: 5, fontWeight: "bold"}} />
							<p style={{color: "white", fontSize: 10}}> Absent</p>
						</div>
					</ToggleButton>
					<ToggleButton
						onClick={() => onChange("paid")}
						value="paid"
						aria-label="right aligned"
						style={{
							backgroundColor: value === "paid" ? "#2ecc71" : "#f39c12",
							color: "white",
							fontWeight: "bold",
							border: "0.1px solid #ecf0f1",
							marginTop: width > 700 ? -10 : 10,
							marginBottom: width > 700 ? -10 : 10,
						}}
					>
						<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
							<AttachMoneyIcon style={{marginRight: 5, fontWeight: "bold"}} />
							<p style={{color: "white", fontSize: 10}}> Paid</p>
						</div>
					</ToggleButton>
					<ToggleButton
						onClick={() => onChange("unpaid")}
						value="unpaid"
						aria-label="right aligned"
						style={{
							backgroundColor: value === "unpaid" ? "#2ecc71" : "#f39c12",
							color: "white",
							fontWeight: "bold",
							border: "0.1px solid #ecf0f1",
							marginTop: width > 700 ? -10 : 10,
							marginBottom: width > 700 ? -10 : 10,
						}}
					>
						<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
							<MoneyOffIcon style={{marginRight: 5, fontWeight: "bold"}} />{" "}
							<p style={{color: "white", fontSize: 10}}> Unpaid</p>
						</div>
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
		</div>
	)
}

const EditAttendance = () => {
	useDocumentTitle("Edit Attendance")

	const [studentNameLists, setStudentNameLists] = useState([])
	const [studentAttendance, setStudentAttendance] = useState([])
	const [redirect, setRedirect] = useState(false)
	const [absentees, setAbsentees] = useState([])
	const [requestedStudents, setRequestedStudents] = useState([])
	const [requestedPaidStudents, setRequestedPaidStudents] = useState([])
	const params = useParams()

	useEffect(() => {
		setAbsentees((prev) => {
			let tempAbsentees = []
			studentNameLists.forEach((student) => {
				if (
					!studentAttendance.includes(student._id) &&
					!requestedStudents.includes(student._id) &&
					!requestedPaidStudents.includes(student._id)
				) {
					tempAbsentees.push(student._id)
				}
			})
			return tempAbsentees
		})
	}, [studentAttendance, studentNameLists, requestedStudents, requestedPaidStudents])

	useEffect(() => {
		studentListNAttendance()
	}, [])

	const studentListNAttendance = async () => {
		const {data} = await getStudentList(params.scheduleId)
		setStudentNameLists(data.result.students)

		const res = await getScheduleAndDateAttendance(params.scheduleId, params.date)
		setStudentAttendance(res.data?.result?.customers ? res.data?.result?.customers : [])
		setRequestedStudents(
			res.data?.result?.requestedStudents ? res?.data?.result?.requestedStudents : []
		)
		setRequestedPaidStudents(
			res?.data?.result?.requestedPaidStudents ? res?.data?.result?.requestedPaidStudents : []
		)
	}

	const handleChange = (id) => {
		if (studentAttendance.includes(id)) {
			setStudentAttendance((prev) => {
				let tempAttendance = [...prev]
				let index = tempAttendance.indexOf(id)
				tempAttendance.splice(index, 1)
				return tempAttendance
			})
		} else {
			setStudentAttendance((prev) => [...prev, id])
		}
	}

	const postAttendance = async () => {
		try {
			const formData = {
				date: params.date,
				scheduleId: params.scheduleId,
				customers: studentAttendance,
				requestedStudents,
				requestedPaidStudents,
				absentees,
			}
			const data = await postStudentsAttendance(formData)
			if (data) {
				setRedirect(true)
			}
		} catch (error) {
			console.log(error)
		}
	}

	if (redirect) {
		return <Redirect to="/attendance/class" />
	}

	const removeId = (prev, id) => {
		let prevValues = [...prev]
		let index = prevValues.indexOf(id)
		if (index !== -1) {
			prevValues.splice(index, 1)
		}
		return prevValues
	}

	const changeIt = (name, id) => {
		if (name === "paid") {
			setRequestedPaidStudents((prev) => [...prev, id])
			setRequestedStudents((prev) => removeId(prev, id))
			setStudentAttendance((prev) => removeId(prev, id))
		} else if (name === "unpaid") {
			setRequestedStudents((prev) => [...prev, id])
			setRequestedPaidStudents((prev) => removeId(prev, id))
			setStudentAttendance((prev) => removeId(prev, id))
		} else if (name === "present") {
			setStudentAttendance((prev) => [...prev, id])
			setRequestedPaidStudents((prev) => removeId(prev, id))
			setRequestedStudents((prev) => removeId(prev, id))
		} else {
			setRequestedPaidStudents((prev) => removeId(prev, id))
			setRequestedStudents((prev) => removeId(prev, id))
			setStudentAttendance((prev) => removeId(prev, id))
		}
	}

	return (
		<div>
			<h2 style={{textAlign: "center", marginTop: "20px", marginBottom: "10px"}}>
				Edit Students Attendance
			</h2>
			<div style={{textAlign: "center"}}>
				<h2 style={{fontSize: "20px", marginBottom: 20}}>{params.date}</h2>

				{typeof studentNameLists === "object" &&
					studentNameLists.map((student) => (
						<BooleanRadioBox
							label={`${student.firstName} ${student.lastName}`}
							value={
								requestedStudents.includes(student._id)
									? "unpaid"
									: requestedPaidStudents.includes(student._id)
									? "paid"
									: studentAttendance.includes(student._id)
									? "present"
									: absentees.includes(student._id)
									? "absent"
									: ""
							}
							onChange={(name) => changeIt(name, student._id)}
						/>
					))}
				<Button
					style={{width: "140px", margin: "40px 0"}}
					variant="contained"
					color="primary"
					onClick={postAttendance}
				>
					Submit
				</Button>
			</div>
		</div>
	)
}

export default EditAttendance
