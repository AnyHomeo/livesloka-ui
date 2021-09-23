import {Button, CircularProgress, Dialog, DialogContent, DialogTitle} from "@material-ui/core"
import React, {useState} from "react"
import TextField from "@material-ui/core/TextField"
import Axios from "axios"
import {useSnackbar} from "notistack"

const AddFolderModal = ({open, setOpen, getBackData}) => {
	const {enqueueSnackbar} = useSnackbar()

	const [name, setName] = useState("")
	const [loading, setLoading] = useState(false)
	const submitFolder = async () => {
		setLoading(true)
		try {
			const data = await Axios.post(`${process.env.REACT_APP_API_KEY}/admin/add/VideoCategories`, {
				name,
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
	return (
		<Dialog open={open} onClose={() => setOpen(false)}>
			<DialogTitle>{"Add New Folder"}</DialogTitle>
			<DialogContent style={{display: "flex", flexDirection: "column"}}>
				<TextField
					onChange={(e) => setName(e.target.value)}
					label="Folder Name"
					variant="outlined"
				/>
				<Button variant="contained" color="primary" style={{marginTop: 10}} onClick={submitFolder}>
					{loading ? <CircularProgress style={{height: 35, width: 35, color: "white"}} /> : "Add"}
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default AddFolderModal
