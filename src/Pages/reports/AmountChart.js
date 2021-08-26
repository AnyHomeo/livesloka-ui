import React, {useEffect, useState} from "react"
import {Line} from "react-chartjs-2"
import clsx from "clsx"

import {Box, Divider, useTheme, Card, CardContent, CardHeader, makeStyles} from "@material-ui/core"
import axios from "axios"

const useStyles = makeStyles(() => ({
	root: {
		height: "100%",
	},
}))

const AmountChart = ({dailyDataline, dataa, className, ...rest}) => {
	const classes = useStyles()
	const theme = useTheme()
	const [TotalSum, setTotalSum] = useState([])
	const [totalDates, setTotalDates] = useState([])
	useEffect(() => {
		getDailyChartData()
	}, [])

	let finalTotalAmount = []
	let finalDates = []

	const getDailyChartData = async () => {
		const {
			data: {result},
		} = await axios.get(`${process.env.REACT_APP_API_KEY}/payment/get/dailydatagraph/`)

		Object.keys(result).map((data) => {
			if (data.startsWith("February")) {
				finalTotalAmount.push(result[data].totalSum)
				finalDates.push(result[data].dates.toString())
			}
		})
		setTotalSum(finalTotalAmount)
		setTotalDates(finalDates)
	}

	const data = {
		datasets: [
			{
				data: TotalSum && TotalSum,

				borderWidth: 4,
				borderColor: "#27ae60",
				hoverBorderColor: "#27ae60",
			},
		],
		labels: totalDates && totalDates,
	}

	const options = {
		animation: false,
		cutoutPercentage: 80,
		layout: {padding: 0},
		legend: {
			display: false,
		},
		maintainAspectRatio: false,
		responsive: true,
		tooltips: {
			backgroundColor: theme.palette.background.default,
			bodyFontColor: theme.palette.text.secondary,
			borderColor: theme.palette.divider,
			borderWidth: 1,
			enabled: true,
			footerFontColor: theme.palette.text.secondary,
			intersect: false,
			mode: "index",
			titleFontColor: theme.palette.text.primary,
		},
	}

	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<CardHeader title="Amount per day" />
			<Divider />
			<CardContent>
				<Box height={300} position="relative">
					<Line data={data} options={options} />
				</Box>
			</CardContent>
		</Card>
	)
}

export default AmountChart
