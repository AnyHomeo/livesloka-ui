import React, {useEffect, useState} from "react"
import AnalogClock from "analog-clock-react"
import moment from "moment-timezone"
import "./clock.css"
const timezoneArr = [
	{
		id: 1,
		title: "IST",
		tz: "Asia/Kolkata",
	},
	{
		id: 6,
		title: "EST",
		tz: "America/New_York",
	},

	{
		id: 7,
		title: "CST",
		tz: "America/Matamoros",
	},

	{
		id: 9,
		title: "MST",
		tz: "America/Mazatlan",
	},

	{
		id: 3,
		title: "PST",
		tz: "America/Los_Angeles",
	},
]

const AnalogClockTime = () => {
	const [AllTimeZones, setAllTimeZones] = useState()

	useEffect(() => {
		let timeinterval = setInterval(() => {
			setAllTimeZones(new Date())
		}, 1000)

		return () => {
			clearInterval(timeinterval)
		}
	}, [])

	let options = {
		useCustomTime: true, // set this to true
		width: "150px",
		border: true,
		borderColor: "#2e2e2e",
		baseColor: "white",
		centerColor: "#e74c3c",
		centerBorderColor: "#fff",
		handColors: {
			second: "#2c3e50",
			minute: "#2d3436",
			hour: "#2d3436",
		},
	}

	return (
		<div style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
			{timezoneArr.map((time) => (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						marginTop: 20,
					}}
				>
					<AnalogClock
						{...options}
						seconds={moment(AllTimeZones).tz(time.tz).format("ss")}
						minutes={moment(AllTimeZones).tz(time.tz).format("mm")}
						hours={moment(AllTimeZones).tz(time.tz).format("HH")}
					/>
					<p>{time.title}</p>
				</div>
			))}
		</div>
	)
}

export default AnalogClockTime
