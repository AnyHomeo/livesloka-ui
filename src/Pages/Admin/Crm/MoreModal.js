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
import {IconButton} from "@material-ui/core"
import {Alert} from "@material-ui/lab"
import Axios from "axios"
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
	const [response, setResponse] = useState("")
	const [success, setSuccess] = useState(false)
	const handleClose = () => {
		setOpen(false)
	}

	const resetPassword = () => {
		Axios.get(`${process.env.REACT_APP_API_KEY}/admin/reset/${data._id}`)
			.then((data) => {
				setSuccess(true)
				setResponse("Password Updated Successfully")
			})
			.catch((err) => {
				setSuccess(false)
				setResponse("Problem in Password reset,Try again")
			})
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
					<DialogContentText id="alert-dialog-description">
						<IconButton onClick={resetPassword}>
							<LockIcon />
						</IconButton>
						<IconButton>
							<EditIcon />
						</IconButton>
						<IconButton>
							<DeleteIcon />
						</IconButton>
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
						<IconButton
							onClick={() => {
								commentModalOpen(true)
								setNameComment(data.firstName)
								setIdComment(data._id)
							}}
						>
							<SmsIcon />
						</IconButton>
					</DialogContentText>
				</DialogContent>
				<DialogActions></DialogActions>
			</Dialog>
		</div>
	)
}

export default MoreModal
