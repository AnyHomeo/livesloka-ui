import React, {useState, useEffect, useCallback} from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import {
	FormControl,
	MenuItem,
	TextField,
	Select,
	InputLabel,
	makeStyles,
	Box,
} from "@material-ui/core"
import {getData} from "../../Services/Services"
import {useSnackbar} from "notistack"
import {addSubscriptionProduct} from "../../Services/Services"

function AddProduct({openAddProductModal, setOpenAddProductModal, subjectIds, setRefresh}) {
	const [subjects, setSubjects] = useState([])
	const [selectedSubject, setSelectedSubject] = useState("")
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [loading, setLoading] = useState(false)
	const {enqueueSnackbar} = useSnackbar()
	const classes = useStyles()

	useEffect(() => {
		;(async () => {
			const data = await getData("Subject")
			let subjectsResponse = data?.data?.result || []
			subjectsResponse = subjectsResponse.filter((subject) => !subjectIds.includes(subject._id))
			setSubjects(subjectsResponse)
		})()
	}, [subjectIds])

	const handleSubjectChange = useCallback((e) => {
		setSelectedSubject(e.target.value)
	}, [])

	const createProduct = useCallback(() => {
		setLoading(true)
		if (!selectedSubject) {
			enqueueSnackbar("Subject is required", {
				variant: "warning",
			})
			setLoading(false)
			return
		}
		if (!name) {
			enqueueSnackbar("Name is required", {
				variant: "warning",
			})
			setLoading(false)
			return
		}
		if (!description) {
			enqueueSnackbar("Description is required", {
				variant: "warning",
			})
			setLoading(false)
			return
		}
		addSubscriptionProduct({
			name,
			description,
			subject: selectedSubject,
		})
			.then((data) => {
				setLoading(false)
				setInitialFormData()
				setRefresh((prev) => !prev)
				enqueueSnackbar(`${name} Created successfully!`, {
					variant: "success",
				})
			})
			.catch((err) => {
				setLoading(false)
				enqueueSnackbar(err?.response?.data?.error || "Something went wrong!", {
					variant: "errror",
				})
			})
	}, [enqueueSnackbar, name, selectedSubject, description, setRefresh])

	const setInitialFormData = () => {
		setName("")
		setDescription("")
		setSelectedSubject("")
	}

	return (
		<Dialog
			open={openAddProductModal}
			onClose={() => setOpenAddProductModal(false)}
			aria-labelledby="Add Product Dialog"
			aria-describedby="A dialog to add products"
		>
			<DialogTitle id="add-new-product">Add new subject</DialogTitle>
			<DialogContent>
				<Box className={classes.flexColumn}>
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel id="add-product-subject-label">Subject</InputLabel>
						<Select
							labelId="add-product-subject-label"
							id="add-product-subject"
							value={selectedSubject}
							onChange={handleSubjectChange}
							label="Subject"
						>
							{subjects.map((subject) => (
								<MenuItem key={subject._id} value={subject._id}>
									{subject.subjectName}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						value={name}
						onChange={(e) => setName(e.target.value)}
						label="Product name"
						variant="outlined"
						className={classes.formControl}
					/>
					<TextField
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className={classes.formControl}
						label="Product description"
						variant="outlined"
						rows={3}
						multiline
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button
					disabled={loading}
					onClick={createProduct}
					color="primary"
					variant="contained"
					autoFocus
					loading={loading}
				>
					submit
				</Button>
			</DialogActions>
		</Dialog>
	)
}

const useStyles = makeStyles(() => ({
	flexColumn: {
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		maxWidth: 400,
		minWidth: 300,
		gap: 20,
	},
	formControl: {
		width: "100%",
	},
}))

export default AddProduct
