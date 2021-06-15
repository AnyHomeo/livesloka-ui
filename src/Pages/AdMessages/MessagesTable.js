import React, {useEffect, useState} from "react"
import {Editor} from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import {EditorState, convertToRaw} from "draft-js"
import draftToHtml from "draftjs-to-html"
import Fab from "@material-ui/core/Fab"
import "./style.css"
import Autocomplete from "@material-ui/lab/Autocomplete"
import {Button, Card, CardContent, Chip, Grid, TextField} from "@material-ui/core"
import Axios from "axios"
import {ChromePicker} from "react-color"
import Collapse from "@material-ui/core/Collapse"
import {addInField, deleteField, getData} from "../../Services/Services"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import DeleteIcon from "@material-ui/icons/Delete"
import {useConfirm} from "material-ui-confirm"

function MessagesTable() {
	const [message, setMessage] = useState(EditorState.createEmpty())
	const [allCustomers, setAllCustomers] = useState([])
	const [selectedBGColor, setSelectedBGColor] = useState("#eee")
	const [selectedCustomers, setSelectedCustomers] = useState([])
	const [showForm, setShowForm] = useState(false)
	const [isForAll, setIsForAll] = useState(true)
	const [allData, setAllData] = useState([])
	const [refresh, setRefresh] = useState(false)
	const confirm = useConfirm()

	useEffect(() => {
		Axios.get(`${process.env.REACT_APP_API_KEY}/all/admins`)
			.then((data) => {
				console.log(data.data.result)
				setAllCustomers(data.data.result)
			})
			.catch((err) => {
				console.log(err, err.response)
			})
	}, [])

	useEffect(() => {
		Axios.get(
			`${process.env.REACT_APP_API_KEY}/Admin/get/AdMessage?populate=adminIds&populateFields=userId`
		)
			.then((data) => {
				console.log(data)
				setAllData(data.data.result)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [refresh])

	const submitForm = () => {
		let formData = {
			background: selectedBGColor.hex,
			adminIds: selectedCustomers.map((customer) => customer._id),
			message: draftToHtml(convertToRaw(message.getCurrentContent())),
			isForAll,
		}
		addInField("Add AdMessage", formData)
			.then((data) => {
				setRefresh((prev) => !prev)
				setShowForm(false)
				setSelectedBGColor("#fff")
				setSelectedCustomers([])
				setIsForAll(true)
				setMessage(EditorState.createEmpty())
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const deleteMessage = (id) => {
		confirm({
			description: "Do you Really want to Delete!",
			confirmationText: "Yes! delete",
		})
			.then((data) => {
				deleteField("Delete AdMessage", id)
					.then((data) => {
						console.log(data)
						setRefresh((prev) => !prev)
					})
					.catch((err) => {
						console.log(err)
					})
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return (
		<div className="messages-table">
			<Button
				className="button-pos"
				variant="contained"
				color="primary"
				onClick={() => setShowForm((prev) => !prev)}
			>
				{showForm ? "Close" : "Add Message"}
			</Button>
			<Collapse in={showForm}>
				<div className="form-container">
					<FormControlLabel
						control={
							<Checkbox
								checked={isForAll}
								onChange={() => setIsForAll((prev) => !prev)}
								name="isForall"
							/>
						}
						label="Show message to All Customers"
					/>
					<Collapse in={!isForAll} style={{width: "100%"}}>
						<Autocomplete
							style={{
								maxWidth: 400,
								margin: "auto",
							}}
							options={allCustomers}
							getOptionLabel={(name) =>
								name.customerId && name.customerId.firstName
									? `${name.customerId.firstName}${
											name.customerId.email ? "(" + name.customerId.email + ")" : ""
									  }`
									: name.customerId && name.customerId.email
									? name.customerId.email
									: name.userId
							}
							onChange={(event, value) => {
								if (value) {
									setSelectedCustomers(value)
								}
							}}
							multiple
							renderInput={(params) => (
								<TextField {...params} label="Select Students" variant="outlined" margin="normal" />
							)}
						/>
					</Collapse>
					<div className="label">Select Background Color</div>
					<ChromePicker
						color={selectedBGColor}
						onChangeComplete={(color) => {
							console.log(color)
							setSelectedBGColor(color)
						}}
					/>
					<Grid container spacing={3}>
						<Grid item sm={12} md={6}>
							<div className="label">Type Message</div>
							<div className="editor-wrapper">
								<Editor
									editorState={message}
									onEditorStateChange={(e) => {
										setMessage(e)
									}}
								/>
							</div>
						</Grid>
						<Grid item sm={12} md={6}>
							<div>Preview</div>
							<div
								className="preview"
								style={{
									backgroundColor: selectedBGColor.hex,
								}}
								dangerouslySetInnerHTML={{
									__html: draftToHtml(convertToRaw(message.getCurrentContent())),
								}}
							></div>
						</Grid>
					</Grid>
					<Button
						style={{
							margin: "20px",
						}}
						color="primary"
						onClick={submitForm}
						variant="contained"
					>
						Submit
					</Button>
				</div>
			</Collapse>
			<Grid container>
				{allData.map((message) => (
					<Grid className="spacing" item xs={12} sm={6} md={4} lg={3}>
						<Card
							style={{
								height: "100%",
								paddingTop: "30px",
								position: "relative",
							}}
						>
							<Fab
								style={{backgroundColor: "#E83A59", color: "#fff"}}
								onClick={() => deleteMessage(message.id)}
								aria-label="delete"
								size="small"
								className="floating"
							>
								<DeleteIcon />
							</Fab>
							<CardContent>
								Students:
								<div className="students-chips">
									{message.isForAll ? (
										<Chip color="primary" size="small" label={"All"} />
									) : (
										message.adminIds.map((id) => (
											<Chip color="primary" size="small" label={id.userId.slice(0, 10) + "..."} />
										))
									)}
								</div>{" "}
								Message:
								<div className="message">
									<div
										style={{
											backgroundColor: message.background,
											padding: 10,
											borderRadius: 5,
										}}
										dangerouslySetInnerHTML={{
											__html: message.message,
										}}
									></div>
								</div>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</div>
	)
}

export default MessagesTable
