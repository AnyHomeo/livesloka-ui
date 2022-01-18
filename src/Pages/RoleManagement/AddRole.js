import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import {Checkbox, FormControlLabel, TextField} from "@material-ui/core"

export default function AddRole({open, setOpen}) {
	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{"Add Role"}</DialogTitle>
				<DialogContent>
					<div style={{display: "flex", flexDirection: "column"}}>
						<TextField style={{marginTop: 10}} label="Role ID" variant="outlined" />
						<TextField style={{marginTop: 10}} label="Role Name" variant="outlined" />

						<FormControlLabel
							control={<Checkbox color="primary" name="checkedA" />}
							label="Customers Data"
						/>
						<FormControlLabel
							control={<Checkbox color="primary" name="checkedA" />}
							label="Statistics"
						/>
						<FormControlLabel
							control={<Checkbox color="primary" name="checkedA" />}
							label="Financial Dashboard"
						/>
						<FormControlLabel
							control={<Checkbox color="primary" name="checkedA" />}
							label="Invoice"
						/>
						<FormControlLabel
							control={<Checkbox color="primary" name="checkedA" />}
							label="Analytics"
						/>
						<FormControlLabel control={<Checkbox color="primary" name="checkedA" />} label="Chat" />
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleClose} color="primary" autoFocus>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
