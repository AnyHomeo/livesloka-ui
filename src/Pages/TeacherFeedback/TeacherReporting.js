import React from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

const TeacherReporting = () => {
	const options = {
		chart: {
			type: "column",
		},
		title: {
			text: "Teachers feedback",
		},
		subtitle: {
			text: "",
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
				text: "Total percent market share",
			},
		},
		legend: {
			enabled: false,
		},
		plotOptions: {
			series: {
				borderWidth: 0,
				dataLabels: {
					enabled: true,
					format: "{point.y:.1f}",
				},
			},
		},

		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat:
				'<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
		},

		series: [
			{
				name: "Teacher",
				colorByPoint: true,
				data: [
					{
						name: "Gopi",
						y: 5.0,
						drilldown: "Gopi",
					},
					{
						name: "Arundathi",
						y: 4.2,
						drilldown: "Arundathi",
					},
					{
						name: "Pooji",
						y: 5.1,
						drilldown: "Pooji",
					},
					{
						name: "SubhaLakshmi",
						y: 4.1,
						drilldown: "SubhaLakshmi",
					},
					{
						name: "Kishan",
						y: 3.0,
						drilldown: "Kishan",
					},
				],
			},
		],
		drilldown: {
			series: [
				{
					name: "Gopi",
					id: "Gopi",
					data: [
						[0.1],
						[1.3],
						[53.02],
						[1.4],
						[0.88],
						[0.56],
						[0.45],
						[0.49],
						[0.32],
						[0.29],
						[0.79],
						[0.18],
						[0.13],
						[2.16],
						[0.13],
						[0.11],
						[0.17],
						[0.26],
					],
				},
				{
					name: "Arundathi",
					id: "Arundathi",
					data: [
						["v58.0", 1.02],
						["v57.0", 7.36],
						["v56.0", 0.35],
						["v55.0", 0.11],
						["v54.0", 0.1],
						["v52.0", 0.95],
						["v51.0", 0.15],
						["v50.0", 0.1],
						["v48.0", 0.31],
						["v47.0", 0.12],
					],
				},
				{
					name: "Pooji",
					id: "Pooji",
					data: [
						["v11.0", 6.2],
						["v10.0", 0.29],
						["v9.0", 0.27],
						["v8.0", 0.47],
					],
				},
				{
					name: "SubhaLakshmi",
					id: "SubhaLakshmi",
					data: [
						["v11.0", 3.39],
						["v10.1", 0.96],
						["v10.0", 0.36],
						["v9.1", 0.54],
						["v9.0", 0.13],
						["v5.1", 0.2],
					],
				},
				{
					name: "Kishan",
					id: "Kishan",
					data: [
						["v16", 2.6],
						["v15", 0.92],
						["v14", 0.4],
						["v13", 0.1],
					],
				},
			],
		},
	}

	return (
		<div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
			<div style={{marginTop: 20}}>
				<HighchartsReact highcharts={Highcharts} options={options} />
			</div>
		</div>
	)
}

export default TeacherReporting
