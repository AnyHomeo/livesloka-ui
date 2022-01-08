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
	Switch,
	FormControlLabel,
	InputAdornment,
	ListItemText,
} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import {createPlans, getAPlan, getData, updatePlan} from "./../../Services/Services"
import {useSnackbar} from "notistack"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import Fab from "@material-ui/core/Fab"
import {Add} from "@material-ui/icons"
import ListItem from "@material-ui/core/ListItem"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItemIcon from "@material-ui/core/ListItemIcon"

const initialFormData = {
	name: "",
	description: "",
	amount: 0,
	interval: "month",
	intervalCount: 1,
	products: [],
	isSubscription: false,
	list: [],
	currency: "",
}

export default function AddPlans({
	products,
	openAddPlanModal,
	setOpenAddPlanModal,
	setRefresh,
	editingId,
	setEditingId,
}) {
	const {enqueueSnackbar} = useSnackbar()
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState(initialFormData)
	const [currencies, setCurrencies] = useState([])
	const [listItem, setListItem] = useState("")
	const [initialListItem, setInitialListItem] = useState("")

	const handleClose = () => {
		setOpenAddPlanModal(false)
		setEditingId()
		setFormData(initialFormData)
	}

	const createOrUpdatePlan = () => {
		setLoading(true)
		if (editingId) {
			updatePlan(
				{
					...formData,
					amount: formData.amount * formData.intervalCount,
				},
				editingId
			)
				.then(() => {
					enqueueSnackbar(`${formData.name} Updated successfully!`, {
						variant: "success",
					})
					setFormData(initialFormData)
					setLoading(false)
					setRefresh((prev) => !prev)
				})
				.catch((err) => {
					console.log(err)
				})
		} else {
			if (
				!Object.keys(formData).every((key) => {
					return !!formData[key] || key === "isSubscription"
				})
			) {
				enqueueSnackbar("All fields are required", {
					variant: "warning",
				})
				setLoading(false)
				return
			}
			createPlans({
				...formData,
				amount: formData.amount * formData.intervalCount,
				products: formData.products.map((product) => product._id),
			})
				.then(() => {
					enqueueSnackbar(`${formData.name} Created successfully!`, {
						variant: "success",
					})
					setFormData(initialFormData)
					setLoading(false)
					setRefresh((prev) => !prev)
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}

	const addOrUpdateList = () => {
		if (initialListItem) {
			setFormData((prev) => {
				let {list} = prev
				let index = list.indexOf(initialListItem)
				list[index] = listItem
				return prev
			})
		} else {
			setFormData((prev) => ({...prev, list: [listItem, ...prev.list]}))
		}
		setInitialListItem("")
		setListItem("")
	}

	const handleFormDataChange = useCallback((key, value) => {
		setFormData((prev) => ({...prev, [key]: value}))
	}, [])

	useEffect(() => {
		getData("Currency")
			.then((data) => {
				setCurrencies(data.data.result)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	useEffect(() => {
		if (editingId) {
			getAPlan(editingId)
				.then((data) => {
					const {intervalCount, amount, currency, list} = data.data.result
					console.log(currency)
					setFormData((prev) => ({
						...data.data.result,
						amount: amount / intervalCount,
						currency: currency._id,
						list: list || []
					}))
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}, [editingId])

	const deleteListItem = (listItem) => {
		if (listItem && formData.list.includes(listItem)) {
			setFormData((prev) => {
				let prevData = {...prev}
				let index = prev.list.indexOf(listItem)
				prevData.list.splice(index, 1)
				return prevData
			})
		}
	}

	return (
		<div>
			<Dialog
				open={openAddPlanModal}
				onClose={handleClose}
				aria-labelledby="Add Plans"
				aria-describedby="Add Plans"
			>
				<DialogTitle id="add-plans-title">{"Add"} Plans</DialogTitle>
				<DialogContent>
					<div style={{display: "flex", flexDirection: "column", width: 500, gap: 10}}>
						{!editingId && (
							<Autocomplete
								multiple
								freeSolo
								disableClearable
								disabled={!!editingId}
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
						)}
						{!editingId && (
							<FormControlLabel
								control={
									<Switch
										checked={formData.isSubscription}
										onChange={() =>
											setFormData((prev) => ({...prev, isSubscription: !prev.isSubscription}))
										}
									/>
								}
								label="Subscription"
							/>
						)}

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
								value={`${formData.interval}-${formData.intervalCount}`}
								label="Interval Type"
								variant="outlined"
								onChange={(e) => {
									const [interval, intervalCount] = e.target.value.split("-")
									handleFormDataChange("interval", interval)
									handleFormDataChange("intervalCount", parseInt(intervalCount))
								}}
							>
								<MenuItem value={"month-1"}>One Month</MenuItem>
								<MenuItem value={"month-2"}>Two Month</MenuItem>
								<MenuItem value={"month-3"}>Quarterly</MenuItem>
								<MenuItem value={"month-6"}>Half Yearly</MenuItem>
								<MenuItem value={"month-12"}>Annual</MenuItem>
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
								{currencies.map((currency) => (
									<MenuItem value={currency._id}>{currency.currencyName}</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							onChange={(e) => handleFormDataChange("amount", e.target.value)}
							label="Enter Single Month Price"
							variant="outlined"
							disabled={formData.isSubscription && editingId}
							value={formData.amount}
						/>
						<FormControl variant="outlined">
							<InputLabel htmlFor="list-item">Add Description List Item</InputLabel>
							<OutlinedInput
								id="list-item"
								label="Add Description List Item"
								value={listItem}
								onChange={(e) => setListItem(e.target.value)}
								fullWidth
								onKeyUp={(e) => {
									if (e.key === "Enter") {
										e.preventDefault()
										addOrUpdateList()
									}
								}}
								endAdornment={
									<InputAdornment position="end">
										<Fab size="small" onClick={() => addOrUpdateList()} edge="end">
											<Add />
										</Fab>
									</InputAdornment>
								}
								labelWidth={70}
							/>
						</FormControl>
						<List dense>
							{ formData.list && formData.list.map((item) => (
								<ListItem key={item}>
									<ListItemText primary={item} />
									<ListItemIcon>
										<IconButton
											onClick={() => {
												setInitialListItem(item)
												setListItem(item)
											}}
										>
											<EditIcon />
										</IconButton>
									</ListItemIcon>
									<ListItemIcon>
										<IconButton onClick={() => deleteListItem(item)}>
											<DeleteIcon />
										</IconButton>
									</ListItemIcon>
								</ListItem>
							))}
						</List>
					</div>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={loading}
						onClick={createOrUpdatePlan}
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
