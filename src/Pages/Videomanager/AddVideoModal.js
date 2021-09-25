import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Switch,
} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import TextField from "@material-ui/core/TextField"
import Axios from "axios"
import Autocomplete from "@material-ui/lab/Autocomplete"
import {useSnackbar} from "notistack"

const AddVideoModal = ({
	open,
	setOpen,
	getBackData,
	category,
	updateVideoData,
	updateVidoeFlag,
}) => {
	const {enqueueSnackbar} = useSnackbar()

	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [url, setUrl] = useState("")
	const [isPublic, setIsPublic] = useState(false)
	const [studentId, setStudentId] = useState()
	const [studentsData, setStudentsData] = useState([])
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		getStudents()
	}, [])

	useEffect(() => {
		if (updateVidoeFlag) {
			// console.log(updateVideoData)
			setName(updateVideoData.name)
			setDescription(updateVideoData.description)
			setUrl(updateVideoData.url)
			setIsPublic(updateVideoData.isPublic)
			setStudentId(updateVideoData.assignedTo)
		} else {
			setName("")
			setDescription("")
			setUrl("")
			setIsPublic(true)
			setStudentId([])
		}
	}, [updateVidoeFlag])

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

		try {
			const data = await Axios.post(`${process.env.REACT_APP_API_KEY}/admin/add/Videos`, {
				name,
				url,
				description,
				isPublic,
				category,
				assignedTo,
			})

			if (data.status === 200) {
				getBackData(true)
				setOpen(false)
				enqueueSnackbar(`Added Successfully`, {variant: "success"})
			}
		} catch (error) {
			enqueueSnackbar("Something went wrong, Please try again", {variant: "error"})
		}
		setLoading(false)
	}

	const updateVideo = async () => {
		setLoading(true)
		let assignedTo = []

		studentId &&
			studentId.map((data) => {
				assignedTo.push(data._id)
			})

		try {
			const data = await Axios.post(`${process.env.REACT_APP_API_KEY}/admin/update/Videos`, {
				name,
				url,
				description,
				isPublic,
				category,
				assignedTo,
				id: updateVideoData.id,
			})

			if (data.status === 200) {
				getBackData(true)
				setOpen(false)
				enqueueSnackbar(`Updated Successfully Successfully`, {variant: "success"})
			}
		} catch (error) {
			enqueueSnackbar("Something went wrong, Please try again", {variant: "error"})
		}
		setLoading(false)
	}

	const handleChange = (event) => {
		setIsPublic(event.target.checked)
	}
	return (
		<Dialog open={open} onClose={() => setOpen(false)}>
			<DialogTitle>{"Add New Video"}</DialogTitle>
			<DialogContent style={{display: "flex", flexDirection: "column", width: 400}}>
				<TextField
					onChange={(e) => setName(e.target.value)}
					label="Video Name"
					variant="outlined"
					style={{marginTop: 10}}
					value={name}
				/>
				<TextField
					onChange={(e) => setUrl(e.target.value)}
					label="Video Link"
					variant="outlined"
					style={{marginTop: 10}}
					value={url}
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
						getOptionLabel={(option) => option.username + `(${option.userId})`}
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

				<Button
					variant="contained"
					color="primary"
					style={{marginTop: 10}}
					onClick={updateVidoeFlag ? updateVideo : submitFolder}
				>
					{loading ? (
						<CircularProgress style={{height: 35, width: 35, color: "white"}} />
					) : updateVidoeFlag ? (
						"Update"
					) : (
						"Add"
					)}
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default AddVideoModal
