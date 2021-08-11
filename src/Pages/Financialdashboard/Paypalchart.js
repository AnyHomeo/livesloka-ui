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

	const customTooltips = function (tooltip) {
		// if (!tooltip) {
		// 	return
		// }
		// // Tooltip Element
		// let tooltipEl = document.getElementById("chartjs-tooltip")
		// if (!tooltipEl) {
		// 	tooltipEl = document.createElement("div")
		// 	tooltipEl.id = "chartjs-tooltip"
		// 	document.body.appendChild(tooltipEl)
		// }
		// // Set caret Position
		// tooltipEl.classList.remove("above", "below", "no-transform")
		// if (tooltip.yAlign) {
		// 	tooltipEl.classList.add(tooltip.yAlign)
		// } else {
		// 	tooltipEl.classList.add("no-transform")
		// }
		// const getBody = (bodyItem) => bodyItem.lines
		// //Hide the tooltips when mouseout
		// if (tooltip.opacity === 0) {
		// 	tooltipEl.style.opacity = 0
		// 	return
		// }
		// // Set custom tooltip
		// if (tooltip.body) {
		// 	const bodyLines = tooltip.body.map(getBody)
		// 	const tooltipData = bodyLines[0][0].rawDataItem
		// 	const TrendSVGDict = {
		// 		"Price decrease": DecreaseSVG,
		// 		"Price increase": IncreaseSVG,
		// 	}
		// 	let innerHtml = "<div class='arrow_box'><ul>"
		// 	const tooltipTitle = `<li key="title" class="tooltip-title">${tooltipData.x} days</li>`
		// 	const tooltipValue = IsEmptyValue(tooltipData.toolTipsData.trend.compareToPre)
		// 		? // &&
		// 		  // TrendSVGDict.hasOwnProperty(tooltipData.toolTipsData.trend.compareToPre)
		// 		  "<li></li>"
		// 		: tooltipData.toolTipsData.trend.diff < 0 //decreasing
		// 		? `<li class='green' key="value" class="tooltip-value"><img src="${
		// 				TrendSVGDict[tooltipData.toolTipsData.trend.compareToPre]
		// 		  }"/>${tooltipData.toolTipsData.trend.compareToPre}</li>`
		// 		: tooltipData.toolTipsData.trend.diff > 0 //increasing
		// 		? `<li class='red' key="value" class="tooltip-value"><img src="${
		// 				TrendSVGDict[tooltipData.toolTipsData.trend.compareToPre]
		// 		  }"/>${tooltipData.toolTipsData.trend.compareToPre}</li>`
		// 		: //equal
		// 		  `<li class='black' key="value" class="tooltip-value">${tooltipData.toolTipsData.trend.compareToPre}</li>`
		// 	const tooltipFooter = `<li key="footer" class="tooltip-footer"><img src="${DateSVG}"/>${FormatDate(
		// 		tooltipData.toolTipsData.updatedOn
		// 	)}</li>`
		// 	innerHtml += tooltipTitle
		// 	!IsEmptyValue(tooltipData.toolTipsData.trend.compareToPre) && (innerHtml += tooltipValue)
		// 	innerHtml += tooltipFooter
		// 	innerHtml += "</ul></div>"
		// 	// Set inner html to tooltip
		// 	tooltipEl.innerHTML = innerHtml
		// 	var chartElement = this._chart.canvas.getBoundingClientRect()
		// 	// Calculate position
		// 	const positionY = chartElement.top + tooltip.yPadding
		// 	const positionX = chartElement.left + tooltip.xPadding
		// 	// Display, position, and set styles for font
		// 	tooltipEl.style.opacity = 1
		// 	tooltipEl.style.left = positionX + tooltip.caretX + "px"
		// 	tooltipEl.style.top = positionY + tooltip.caretY + 10 + "px"
		// }
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
		// tooltips: {
		// 	backgroundColor: "#2d3436",
		// 	bodyFontColor: "white",
		// 	borderColor: "black",
		// 	borderWidth: 1,
		// 	enabled: true,
		// 	footerFontColor: "white",
		// 	intersect: false,
		// 	mode: "index",
		// 	titleFontColor: "white",
		// 	margin: 10,
		// 	tooltipTemplate: "<%if (label){%><%=label %>: <%}%><%= value + ' %' %>",
		// 	multiTooltipTemplate: "<%= value + ' %' %>",
		// },

		// tooltips: {
		// 	enabled: false,
		// 	custom: customTooltips,
		// 	callbacks: {
		// 		label: (tooltipItem, data) => {
		// 			const rawDataItem = chartdata.map((item, i) => item.index === i)
		// 			// console.log(tooltipItem.label)
		// 			console.log(rawDataItem)
		// 			return {
		// 				label: tooltipItem.xLabel,
		// 				rawDataItem: rawDataItem,
		// 			}
		// 		},
		// 	},
		// },

		tooltips: {
			mode: "label",
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
