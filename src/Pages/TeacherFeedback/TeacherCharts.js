import React, {useState} from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

const TeacherCharts = () => {
	const [selectedTeacher, setSelectedTeacher] = useState([])
	const options = {
		title: {
			text: "Overall Rating",
		},
		subtitle: {
			text: "Question",
		},
		xAxis: {
			categories: ["Gopi", "Aurndathi", "Shawn", "Mendes", "Camila"],
		},
		yAxis: {
			title: {
				text: null,
			},
		},
		series: [
			{
				type: "column",
				colorByPoint: false,
				data: [
					{y: 4.3, color: "#2ecc71", id: "Gopi"},
					{y: 5.0, color: "#ffbe76", id: "Aurndathi"},
					{y: 3.5, color: "#ff7979", id: "Shawn"},
					{y: 4.1, color: "#57606f", id: "Mendes"},
					{y: 2.5, color: "#3867d6", id: "Camila"},
				],
				showInLegend: false,
				cursor: "pointer",
				point: {
					events: {
						click: (e) => {
							setSelectedTeacher((prev) => {
								let prevData = [...prev]
								if (prevData.includes(e.point.id)) {
									let index = prevData.indexOf(e.point.id)
									prevData.splice(index, 1)
									return prevData
								} else {
									return [...prevData, e.point.id]
								}
							})
						},
					},
				},
			},
		],
	}

	const options2 = {
		title: {
			text: "Overall Rating",
		},
		subtitle: {
			text: "Question",
		},
		xAxis: {
			categories: ["Gopi", "Aurndathi", "Shawn", "Mendes", "Camila"],
		},
		yAxis: {
			title: {
				text: null,
			},
		},
		series: [
			{
				type: "column",
				colorByPoint: false,
				data: [
					{y: 4.3, color: "#2ecc71", id: "Gopi"},
					{y: 5.0, color: "#ffbe76", id: "Aurndathi"},
					{y: 3.5, color: "#ff7979", id: "Shawn"},
					{y: 4.1, color: "#57606f", id: "Mendes"},
					{y: 2.5, color: "#3867d6", id: "Camila"},
				],
				showInLegend: false,
			},
		],
	}

	return (
		<div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
			<div style={{marginTop: 20}}>
				<HighchartsReact highcharts={Highcharts} options={options} />

				{selectedTeacher.map((item) => (
					<div style={{marginTop: 15, marginBottom: 15}}>
						<HighchartsReact highcharts={Highcharts} options={options2} />
					</div>
				))}
			</div>
		</div>
	)
}

export default TeacherCharts
