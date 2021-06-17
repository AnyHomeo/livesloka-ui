import {Button, TextField} from "@material-ui/core"
import {Alert, Autocomplete} from "@material-ui/lab"
import Axios from "axios"
import React, {useEffect, useState} from "react"
import useDocumentTitle from "../../../Components/useDocumentTitle"

function UserPasswordReset() {
	useDocumentTitle("Password Reset")

	const [studentsData, setStudentsData] = useState([])
	const [studentId, setStudentId] = useState("")
	const [response, setResponse] = useState("")
	const [success, setSuccess] = useState(false)

	// Get Students
	const getStudents = async () => {
		const studentNames = await Axios.get(`${process.env.REACT_APP_API_KEY}/all/admins`)
		setStudentsData(studentNames.data.result)
	}

	console.log(studentId)
	const resetPassword = () => {
		Axios.get(`${process.env.REACT_APP_API_KEY}/admin/reset/${studentId}`)
			.then((data) => {
				setSuccess(true)
				setResponse("Password Updated Successfully")
			})
			.catch((err) => {
				setSuccess(false)
				setResponse("Problem in Password reset,Try again")
			})
	}

	useEffect(() => {
		getStudents()
	}, [])

	return (
		<>
			<h1 style={{textAlign: "center"}}> Reset User Password </h1>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
				}}
			>
				{response && (
					<Alert
						variant="filled"
						style={{width: "40%", margin: "0 auto"}}
						severity={success ? "success" : "error"}
					>
						{response}
					</Alert>
				)}
				<Autocomplete
					style={{width: "60%", margin: "0 auto"}}
					options={studentsData}
					getOptionLabel={(name) =>
						name.customerId && name.customerId.firstName
							? `${name.customerId.firstName}${
									name.customerId.email ? "(" + name.customerId.email + ")" : ""
							  }`
							: name.customerId && name.customerId.email
							? name.customerId.email
							: name.userId
					}
					onChange={(event, value) => {
						if (value) {
							setResponse("")
							setStudentId(value._id)
						}
					}}
					renderInput={(params) => (
						<TextField {...params} label="Select Student" variant="outlined" margin="normal" />
					)}
				/>
				<Button
					variant="contained"
					onClick={resetPassword}
					color="primary"
					style={{marginTop: "50px"}}
				>
					Reset Password
				</Button>
			</div>
		</>
	)
}

export default UserPasswordReset
