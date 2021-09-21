import {
	Button,
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

const AddVideoModal = ({open, setOpen, getBackData, category}) => {
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [url, setUrl] = useState("")
	const [isPublic, setIsPublic] = useState(false)
	const [studentId, setStudentId] = useState()
	const [studentsData, setStudentsData] = useState([])

	useEffect(() => {
		getStudents()
	}, [])

	const getStudents = async () => {
		const studentNames = await Axios.get(`${process.env.REACT_APP_API_KEY}/all/admins`)
		setStudentsData(studentNames.data.result)
	}

	const submitFolder = async () => {
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
			}
		} catch (error) {}
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
				/>
				<TextField
					onChange={(e) => setUrl(e.target.value)}
					label="Video Link"
					variant="outlined"
					style={{marginTop: 10}}
				/>
				<TextField
					onChange={(e) => setDescription(e.target.value)}
					label="Description"
					variant="outlined"
					style={{marginTop: 10}}
				/>
				<FormControlLabel
					label="Public"
					style={{marginTop: 10}}
					control={<Switch checked={isPublic} onChange={handleChange} color="primary" />}
				/>

				{isPublic ? null : (
					<Autocomplete
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

				<Button variant="contained" style={{marginTop: 10}} onClick={submitFolder}>
					Add
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default AddVideoModal
