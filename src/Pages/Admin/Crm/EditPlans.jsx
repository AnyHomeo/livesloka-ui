import React, {useEffect, useState, useCallback} from "react"
import {Dialog, DialogActions} from "@material-ui/core"
import {DialogTitle} from "@material-ui/core"
import {DialogContent} from "@material-ui/core"
import {Grid, Checkbox, Typography, TextField} from "@material-ui/core"
import {getOptionsByCustomer, getPlansByCustomer, updateOptions} from "../../../Services/Services"
import {useSnackbar} from "notistack"
import styles from "../../SubscriptionScheduler/style.module.scss"
import Button from "@material-ui/core/Button"

const EditPlans = ({customerId, setCustomerId}) => {
	const {enqueueSnackbar} = useSnackbar()
	const [plans, setPlans] = useState([])
	const [optionsId, setOptionsId] = useState("")

	useEffect(() => {
		if (customerId) {
			getPlansByCustomer(customerId)
				.then((data) => {
					let allPlans = data.data.result
					console.log(allPlans)
					if (allPlans.length) {
						getOptionsByCustomer(customerId)
							.then((data) => {
								if (data.data.result) {
									setOptionsId(data?.data?.result?._id)
									let discounts = data?.data?.result?.discounts
									console.log(discounts)
									setPlans(
										allPlans.map((plan) => {
											let discountIndex = discounts.findIndex(
												(discount) => discount?.plan?._id === plan._id
											)
											let discount = {}
											if (discountIndex !== -1) {
												discount = discounts[discountIndex]
											}
											return {
												...plan,
												discount: discount.amount,
												isSelected: !!Object.keys(discount).length,
											}
										})
									)
								} else {
									setOptionsId("")
								}
							})
							.catch((err) => {
								console.log(err)
								enqueueSnackbar(err?.response?.data?.error, {
									variant: "error",
								})
								setCustomerId("")
							})
					} else {
						enqueueSnackbar("Please add few more plans", {
							variant: "error",
						})
						setCustomerId("")
					}
				})
				.catch((err) => {
					console.log(err)
					enqueueSnackbar(err?.response?.data?.error, {
						variant: "error",
					})
					setCustomerId("")
				})
		} else {
            setPlans([])
        }
	}, [customerId, enqueueSnackbar, setCustomerId])

	const updatePlans = useCallback(() => {
		updateOptions(optionsId, {
			discounts: plans.reduce((discounts, plan) => {
				if (plan.isSelected) {
					discounts.push({
						amount: plan.discount,
						plan: plan._id,
					})
				}
				return discounts
			}, []),
		})
			.then(() => {
				enqueueSnackbar("Plans updated successfully", {
					variant: "success",
				})
					setCustomerId("")

			})
			.catch((err) => {
				console.error(err)
				enqueueSnackbar("Something went wrong", {
					variant: "error",
				})
			})
	}, [optionsId, enqueueSnackbar, plans,setCustomerId])


	return (
		<Dialog
			open={!!customerId}
			fullWidth
			maxWidth="lg"
			onClose={() => setCustomerId("")}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle>Edit Plans</DialogTitle>
			<DialogContent>
				<div style={{textAlign: "center"}}>
					{" "}
					Select plans to make them available to the customer{" "}
				</div>
				<Grid container spacing={4}>
					{plans.map((plan, i) => {
						return (
							<Grid item key={plan._id} xs={12} sm={6} md={4} lg={3}>
								<div className={styles.planCard}>
									<Typography align="center" variant="h4">
										{plan.name}
									</Typography>
									<Typography>
										{plan?.currency?.prefix || "$"} {plan.amount / plan.intervalCount}
									</Typography>
									<Typography align="center">{plan.description}</Typography>
									<Typography align="center">
										{plan.intervalCount} {plan.interval}
										{plan.intervalCount === 1 ? "" : "s"} plan
									</Typography>
									<TextField
										type="number"
										variant="outlined"
										onChange={(e) =>
											setPlans((prev) => {
												let prevData = [...prev]
												prevData[i].discount = e.target.value
												return prevData
											})
										}
										label="Discount Amount"
										value={plan.discount}
									/>
									<Checkbox
										checked={plan.isSelected}
										className={styles.checkbox}
										onChange={(e) => {
											setPlans((prev) => {
												let prevData = [...prev]
												prevData[i].isSelected = !prevData[i].isSelected
												return prevData
											})
										}}
									/>
								</div>
							</Grid>
						)
					})}
				</Grid>
				<DialogActions>
					<Button variant="contained" color="primary" onClick={updatePlans}>
						{" "}
						Update Plans{" "}
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	)
}

export default EditPlans
