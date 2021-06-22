import React, {useState} from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import LockIcon from "@material-ui/icons/Lock"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import LibraryAddIcon from "@material-ui/icons/LibraryAdd"
import SmsIcon from "@material-ui/icons/Sms"
import {IconButton, makeStyles} from "@material-ui/core"
import {Alert} from "@material-ui/lab"
import Axios from "axios"
import {useConfirm} from "material-ui-confirm"
const useStyles = makeStyles((theme) => ({
	iconCont: {
		display: "flex",
		alignItems: "center",
	},
}))
const MoreModal = ({
	open,
	setOpen,
	data,
	commentModalOpen,
	setNameComment,
	setIdComment,
	materialTableRef,
	setInitialFormData,
}) => {
	const confirm = useConfirm()

	const classes = useStyles()
	const [response, setResponse] = useState("")
	const [success, setSuccess] = useState(false)
	const handleClose = () => {
		setOpen(false)
	}

	const handleDelete = () => {
		confirm({description: `This will reset password for ${data.firstName}.`})
			.then(() => {
				Axios.get(`${process.env.REACT_APP_API_KEY}/admin/reset/${data._id}`)
					.then((data) => {
						setSuccess(true)
						setResponse("Password Updated Successfully")
					})
					.catch((err) => {
						setSuccess(false)
						setResponse("Problem in Password reset,Try again")
					})
			})
			.catch(() => console.log("Deletion cancelled."))
	}

	return (
		<div>
			{response && (
				<Alert
					variant="filled"
					style={{width: "40%", margin: "0 auto"}}
					severity={success ? "success" : "error"}
				>
					{response}
				</Alert>
			)}

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle>
					<p style={{fontSize: 18, fontWeight: "bold", textAlign: "center"}}>More Options</p>
				</DialogTitle>
				<DialogContent>
					<DialogContentText
						id="alert-dialog-description"
						style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}
					>
						<div
							style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}
						>
							<div className={classes.iconCont}>
								<IconButton onClick={handleDelete}>
									<LockIcon />
								</IconButton>
								<p>Password Reset</p>
							</div>
							<div className={classes.iconCont}>
								<IconButton>
									<EditIcon />
								</IconButton>
								<p>Edit</p>
							</div>
							<div className={classes.iconCont}>
								<IconButton>
									<DeleteIcon />
								</IconButton>
								<p>Delete</p>
							</div>
							<div className={classes.iconCont}>
								<IconButton
									onClick={() => {
										const materialTable = materialTableRef.current

										setInitialFormData({
											...data,
											_id: undefined,
											subjectId: undefined,
											requestedSubjects: undefined,
											numberOfClassesBought: undefined,
											classStatusId: undefined,
											createdAt: undefined,
											teacherId: undefined,
											className: undefined,
											proposedAmount: undefined,
										})

										materialTable.dataManager.changeRowEditing()
										materialTable.setState({
											...materialTable.dataManager.getRenderState(),
											showAddRow: true,
										})

										setOpen(false)
									}}
								>
									<LibraryAddIcon />
								</IconButton>
								<p>Duplicate User</p>
							</div>
							<div className={classes.iconCont}>
								<IconButton
									onClick={() => {
										commentModalOpen(true)
										setNameComment(data.firstName)
										setIdComment(data._id)
									}}
								>
									<SmsIcon />
								</IconButton>
								<p>Comment</p>
							</div>
						</div>

						<div></div>
					</DialogContentText>
				</DialogContent>
				<DialogActions></DialogActions>
			</Dialog>
		</div>
	)
}

export default MoreModal
