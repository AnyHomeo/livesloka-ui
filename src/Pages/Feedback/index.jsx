import React, {useCallback, useEffect, useState} from "react"
import {getWatiFeedbackMessages} from "../../Services/Services"
import {Chart} from "./Chart"
import {FeedbackTable} from "./FeedbackTable"

export const Feedback = () => {
	const [data, setData] = useState([])
	const [chartData, setChartData] = useState([])
	const retrieveFeedbackMessageResponses = useCallback(() => {
		getWatiFeedbackMessages()
			.then((response) => {
				const {messages, chart} = response.data.result
				setData(
					messages.map(
						({
							createdAt,
							customer: {firstName},
							schedule: {className},
							teacher: {TeacherName},
							response,
						}) => ({
							createdAt,
							customer: firstName,
							schedule: className,
							teacher: TeacherName,
							response,
						})
					)
				)
				setChartData(
					Object.keys(chart).map((teacher) => ({
						name: teacher,
						y: (chart[teacher]["Yes"] / Object.values(chart[teacher]).reduce((a, b) => a + b, 0) ) * 100,
					}))
				)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	useEffect(() => {
		retrieveFeedbackMessageResponses()
	}, [retrieveFeedbackMessageResponses])

	return (
		<>
			<Chart data={chartData} />
			<FeedbackTable data={data} />
		</>
	)
}
