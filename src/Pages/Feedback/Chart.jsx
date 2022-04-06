import React from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts"
import {makeStyles} from "@material-ui/core"

export const Chart = ({data}) => {
	const classes = useStyles()

	const options = {
		chart: {
			type: "column",
		},
		title: {
			text: "Feedback of teachers on April month",
		},
		accessibility: {
			announceNewData: {
				enabled: true,
			},
		},
		xAxis: {
			type: "category",
		},
		yAxis: {
			title: {
				text: "Satisfaction Percent",
			},
		},
		plotOptions: {
			series: {
				borderWidth: 0,
				dataLabels: {
					enabled: true,
					format: "{point.y:.1f}%",
				},
			},
		},

		legend: {
			enabled: false,
		},
		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat:
				'<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of satisfied feedback<br/>',
		},

		series: [
			{
				name: "Teacher feedback",
				colorByPoint: true,
				data,
			},
		],
	}

	return (
		<div className={classes.chartWrapper}>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	)
}

const useStyles = makeStyles(() => ({
	chartWrapper: {
		padding: 20,
	},
}))
