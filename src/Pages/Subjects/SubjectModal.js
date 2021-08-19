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

export default function SubjectModal({open, setOpen, paypalToken, getback}) {
	const handleClose = () => {
		setOpen(false)
	}

	const [name, setName] = useState("")

	const [description, setDescription] = useState("")

	const [image_url, setImage_url] = useState("")

	const [loading, setLoading] = useState(false)

	const [age, setAge] = React.useState("")

	const [subjectIds, setSubjectIds] = useState()

	const handleChange = (event) => {
		setAge(event.target.value)
	}

	useEffect(() => {
		getSubjectId()
	}, [])
	const createProduct = async () => {
		setLoading(true)

		let storageRef = firebase.storage().ref(`${image_url[0].type}/${image_url[0].name}`)
		await storageRef.put(image_url[0])
		let url = await storageRef.getDownloadURL()

		const formData = {
			name,
			description,
			image: url,
			subject: age,
		}

		try {
			const data = await Axios.post(
				`${process.env.REACT_APP_API_KEY}/subscriptions/create/product`,
				formData
			)

			if (data.status === 200) {
				handleClose()
				getback(201)
			}
		} catch (error) {}

		setLoading(false)
	}

	const getSubjectId = async () => {
		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/admin/get/Subject`)
			setSubjectIds(data?.data?.result)
		} catch (error) {}
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
					<div style={{display: "flex", flexDirection: "column", width: 500}}>
						<FormControl style={{margin: 5}} variant="outlined">
							<InputLabel id="demo-simple-select-outlined-label">Subject</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								value={age}
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
						/>

						<FormControl
							variant="outlined"
							style={{
								width: "100%",
							}}
						>
							<div
								style={{
									height: "150px",
									backgroundColor: "#F5F5F5",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "column",
									margin: 5,
								}}
							>
								{image_url && image_url.length > 0 === true ? (
									<img
										src={URL.createObjectURL(image_url[0])}
										alt=""
										style={{
											height: "100%",
											width: "100%",
											objectFit: "cover",
										}}
									/>
								) : (
									<>
										<IconButton variant="contained" component="label">
											<i
												style={{
													color: "#C4C4C4",
													fontSize: 30,
													marginBottom: 5,
												}}
												class="fa fa-camera"
											></i>
											<input
												multiple
												accept="image/x-png,image/jpeg"
												onChange={(e) => setImage_url(e.target.files)}
												type="file"
												hidden
											/>
										</IconButton>
										<p style={{color: "#C4C4C4", fontWeight: "bold"}}>Choose an Image</p>
									</>
								)}
							</div>
							<p
								style={{
									color: "red",
									marginBottom: 20,
									cursor: "pointer",
									marginTop: 20,
								}}
								onClick={() => setImage_url()}
							>
								<i className="fas fa-times-circle"></i> Delete Image
							</p>
						</FormControl>
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
