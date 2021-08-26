import React, {useState} from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import {CircularProgress, TextField} from "@material-ui/core"
import Axios from "axios"
import Chip from "@material-ui/core/Chip"
import Autocomplete from "@material-ui/lab/Autocomplete"
import {makeStyles} from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
	root: {
		width: 500,
		"& > * + *": {
			marginTop: theme.spacing(3),
		},
	},
}))

export default function AddPlans({open, setOpen, products, getback}) {
	const classes = useStyles()

	const handleClose = () => {
		setOpen(false)
	}

	const [productIds, setProductIds] = useState([])
	const [name, setName] = useState("")

	const [description, setDescription] = useState("")

	const [months, setMonths] = useState("")
	const [price, setPrice] = useState("")

	const [loading, setLoading] = useState(false)

	const handleProductId = (event, values) => {
		let ids = []
		values.map((item) => {
			ids.push(item.id)
		})
		setProductIds(ids)
	}

	const createProduct = async () => {
		setLoading(true)
		const formData = {
			productIds,
			name,
			description,
			months,
			price,
		}

		try {
			const data = await Axios.post(
				`${process.env.REACT_APP_API_KEY}/subscriptions/create/plan`,
				formData
			)
			if (data.status === 200) {
				handleClose()
				getback(200)
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
				<DialogTitle id="alert-dialog-title">{"Plans"}</DialogTitle>
				<DialogContent>
					<div style={{display: "flex", flexDirection: "column", width: 500}}>
						{products && (
							<Autocomplete
								multiple
								freeSolo
								disableClearable
								style={{margin: 5}}
								options={products}
								getOptionLabel={(option) => option.name}
								onChange={handleProductId}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Select Subjects"
										margin="normal"
										variant="outlined"
										InputProps={{...params.InputProps, type: "search"}}
									/>
								)}
							/>
						)}

						<TextField
							onChange={(e) => setName(e.target.value)}
							style={{margin: 5}}
							label="Plan name"
							variant="outlined"
						/>
						<TextField
							onChange={(e) => setDescription(e.target.value)}
							style={{margin: 5}}
							label="Plan description"
							variant="outlined"
						/>
						<TextField
							onChange={(e) => setMonths(e.target.value)}
							style={{margin: 5}}
							label="Time period"
							variant="outlined"
						/>
						<TextField
							onChange={(e) => setPrice(e.target.value)}
							style={{margin: 5}}
							label="Price"
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

const top100Films = [
	{title: "The Shawshank Redemption", year: 1994},
	{title: "The Godfather", year: 1972},
	{title: "The Godfather: Part II", year: 1974},
]
