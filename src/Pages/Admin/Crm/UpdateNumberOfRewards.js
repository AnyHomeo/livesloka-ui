import React from "react"
import {useState, useEffect} from "react"
import {getAllCustomers} from "../../../Services/Services"
import {Alert, Autocomplete} from "@material-ui/lab"
import {Button, TextField} from "@material-ui/core"
import {updateBoughtClasses} from "./../../../Services/Services"
import useDocumentTitle from "../../../Components/useDocumentTitle"
import Axios from "axios"
import {useParams} from "react-router-dom"
function UpdateNumberOfBoughtRewards(props) {
	useDocumentTitle("Add Rewards")
	const params = useParams()
	const [addReward, setAddReward] = useState()
	const [comment, setComment] = useState("")
	const [success, setSuccess] = useState(undefined)

	const updateBoughtClassesData = async () => {
		if (comment) {
			const formData = {
				email: params.id,
				rewards: parseInt(addReward),
				message: comment,
			}

			try {
				const data = await Axios.post(`${process.env.REACT_APP_API_KEY}/rewards/user`, formData)

				console.log(data)
				if (data.status === 200) {
					setComment("")
					setSuccess(true)
				}
			} catch (error) {
				console.log(error)
				setSuccess(false)
			}
		} else {
			setSuccess(null)
		}
	}

	return (
		<div
			style={{
				display: "grid",
				placeItems: "center",
			}}
		>
			<h1> Add Rewards </h1>
			{success !== undefined ? (
				<Alert severity={success ? "success" : "error"} style={{marginTop: "30px"}}>
					{success
						? "Update successful"
						: success === null
						? "Comment Required"
						: "Something went wrong, try again!"}
				</Alert>
			) : (
				""
			)}

			<TextField
				type="number"
				variant="outlined"
				style={{marginTop: 20, width: 300}}
				label="Add Reward"
				min={0}
				onChange={(e) => {
					e.persist()
					setAddReward(e.target.value)
					setSuccess(undefined)
				}}
			/>
			<TextField
				type="text"
				variant="outlined"
				style={{marginTop: 20, width: 300}}
				label="Comment"
				value={comment}
				onChange={(e) => {
					setSuccess(undefined)
					setComment(e.target.value)
				}}
				multiline
				rows={4}
			/>
			<Button
				style={{
					marginTop: "20px",
					width: "300px",
				}}
				variant="contained"
				color="primary"
				onClick={() => updateBoughtClassesData()}
			>
				Update
			</Button>
		</div>
	)
}

export default UpdateNumberOfBoughtRewards
