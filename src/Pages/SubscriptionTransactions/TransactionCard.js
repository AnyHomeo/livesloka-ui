import {Chip, Fab, LinearProgress, makeStyles, Typography} from "@material-ui/core"
import React, {useEffect, useState} from "react"
import {Calendar, Trash2, Copy, Edit} from "react-feather"
import {Avatar, IconButton, Grid} from "@material-ui/core"
import moment from "moment"
import Collapse from "@material-ui/core/Collapse"
import Axios from "axios"
import MaterialTable from "material-table"
import paypal from "../../Images/paypal.png"
import Stripe from "../../Images/Stripe.png"
import {ChevronDown, ChevronUp} from "react-feather"
const useStyles = makeStyles({
	container: {
		marginTop: 30,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	card: {
		width: "100%",
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
		borderRadius: 10,
		padding: 20,
		marginTop: 30,
		cursor: "pointer",
	},
	infoContainer: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
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
	},
	addNewPlan: {
		borderRadius: 10,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "2px dashed #aaa",
		minHeight: 200,
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
		padding: "10px 0",
	},
	status: {
		transform: "translateX(-20px)",
		width: "fit-content",
	},
})
const TransactionCard = ({data, refresh}) => {
	const columnData = [
		{title: "Student Name", field: "name"},
		// {title: "Parent Name", field: "name"},
		{title: "Email", field: "email"},
		{title: "Amount", field: "amount", type: "numeric"},
		{
			title: "Subscription Date",
			field: "createdAt",
			render: (row) => <p>{moment(row.createdAt).format("MMMM Do YYYY")}</p>,
		},
		{
			title: "Payment Type",
			field: "paymentType",
			render: (row) =>
				row.paymentType === "PAYPAL" ? (
					<img src={paypal} alt="" style={{height: "20px"}} />
				) : (
					<img src={Stripe} alt="" style={{height: "40px"}} />
				),
		},
	]

	const classes = useStyles()
	const [isPlansOpen, setIsPlansOpen] = useState(false)
	const [plans, setPlans] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (isPlansOpen) {
			getProducts()
		}
	}, [isPlansOpen, refresh])

	const getProducts = async () => {
		setLoading(true)
		try {
			const res = await Axios.get(
				`${process.env.REACT_APP_API_KEY}/subscriptions/transactions/${data.stripeCustomer}`
			)
			let plansArr = []
			setLoading(false)
			res?.data?.result.map((item) => {
				let obj = {
					subscriptionId: "60ac8211e751a919d00ea02e",
					name: item.paymentData.data.object.customer_name,
					amount: item.paymentData.data.object.amount_paid,
					email: item.paymentData.data.object.customer_email,
					planName: 63,
					createdAt: item.createdAt,
					paymentType: "Stripe",
				}
				plansArr.push(obj)
			})

			setPlans(plansArr)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	return (
		<>
			{data && (
				<>
					<div className={classes.card}>
						<div className={classes.infoContainer}>
							<div className={classes.info}>
								<div>
									<p style={{marginLeft: 10}}>{data?.customerId?.firstName}</p>
								</div>
							</div>
							<div
								style={{
									display: "flex",
									flex: 0.333,
									flexDirection: "column",
									alignItems: "center",
								}}
							>
								<p>Paid Date</p>
								<div style={{display: "flex"}}>
									<Calendar />{" "}
									<p style={{marginLeft: 10}}>
										{moment(data.customerId.paidTill).format("MMMM Do YYYY")}
									</p>
								</div>
							</div>
							<div
								style={{
									display: "flex",
									flex: 0.333,
									flexDirection: "column",
									alignItems: "center",
								}}
							>
								<p>Due Date</p>
								<div style={{display: "flex"}}>
									<Calendar />{" "}
									<p style={{marginLeft: 10}}>{moment(data.createdAt).format("MMMM Do YYYY")}</p>
								</div>
							</div>
							<div>
								<IconButton onClick={() => setIsPlansOpen((prev) => !prev)}>
									{isPlansOpen ? <ChevronUp /> : <ChevronDown />}
								</IconButton>
							</div>
						</div>
						<Collapse in={isPlansOpen}>
							<div className={classes.plansWrapper}>
								{loading && <LinearProgress />}
								<MaterialTable
									loading={loading}
									title="Payments"
									columns={columnData}
									data={plans}
									// isLoading={loading}
									style={{
										margin: "20px",
										padding: "20px",
									}}
									options={{
										search: true,
										pageSizeOptions: [5, 20, 30, 40, 50, plans?.length],
										// maxBodyHeight: height - 270,
										exportButton: true,
										paginationType: "stepped",
										searchFieldVariant: "outlined",
									}}
								/>
							</div>
						</Collapse>
					</div>
				</>
			)}
		</>
	)
}

export default TransactionCard
