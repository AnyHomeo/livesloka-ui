import React, {useState, useEffect} from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import {firebase} from "../../Firebase"

import {
	CircularProgress,
	FormControl,
	MenuItem,
	TextField,
	Select,
	InputLabel,
	IconButton,
} from "@material-ui/core"
import Axios from "axios"
import {createPaypalAndStripeProducts} from "./../../Services/Services"

export default function SubjectModal({open, setOpen, setRefresh, setMessage}) {
	const handleClose = () => {
		setOpen(false)
	}

	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [image_url, setImage_url] = useState("")
	const [loading, setLoading] = useState(false)
	const [subject, setSubject] = React.useState("")
	const [subjectIds, setSubjectIds] = useState()
	const handleChange = (event) => {
		setSubject(event.target.value)
	}

	useEffect(() => {
		getSubjectId()
	}, [])

	const createProduct = async () => {
		setLoading(true)
		if (!name) {
			setMessage({
				isShown: true,
				message: "Name is required",
				type: "warning",
			})
			setLoading(false)
			return
		}
		const formData = {
			name,
			description,
			subject,
		}
		try {
			const data = await createPaypalAndStripeProducts(formData)
			if (data.status === 200) {
				handleClose()
				setRefresh((prev) => !prev)
			}
		} catch (error) {
			console.log(error)
		}
		setLoading(false)
	}

	const getSubjectId = async () => {
		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/admin/get/Subject`)
			let subjectsResponse = data?.data?.result || []
			subjectsResponse = subjectsResponse.filter((subject) => !subject.productId)
			setSubjectIds(subjectsResponse)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Add new subject"}</DialogTitle>
				<DialogContent>
					<div style={{display: "flex", flexDirection: "column", width: 300}}>
						<FormControl style={{margin: 5}} variant="outlined">
							<InputLabel id="demo-simple-select-outlined-label">Subject</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								value={subject}
								onChange={handleChange}
								label="Subject"
							>
								{subjectIds &&
									subjectIds.map((item) => (
										<MenuItem key={item._id} value={item.id}>
											{item.subjectName}
										</MenuItem>
									))}
							</Select>
						</FormControl>

						<TextField
							onChange={(e) => setName(e.target.value)}
							style={{margin: 5}}
							label="Subject name"
							variant="outlined"
						/>
						<TextField
							onChange={(e) => setDescription(e.target.value)}
							style={{margin: 5}}
							label="Subject description"
							variant="outlined"
							multiline
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button disabled={loading} onClick={createProduct} color="primary" autoFocus>
						{loading ? <CircularProgress /> : "Submit"}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
