import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Switch,
	FormControl,
	IconButton,
} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import TextField from "@material-ui/core/TextField"
import Axios from "axios"
import Autocomplete from "@material-ui/lab/Autocomplete"
import {firebase} from "../../Firebase"
import {useSnackbar} from "notistack"
import PdfLogo from "../../Images/pdflogo.png"
const AddCertificateModal = ({
	open,
	setOpen,
	getBackData,
	category,
	updateCertificateData,
	updateCertificateFlag,
}) => {
	const {enqueueSnackbar} = useSnackbar()

	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [isPublic, setIsPublic] = useState(false)
	const [studentId, setStudentId] = useState()
	const [studentsData, setStudentsData] = useState([])
	const [loading, setLoading] = useState(false)
	const [Certificate, setCertificate] = useState()
	const [certificateUrl, setCertificateUrl] = useState("")
	useEffect(() => {
		getStudents()
	}, [])
	useEffect(() => {
		if (updateCertificateData) {
			setName(updateCertificateData.name)
			setDescription(updateCertificateData.description)
			setIsPublic(updateCertificateData.isPublic)
			setStudentId(updateCertificateData.assignedTo)
			setCertificateUrl(updateCertificateData.image)
		} else {
			setName("")
			setDescription("")
			setIsPublic(true)
			setStudentId([])
			setCertificate()
		}
	}, [updateCertificateData])
	const getStudents = async () => {
		const studentNames = await Axios.get(`${process.env.REACT_APP_API_KEY}/all/admins`)

		setStudentsData(studentNames.data.result)
	}

	const submitFolder = async () => {
		setLoading(true)
		let assignedTo = []

		studentId &&
			studentId.map((data) => {
				assignedTo.push(data._id)
			})

		let image = ""
		let storageRef = firebase.storage().ref(`${Certificate[0].type}/${Certificate[0].name}`)
		await storageRef.put(Certificate[0])
		image = await storageRef.getDownloadURL()

		let formData = {
			name,
			url: "",
			description,
			isPublic,
			category,
			assignedTo,
			image,
		}
		try {
			const data = await Axios.post(`${process.env.REACT_APP_API_KEY}/admin/add/Videos`, formData)

			if (data.status === 200) {
				enqueueSnackbar(`Added Successfully`, {variant: "success"})
				getBackData(true)
				setOpen(false)

				setName("")
				setDescription("")
				setIsPublic(true)
				setStudentId([])
				setCertificate()
			}
		} catch (error) {
			console.log(error.response)
			enqueueSnackbar(error?.response?.data?.error, {variant: "error"})
		}
		setLoading(false)
	}

	const handleChange = (event) => {
		setIsPublic(event.target.checked)
	}

	const updateCertificate = async () => {
		setLoading(true)
		let assignedTo = []

		studentId &&
			studentId.map((data) => {
				assignedTo.push(data._id)
			})

		try {
			const data = await Axios.post(`${process.env.REACT_APP_API_KEY}/admin/update/Videos`, {
				name,
				url: "",
				description,
				isPublic,
				category,
				assignedTo,
				id: updateCertificateData.id,
				// image: Certificate,
			})

			if (data.status === 200) {
				setName("")
				setDescription("")
				setIsPublic(true)
				setStudentId([])
				setCertificate([])
				getBackData(true)
				setOpen(false)
				enqueueSnackbar(`Updated Successfully Successfully`, {variant: "success"})
			}
		} catch (error) {
			enqueueSnackbar("Something went wrong, Please try again", {variant: "error"})
		}
		setLoading(false)
	}
	return (
		<Dialog open={open} onClose={() => setOpen(false)}>
			<DialogTitle>{updateCertificateFlag ? "Update Certificate" : "Add Certiticate"}</DialogTitle>
			<DialogContent style={{display: "flex", flexDirection: "column", width: 400}}>
				<TextField
					onChange={(e) => setName(e.target.value)}
					label="Certificate Name"
					variant="outlined"
					style={{marginTop: 10}}
					value={name}
				/>

				<TextField
					onChange={(e) => setDescription(e.target.value)}
					label="Description"
					variant="outlined"
					style={{marginTop: 10}}
					value={description}
				/>
				<FormControlLabel
					label="Public"
					style={{marginTop: 10}}
					control={<Switch checked={isPublic} onChange={handleChange} color="primary" />}
				/>

				{isPublic ? null : (
					<Autocomplete
						value={studentId}
						multiple
						freeSolo
						getOptionLabel={(option) => `${option?.username} ${option.userId}`}
						// getOptionLabel={(option) => option.username + `(${option.userId})`}
						options={studentsData}
						onChange={(event, value) => {
							if (value) {
								setStudentId(value)
							}
						}}
						renderInput={(params) => (
							<TextField {...params} label="Customer" margin="normal" variant="outlined" />
						)}
					/>
				)}

				<FormControl
					variant="outlined"
					style={{
						width: "100%",
					}}
				>
					<div
						style={{
							height: "250px",
							backgroundColor: "#F5F5F5",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						{
							// eslint-disable-next-line
							updateCertificateFlag ? (
								<img
									src={certificateUrl}
									alt=""
									style={{
										height: "100%",
										width: "100%",
										objectFit: "cover",
									}}
								/>
							) : Certificate && Certificate.length > 0 === true ? (
								<img
									src={
										Certificate[0].type === "application/pdf"
											? PdfLogo
											: URL.createObjectURL(Certificate[0])
									}
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
										<input onChange={(e) => setCertificate(e.target.files)} type="file" hidden />
									</IconButton>
									<p style={{color: "#C4C4C4", fontWeight: "bold"}}>Choose Certificate</p>
								</>
							)
						}
					</div>
					<p
						style={{
							color: "red",
							marginBottom: 20,
							cursor: "pointer",
							marginTop: 20,
						}}
						onClick={() => setCertificate()}
					>
						<i className="fas fa-times-circle"></i> Delete Certificate
					</p>
				</FormControl>

				<Button
					color="primary"
					variant="contained"
					style={{marginTop: 10}}
					onClick={updateCertificateFlag ? updateCertificate : submitFolder}
				>
					{loading ? (
						<CircularProgress style={{height: 35, width: 35, color: "white"}} />
					) : updateCertificateFlag ? (
						"Update"
					) : (
						"Add"
					)}
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default AddCertificateModal
