import React from "react"
import {useState, useEffect} from "react"
import {getAllCustomers} from "../../../Services/Services"
import {Alert, Autocomplete} from "@material-ui/lab"
import {Button, TextField} from "@material-ui/core"
import {updateBoughtClasses} from "./../../../Services/Services"
import useDocumentTitle from "../../../Components/useDocumentTitle"
import {useParams} from "react-router-dom"

function UpdateNumberOfBoughtClasses() {
	useDocumentTitle("Classes Paid")
	const [selectedCustomer, setSelectedCustomer] = useState({})
	const [allCustomers, setAllCustomers] = useState([])
	const [comment, setComment] = useState("")
	const [success, setSuccess] = useState(undefined)
	const params = useParams()

	const updateBoughtClassesData = () => {
		if (comment) {
			updateBoughtClasses({...selectedCustomer, comment})
				.then((data) => {
					setSelectedCustomer({})
					setComment("")
					setSuccess(true)
					getAllCustomers("firstName,lastName,numberOfClassesBought")
						.then((data) => {
							setAllCustomers(data.data.result)
						})
						.catch((err) => {
							console.log(err)
						})
				})
				.catch((error) => {
					console.log(error)
					setSuccess(false)
				})
		} else {
			setSuccess(null)
		}
	}

	useEffect(() => {
		getAllCustomers("firstName,lastName,numberOfClassesBought")
			.then((data) => {
				setAllCustomers(data.data.result)
				if (params && params.id) {
					setSelectedCustomer(data.data.result.filter((student) => student._id === params.id)[0])
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	return (
		<div
			style={{
				display: "grid",
				placeItems: "center",
			}}
		>
			<h1> Update Classes Paid </h1>
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
			<Autocomplete
				id="Select-Customers"
				options={allCustomers}
				getOptionLabel={(option) =>
					`${option.firstName ? option.firstName : ""} ${option.lastName ? option.lastName : ""}`
				}
				style={{width: 300, marginTop: 30}}
				value={selectedCustomer}
				onChange={(e, value) => {
					setSuccess(undefined)
					setSelectedCustomer(value ? value : {})
				}}
				renderInput={(params) => (
					<TextField {...params} label="Select Customer" variant="outlined" />
				)}
			/>
			<TextField
				type="number"
				variant="outlined"
				style={{marginTop: 20, width: 300}}
				label="Classes Paid"
				value={selectedCustomer.numberOfClassesBought ? selectedCustomer.numberOfClassesBought : 0}
				onChange={(e) => {
					e.persist()
					setSuccess(undefined)
					setSelectedCustomer((prev) => ({
						...prev,
						numberOfClassesBought: e.target.value,
					}))
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
				disabled={!(selectedCustomer.numberOfClassesBought && comment)}
				variant="contained"
				color="primary"
				onClick={() => updateBoughtClassesData()}
			>
				Update
			</Button>
		</div>
	)
}

export default UpdateNumberOfBoughtClasses
