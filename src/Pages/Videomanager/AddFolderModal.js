import {Button, CircularProgress, Dialog, DialogContent, DialogTitle} from "@material-ui/core"
import React, {useEffect, useState} from "react"
import TextField from "@material-ui/core/TextField"
import Axios from "axios"
import {useSnackbar} from "notistack"

const AddFolderModal = ({open, setOpen, getBackData, updateFlag, updateId}) => {
	const {enqueueSnackbar} = useSnackbar()

	const [name, setName] = useState("")
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (updateFlag) {
			setName(updateId.name)
		} else {
			setName("")
		}
	}, [updateFlag])
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

	const updateFolder = async () => {
		setLoading(true)
		try {
			const data = await Axios.post(
				`${process.env.REACT_APP_API_KEY}/admin/update/VideoCategories`,
				{
					name,
					id: updateId.id,
				}
			)

			if (data.status === 200) {
				getBackData(true)
				setOpen(false)
				enqueueSnackbar(`Update Successfully`, {variant: "success"})
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
					value={name}
				/>
				<Button
					variant="contained"
					color="primary"
					style={{marginTop: 10}}
					onClick={updateFlag ? updateFolder : submitFolder}
				>
					{loading ? (
						<CircularProgress style={{height: 35, width: 35, color: "white"}} />
					) : updateFlag ? (
						"Update"
					) : (
						"Add"
					)}
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default AddFolderModal
