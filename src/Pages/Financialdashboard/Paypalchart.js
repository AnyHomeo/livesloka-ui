import React from "react"
import {Line} from "react-chartjs-2"
import moment from "moment"
import {Box, Divider, useTheme, Card, CardContent, CardHeader, makeStyles} from "@material-ui/core"

const useStyles = makeStyles(() => ({
	root: {
		height: "100%",
	},
}))

const Paypalchart = ({chartdata}) => {
	const classes = useStyles()

	let labels = [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12",
		"13",
		"14",
		"15",
		"16",
		"17",
		"18",
		"19",
		"20",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"28",
		"29",
		"30",
		"31",
	]
	const data = {
		datasets: chartdata,
		labels,
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
			backgroundColor: "#2d3436",
			bodyFontColor: "white",
			borderColor: "black",
			borderWidth: 1,
			enabled: true,
			footerFontColor: "white",
			intersect: false,
			mode: "index",
			titleFontColor: "white",
			margin: 10,
		},
	}

	return (
		<Card className={classes.root}>
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

export default Paypalchart
