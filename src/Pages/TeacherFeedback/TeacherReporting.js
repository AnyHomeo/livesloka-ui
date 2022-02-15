import React, {useState} from "react"
import {Grid} from "@material-ui/core"
import TeacherCharts from "./TeacherCharts"
import QuestionCharts from "./QuestionCharts"

const TeacherReporting = () => {
	return (
		<div style={{display: "flex", justifyContent: "space-evenly"}}>
			<div>
				<TeacherCharts />
			</div>
			<div>
				<QuestionCharts />
			</div>
		</div>
	)
}

export default TeacherReporting
