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
import {Drawer, IconButton, makeStyles, Snackbar} from "@material-ui/core"
import MuiAlert from "@material-ui/lab/Alert"
import {Link} from "react-router-dom"
import {Alert} from "@material-ui/lab"
import Axios from "axios"
import {useConfirm} from "material-ui-confirm"
import {Activity} from "react-feather"
import Comments from "./Comments"
const useStyles = makeStyles((theme) => ({
	iconCont: {
		display: "flex",
		alignItems: "center",
		cursor: "pointer",
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
	const [modalOpen, setModalOpen] = useState(false)
	const [selectedCommentsCustomerId, setSelectedCommentsCustomerId] = useState("")

	const handleClose = () => {
		setOpen(false)
	}

	const handleAlert = (event, reason) => {
		if (reason === "clickaway") {
			return
		}
		setModalOpen(false)
	}

	const handleDelete = () => {
		confirm({description: `This will reset password for ${data.firstName}.`})
			.then(() => {
				Axios.get(`${process.env.REACT_APP_API_KEY}/admin/reset/${data.email}?isEmail=1`)
					.then((data) => {
						setModalOpen(true)
						setSuccess(true)
						setResponse("Password Updated Successfully")
					})
					.catch((err) => {
						setModalOpen(true)
						setSuccess(false)
						setResponse("Problem in Password reset,Try again")
					})
			})
			.catch(() => console.log("Deletion cancelled."))
	}

	function Alert(props) {
		return <MuiAlert elevation={6} variant="filled" {...props} />
	}

	const [drawerState, setDrawerState] = useState({
		left: false,
	})

	const toggleDrawer = (anchor, open) => (event) => {
		setDrawerState({...drawerState, [anchor]: open})
	}

	return (
		<div>
			<Drawer anchor={"left"} open={drawerState["left"]} onClose={toggleDrawer("left", false)}>
				<Comments
					commentsCustomerId={selectedCommentsCustomerId}
					drawerState={drawerState}
					setDrawerState={setDrawerState}
				/>
			</Drawer>

			{open && (
				<Snackbar open={modalOpen} autoHideDuration={1000} onClose={() => handleAlert()}>
					<Alert onClose={() => handleAlert()} severity={success ? "success" : "warning"}>
						{response}
					</Alert>
				</Snackbar>
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
							<div className={classes.iconCont} onClick={handleDelete}>
								<IconButton>
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
							<Link to={`/subscription-data/${data?._id}`}>
								<div className={classes.iconCont}>
									<IconButton>
										<Activity />
									</IconButton>
									<p style={{color: "#546e7a"}}>Subscriptions</p>
								</div>
							</Link>

							<div
								className={classes.iconCont}
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
								<IconButton>
									<LibraryAddIcon />
								</IconButton>
								<p>Duplicate User</p>
							</div>
							<div
								className={classes.iconCont}
								onClick={() => {
									setSelectedCommentsCustomerId(data._id)
									setDrawerState({...drawerState, left: true})
								}}
							>
								<IconButton>
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
