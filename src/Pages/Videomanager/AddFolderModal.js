import {Button, Dialog, DialogContent, DialogTitle} from "@material-ui/core"
import React, {useState} from "react"
import TextField from "@material-ui/core/TextField"
import Axios from "axios"
const AddFolderModal = ({open, setOpen, getBackData}) => {
	const [name, setName] = useState("")
	const submitFolder = async () => {
		try {
			const data = await Axios.post(`${process.env.REACT_APP_API_KEY}/admin/add/VideoCategories`, {
				name,
			})

			if (data.status === 200) {
				getBackData(true)
				setOpen(false)
			}
		} catch (error) {}
	}
	return (
		<Dialog open={open} onClose={() => setOpen(false)}>
			<DialogTitle>{"Add New Folder"}</DialogTitle>
			<DialogContent style={{display: "flex", flexDirection: "column"}}>
				<TextField
					onChange={(e) => setName(e.target.value)}
					label="Folder Name"
					variant="outlined"
				/>
				<Button variant="contained" style={{marginTop: 10}} onClick={submitFolder}>
					Add
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default AddFolderModal
