import React, {useState, useEffect} from "react"
import {Button, Container, Grid, makeStyles, Menu, MenuItem, TextField} from "@material-ui/core"
import PriceCard from "./PriceCard"
import axios from "axios"
import Page from "../Page"
import {Filter} from "react-feather"
import Paypalchart from "./Paypalchart"
import moment from "moment"
import Autocomplete from "@material-ui/lab/Autocomplete"
import Lottie from "react-lottie"
import loadingAnimation from "../../Images/loading.json"
import useDocumentTitle from "../../Components/useDocumentTitle"
import useWindowDimensions from "../../Components/useWindowDimensions"
import Expensestable from "./Expensestable"
import Teachersalariesfinancial from "./Teachersalariesfinancial"
import TransactionsTable from "./TransactionsTable"
const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: "100%",
		paddingBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
	},
	dash: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	dashboardText: {
		fontSize: 28,
		fontWeight: "bold",
	},
	btn: {
		border: "1px solid #bdc3c7",
		height: 40,
		width: 100,
		borderRadius: 10,
		fontWeight: "bold",
	},
}))

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: loadingAnimation,
	rendererSettings: {
		preserveAspectRatio: "xMidYMid slice",
	},
}

const FinancialDashboard = () => {
	useDocumentTitle("Financial Dashboard")

	const {width} = useWindowDimensions()
	const [anchorEl, setAnchorEl] = useState(null)
	const [loading, setLoading] = useState(false)
	const [totalData, setTotalData] = useState()
	const [showExpenses, setShowExpenses] = useState(false)
	const [showSalaries, setShowSalaries] = useState(false)
	const [PaypalChartData, setPaypalChartData] = useState()
	const [selectedMonth, setSelectedMonth] = useState()
	const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM"))
	const [showTransactions, setShowTransactions] = useState(false)
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	useEffect(() => {
		fetchData()
		fetchChartData()
	}, [])

	const classes = useStyles()
	const MonthArr = [
		{title: "July 2021", month: "2021-07"},
		{title: "June 2021", month: "2021-06"},
		{title: "May 2021", month: "2021-05"},
		{title: "April 2021", month: "2021-04"},
		{title: "March 2021", month: "2021-03"},
	]

	const fetchDataByDate = (date) => {
		fetchData(date)
		setSelectedDate(date)
		handleClose()
	}

	const fetchData = async (date) => {
		setLoading(true)
		if (date === undefined) {
			date = moment().format("YYYY-MM")
		}
		const data = await axios.get(
			`${process.env.REACT_APP_API_KEY}/transactions/cards?month=${date}`
		)

		setTotalData(data.data)

		setLoading(false)
	}

	const handleMonthChange = (e, v) => {
		setSelectedMonth(v)
		let arraySting = []

		v.forEach((time) => {
			arraySting.push(time.month)
		})

		let arrString = arraySting.join(",")

		fetchChartData(arrString)
	}

	const fetchChartData = async (date) => {
		setLoading(true)
		if (date === undefined) {
			date = moment().format("YYYY-MM")
		}
		const data = await axios.get(`${process.env.REACT_APP_API_KEY}/transactions?month=${date}`)
		setPaypalChartData(data?.data?.result)

		setLoading(false)
	}

	let datasets = []

	const colorsArr = ["#2ecc71", "#e74c3c", "#e67e22", "#2980b9", "#222f3e"]

	PaypalChartData &&
		Object.keys(PaypalChartData).map((data, i) => {
			let obj = {
				label: data,
				data: PaypalChartData[data],
				borderWidth: 3,
				borderColor: colorsArr[i % colorsArr.length],
				hoverBorderColor: colorsArr[i % colorsArr.length],
				index: 1,
			}

			datasets.push(obj)
		})

	let netAmount = {
		amount: parseInt(totalData?.netAmount),
		title: "Net Amount",
		gradient: "linear-gradient( 109.6deg,  rgba(62,161,219,1) 11.2%, rgba(93,52,236,1) 100.2% )",
	}

	let Salary = {
		amount: parseInt(totalData?.salaries),
		title: "Salary",
		gradient: "linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)",
	}

	let Expenses = {
		amount: parseInt(totalData?.expenses),
		title: "Expenses",
		gradient: "linear-gradient( 135deg, #FEB692 10%, #EA5455 100%)",
	}

	let Profit = {
		amount: parseInt(totalData?.profit),
		title: "Profit",
		gradient: "linear-gradient( 135deg, #81FBB8 10%, #28C76F 100%)",
	}

	if (loading) {
		return <Lottie options={defaultOptions} height={400} width={400} />
	}

	return (
		<Page className={classes.root}>
			<Container maxWidth={false}>
				<div className={classes.dash}>
					<div>
						<p className={classes.dashboardText}>Dashboard</p>
					</div>

					<div>
						<Button className={classes.btn} onClick={handleClick}>
							Filter <Filter style={{height: 15, width: 20, marginLeft: 5}} />
						</Button>
					</div>
				</div>
				<Grid container spacing={3}>
					<Grid item lg={3} sm={6} xl={3} xs={6}>
						<PriceCard
							data={netAmount}
							setShowTransactions={setShowTransactions}
							showTransactions={showTransactions}
							size={width < 700 ? true : false}
						/>
					</Grid>
					<Grid item lg={3} sm={6} xl={3} xs={6}>
						<PriceCard
							data={Salary}
							setShowSalaries={setShowSalaries}
							showSalaries={showSalaries}
							size={width < 700 ? true : false}
						/>
					</Grid>
					<Grid item lg={3} sm={6} xl={3} xs={6}>
						<PriceCard
							data={Expenses}
							setShowExpenses={setShowExpenses}
							showExpenses={showExpenses}
							size={width < 700 ? true : false}
						/>
					</Grid>
					<Grid item lg={3} sm={6} xl={3} xs={6}>
						<PriceCard data={Profit} size={width < 700 ? true : false} />
					</Grid>

					<Grid item xs={12}>
						<div className={classes.dash}>
							<div>
								<p className={classes.dashboardText}>Chart</p>
							</div>

							<div>
								<Autocomplete
									// style={{maxWidth: 200}}
									multiple
									getOptionSelected={(p, v) => p.month === v.month}
									options={MonthArr}
									value={selectedMonth}
									onChange={handleMonthChange}
									getOptionLabel={(option) => option.title}
									defaultValue={[MonthArr[0]]}
									Month
									freeSolo
									renderInput={(params) => (
										<TextField {...params} variant="outlined" label="Month" placeholder="Month" />
									)}
								/>
							</div>
						</div>
						<Paypalchart chartdata={datasets} />
					</Grid>

					{showTransactions && (
						<Grid item xs={12} style={{marginTop: 80}}>
							<div>
								<p className={classes.dashboardText} style={{marginBottom: 30}}>
									Net amount
								</p>
							</div>

							<TransactionsTable date={selectedDate} />
						</Grid>
					)}

					{showSalaries && (
						<Grid item xs={12} style={{marginTop: 80}}>
							<div>
								<p className={classes.dashboardText} style={{marginBottom: 30}}>
									Teacher Salaries
								</p>
							</div>

							<Teachersalariesfinancial date={selectedDate} />
						</Grid>
					)}

					{showExpenses && (
						<Grid item xs={12} style={{marginTop: 80}}>
							<div>
								<p className={classes.dashboardText} style={{marginBottom: 30}}>
									Expenses
								</p>
							</div>

							<Expensestable date={selectedDate} />
						</Grid>
					)}
				</Grid>
			</Container>

			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{MonthArr.map((date) => (
					<MenuItem
						onClick={() => {
							fetchDataByDate(date.month)
						}}
					>
						{date.title}
					</MenuItem>
				))}
			</Menu>
		</Page>
	)
}

export default FinancialDashboard
