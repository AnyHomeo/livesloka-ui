import React, {useState, useEffect} from "react"
import {Container, Grid, makeStyles} from "@material-ui/core"
import Page from "../Page"
import Budget from "./Budget"
import TasksProgress from "./TasksProgress"
import TotalCustomers from "./TotalCustomers"
import TotalProfit from "./TotalProfit"
import TrafficByDevice from "./TrafficByDevice"
import moment from "moment"
import axios from "axios"
import AmountChart from "./AmountChart"
import PaymentsTable from "./PaymentsTable"
import useDocumentTitle from "../../Components/useDocumentTitle"
const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: "100%",
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
}))

const Dashboard = () => {
	useDocumentTitle("Financial dashboard")
	const classes = useStyles()

	useEffect(() => {
		getAllTransactions()
	}, [])

	const [allData, setAllData] = useState()

	const getAllTransactions = async () => {
		const data = await axios.get(`${process.env.REACT_APP_API_KEY}/payment/get/alltransactions/`)
		setAllData(data)
		let monthlyData = {}

		data &&
			data.data.result.forEach((item) => {
				let month = moment(item.createdAt).format("MMMM YYYY")
				monthlyData[month] = monthlyData[month] || {count: 0, responses: []}
				monthlyData[month].count++
				monthlyData[month].responses.push(item)
			})
	}

	return (
		<Page className={classes.root}>
			<Container maxWidth={false}>
				<Grid container spacing={3}>
					<Grid item lg={3} sm={6} xl={3} xs={12}>
						<Budget dataa={allData} amount={0} />
					</Grid>
					<Grid item lg={3} sm={6} xl={3} xs={12}>
						<TotalCustomers total={0} />
					</Grid>
					<Grid item lg={3} sm={6} xl={3} xs={12}>
						<TasksProgress success={0} />
					</Grid>
					<Grid item lg={3} sm={6} xl={3} xs={12}>
						<TotalProfit failed={0} />
					</Grid>
					<Grid item lg={8} md={6} xl={8} xs={12}>
						<AmountChart dailyDataline={0} dataa={allData} />
					</Grid>
					<Grid item lg={4} md={6} xl={4} xs={12}>
						<TrafficByDevice totaltrx={0} failed={0} success={0} />
					</Grid>
					<Grid item lg={12} md={12} xs={12}>
						{/* <LatestOrders data={allData} /> */}
						<PaymentsTable data={allData} />
					</Grid>
				</Grid>
			</Container>
		</Page>
	)
}

export default Dashboard
