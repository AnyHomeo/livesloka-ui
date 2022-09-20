import React, {useCallback, useState, useEffect} from "react"
import {Chip, makeStyles, Typography} from "@material-ui/core"
import {Calendar, Trash2, Edit} from "react-feather"
import {Avatar, IconButton, Grid} from "@material-ui/core"
import moment from "moment"
import Collapse from "@material-ui/core/Collapse"
import {useConfirm} from "material-ui-confirm"
import {deleteSubscriptionProduct, getAllPlansOfTheProduct} from "../../Services/Services"
import {useSnackbar} from "notistack"
import {deleteSubscriptionPlan} from "./../../Services/Services"

function Product({
	product,
	setProductsRefresh,
	plansRefresh,
	editingId,
	setEditingId,
	setOpenAddPlanModal,
}) {
	const classes = useStyles()
	const [isPlansOpen, setIsPlansOpen] = useState(false)
	const [plans, setPlans] = useState([])
	const confirm = useConfirm()
	const {enqueueSnackbar} = useSnackbar()

	useEffect(() => {
		if (isPlansOpen) {
			getAllPlansOfTheProduct(product._id).then((data) => {
				setPlans(data.data.result)
			})
		}
	}, [isPlansOpen, product])

	const onDeleteClick = useCallback(() => {
		confirm({
			title: `Delete ${product.name}`,
			description: `do you really wanna delete ${product.name}?`,
			confirmationText: "Yes! delete",
			cancellationText: "No",
			confirmationButtonProps: {
				variant: "contained",
				color: "secondary",
				size: "small",
			},
			cancellationButtonProps: {
				variant: "outlined",
				size: "small",
				color: "primary",
			},
		}).then(() => {
			deleteSubscriptionProduct(product._id)
				.then((data) => {
					enqueueSnackbar(`${product.name} Deleted successfully!`, {
						variant: "success",
					})
					setProductsRefresh((prev) => !prev)
				})
				.catch((err) => {
					enqueueSnackbar(err?.response?.data?.error || "Something went wrong while Deleting!", {
						variant: "error",
					})
				})
		})
	}, [product, confirm, enqueueSnackbar, setProductsRefresh])

	useEffect(() => {
		setIsPlansOpen(false)
	}, [plansRefresh])

	const onPlanDeleteClick = useCallback(
		(plan) => {
			confirm({
				title: `Delete ${plan.name}`,
				description: `do you really wanna delete ${plan.name}?`,
				confirmationText: "Yes! delete",
				cancellationText: "No",
				confirmationButtonProps: {
					variant: "contained",
					color: "secondary",
					size: "small",
				},
				cancellationButtonProps: {
					variant: "outlined",
					size: "small",
					color: "primary",
				},
			}).then(() => {
				deleteSubscriptionPlan(plan._id).then((data) => {
					enqueueSnackbar(`${plan.name} Deleted successfully!`, {
						variant: "success",
					})
					setPlans((prev) => prev.filter((prevPlan) => !(prevPlan._id === plan._id)))
				})
			})
		},
		[confirm, enqueueSnackbar]
	)

	const onEditClick = (planId) => {
		setEditingId(planId)
		setOpenAddPlanModal(true)
	}

	return (
		<div className={classes.card}>
			<Grid container justifyContent="space-between">
				<Grid item xs={12} sm={12} md={6} onClick={() => setIsPlansOpen((prev) => !prev)}>
					<div className={classes.info}>
						<Avatar style={{backgroundColor: "#e67e22"}}>{product.name[0]}</Avatar>
						<div>
							<p style={{marginLeft: 10}}>{product.name}</p>
							<p style={{marginLeft: 10, fontSize: 12}}>{product.description}</p>
						</div>
					</div>
				</Grid>
				<Grid item xs={12} sm={12} md={3} onClick={() => setIsPlansOpen((prev) => !prev)}>
					<div style={{display: "flex"}}>
						<Calendar />{" "}
						<p style={{marginLeft: 10}}>{moment(product.createdAt).format("MMMM Do YYYY")}</p>
					</div>
				</Grid>
				<Grid item xs={12} sm={12} md={3}>
					<div className={classes.flexEnd}>
						<IconButton onClick={onDeleteClick}>
							<Trash2 />
						</IconButton>
					</div>
				</Grid>
			</Grid>
			<Collapse in={isPlansOpen}>
				<div className={classes.plansWrapper}>
					<Typography variant="h3" className={classes.planTitle}>
						{" "}
						{product.name} Plans{" "}
					</Typography>
					<Grid container spacing={2}>
						{plans.map((item, i) => (
							<Grid key={i} item xs={12} sm={4} md={3}>
								<div className={classes.planCard}>
									<Chip
										size="small"
										color={item.active ? "primary" : "secondary"}
										className={classes.status}
										label={`,    ${item.active ? "Active" : "Inactive"}`}
									/>
									<Chip
										size="small"
										color={!item.isSubscription ? "primary" : "secondary"}
										className={classes.subscription}
										label={`,    ${item.isSubscription ? "Subscription" : "One time Payment"}`}
									/>
									{item.currency ? (
										<Chip
											size="small"
											color={"primary"}
											className={classes.currency}
											label={`,    ${item.currency.currencyName || "USD"}`}
										/>
									) : (
										""
									)}
									<Typography variant="caption" style={{textAlign: "right"}}>
										{item.currency.prefix || "$"}{" "}
										{Number(item.amount / item.intervalCount).toFixed(2)}
									</Typography>
									<Typography variant="h3" style={{textAlign: "center"}}>
										{item.name}
									</Typography>
									<Typography variant="caption">{item.description}</Typography>
									<div className={classes.planActions}>
										<IconButton onClick={() => onEditClick(item._id)}>
											<Edit size={16} />
										</IconButton>
										<IconButton onClick={() => onPlanDeleteClick(item)}>
											<Trash2 size={16} />
										</IconButton>
									</div>
								</div>
							</Grid>
						))}
					</Grid>
				</div>
			</Collapse>
		</div>
	)
}

const useStyles = makeStyles({
	card: {
		width: "100%",
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
		borderRadius: 10,
		padding: 20,
		marginTop: 30,
		cursor: "pointer",
	},
	info: {
		display: "flex",
		alignItems: "center",
		flex: 0.333,
	},
	plansWrapper: {
		padding: 10,
		boxSizing: "border-box",
	},
	planCard: {
		borderRadius: 10,
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
		minHeight: 200,
		display: "flex",
		justifyContent: "space-around",
		flexDirection: "column",
		overflow: "hidden",
		padding: 10,
		position: "relative",
	},
	addNewPlan: {
		borderRadius: 10,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "2px dashed #aaa",
		minHeight: 150,
		fontSize: "1rem",
	},
	planActions: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		gap: 10,
	},
	planTitle: {
		textAlign: "center",
		padding: "5px 0",
	},
	status: {
		transform: "translateX(-20px)",
		width: "fit-content",
		position: "absolute",
		top: 10,
	},
	currency: {
		transform: "translateX(-20px)",
		position: "absolute",
		bottom: 10,
	},
	subscription: {
		transform: "translateX(-20px)",
		position: "absolute",
		bottom: 40,
	},
	flexEnd: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
	},
})

export default Product
