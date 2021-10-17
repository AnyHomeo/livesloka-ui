import React, {useState, useCallback, useEffect} from "react"
import {
	FormControl,
	TextField,
	InputLabel,
	Select,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	MenuItem,
} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import {createPlans, getData} from "./../../Services/Services"
import {useSnackbar} from "notistack"

const initialFormData = {
	name: "",
	description: "",
	amount: 0,
	interval: "month",
	intervalCount: 1,
	products: [],
}

export default function AddPlans({products, openAddPlanModal, setOpenAddPlanModal, setRefresh}) {
	const handleClose = () => {
		setOpenAddPlanModal(false)
	}
	const {enqueueSnackbar} = useSnackbar()
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState(initialFormData)
	const [currencies, setCurrencies] = useState([])

	const createPlan = () => {
		if (!Object.keys(formData).every((key) => !!formData[key])) {
			enqueueSnackbar("All fields are required", {
				variant: "warning",
			})
            return 
		}
		console.log(formData)
		setLoading(true)
		createPlans({
			...formData,
			products: products.map((product) => product._id),
		})
			.then((data) => {
				enqueueSnackbar(`${formData.name} Created successfully!`, {
					variant: "success",
				})
				setFormData(initialFormData)
				setLoading(false)
                setRefresh(prev => !prev)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const handleFormDataChange = useCallback((key, value) => {
		setFormData((prev) => ({...prev, [key]: value}))
	}, [])

	useEffect(() => {
		getData("Currency")
		.then(data => {
			setCurrencies(data.data.result)
		})
		.catch(err => {
			console.log(err)
		})
	}, [])

	return (
		<div>
			<Dialog
				open={openAddPlanModal}
				onClose={handleClose}
				aria-labelledby="Add Plans"
				aria-describedby="Add Plans"
			>
				<DialogTitle id="add-plans-title">Add Plans</DialogTitle>
				<DialogContent>
					<div style={{display: "flex", flexDirection: "column", width: 500, gap: 10}}>
						<Autocomplete
							multiple
							freeSolo
							disableClearable
							options={products}
							getOptionLabel={(option) => option.name}
							onChange={(e, v) => handleFormDataChange("products", v)}
							value={formData.products}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Select Products"
									margin="normal"
									variant="outlined"
									InputProps={{...params.InputProps, type: "search"}}
								/>
							)}
						/>
						<TextField
							onChange={(e) => handleFormDataChange("name", e.target.value)}
							label="Plan Name"
							variant="outlined"
							value={formData.name}
						/>
						<TextField
							onChange={(e) => handleFormDataChange("description", e.target.value)}
							label="Plan description"
							variant="outlined"
							value={formData.description}
							multiline
							rows={3}
						/>
						<FormControl fullWidth variant="outlined">
							<InputLabel id="interval-type-label">Interval Type</InputLabel>
							<Select
								labelId="interval-type-label"
								id="interval-type-select"
								value={formData.interval}
								label="Interval Type"
								variant="outlined"
								onChange={(e) => handleFormDataChange("interval", e.target.value)}
							>
								<MenuItem value="day">Day</MenuItem>
								<MenuItem value="week">Week</MenuItem>
								<MenuItem value="month">Month</MenuItem>
							</Select>
						</FormControl>
						<FormControl fullWidth variant="outlined">
							<InputLabel id="Currency-type-label">Currency</InputLabel>
							<Select
								labelId="Currency-type-label"
								id="Currency-type-select"
								value={formData.currency}
								label="Currency"
								variant="outlined"
								onChange={(e) => handleFormDataChange("currency", e.target.value)}
							>
								{
									currencies.map((currency) => (
										<MenuItem value={currency._id}>{currency.currencyName}</MenuItem>
									))
								}
							</Select>
						</FormControl>
						<TextField
							onChange={(e) => handleFormDataChange("intervalCount", e.target.value)}
							label="Interval Count"
							variant="outlined"
							value={formData.intervalCount}
						/>
						<TextField
							onChange={(e) => handleFormDataChange("amount", e.target.value)}
							label="Price"
							variant="outlined"
							value={formData.amount}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={loading}
						onClick={createPlan}
						color="primary"
						variant="contained"
						autoFocus
					>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
