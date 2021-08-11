import React, {useState} from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import {CircularProgress, TextField} from "@material-ui/core"
import Axios from "axios"

export default function SubjectModal({open, setOpen, paypalToken, getback}) {
	const handleClose = () => {
		setOpen(false)
	}

	const [name, setName] = useState("")

	const [description, setDescription] = useState("")

	const [image_url, setImage_url] = useState("")

	const [loading, setLoading] = useState(false)
	const createProduct = async () => {
		setLoading(true)
		const formData = {
			name,
			description,
			type: "SERVICE",
			category: "EDUCATIONAL_AND_TEXTBOOKS",
			image_url,
			home_url: "https://livesloka.com/",
		}
		const config = {
			headers: {Authorization: `Bearer ${paypalToken}`, "Content-Type": "application/json"},
		}

		try {
			const data = await Axios.post(
				`${process.env.REACT_APP_PAYPAL_URL}/v1/catalogs/products`,
				formData,
				config
			)

			if (data.status === 201) {
				handleClose()
				getback(201)
			}
		} catch (error) {}

		setLoading(false)
	}

	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Add new subject"}</DialogTitle>
				<DialogContent>
					<div style={{display: "flex", flexDirection: "column", width: 500}}>
						<TextField
							onChange={(e) => setName(e.target.value)}
							style={{margin: 5}}
							label="Subject name"
							variant="outlined"
						/>
						<TextField
							onChange={(e) => setDescription(e.target.value)}
							style={{margin: 5}}
							label="Subject description"
							variant="outlined"
						/>
						<TextField
							onChange={(e) => setImage_url(e.target.value)}
							style={{margin: 5}}
							label="Image link"
							variant="outlined"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button disabled={loading} onClick={createProduct} color="primary" autoFocus>
						{loading ? <CircularProgress /> : "Submit"}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
