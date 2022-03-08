import {Card} from "@material-ui/core"
import React from "react"
import SchedulerCard from "./SchedulerCard"

const SchedulerCardConatiner = () => {
	return (
		<div style={{margin: 5}}>
			<Card
				style={{
					// margin: 5,
					width: "100%",
					height: "auto",
					display: "flex",
					flexDirection: "column",
					marginTop: 10,
					borderRadius: "0px !important",
					border: "1px solid rgb(9, 132, 227)",
					// margin: 10,
					boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
				}}
			>
				<Card style={{backgroundColor: "rgb(9, 132, 227)"}}>
					<p style={{textAlign: "center", padding: 5, color: "white"}}>Monday</p>
				</Card>
				<SchedulerCard
					time="5:30 PM"
					className="Karthik Paypal Hindustani Music- BhagyaShree Hindi Laguage"
					color="linear-gradient(315deg, rgb(243, 156, 18) 0%, rgb(243, 156, 18) 74%)"
				/>
				<SchedulerCard
					time="6:00 PM"
					className="BhagyaShree Hindi Laguage"
					color="linear-gradient(315deg, rgb(243, 156, 18) 0%, rgb(243, 156, 18) 74%)"
				/>
			</Card>

			<Card
				style={{
					// margin: 5,
					width: "100%",
					height: "auto",
					display: "flex",
					flexDirection: "column",
					marginTop: 10,
					borderRadius: "0px !important",
					border: "1px solid rgb(9, 132, 227)",
					// margin: 10,
					boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
				}}
			>
				<Card style={{backgroundColor: "rgb(9, 132, 227)"}}>
					<p style={{textAlign: "center", padding: 5, color: "white"}}>Tuesday</p>
				</Card>
				<SchedulerCard
					time="1:00 PM"
					className="This is testing class name for test"
					color="linear-gradient(315deg, rgb(232, 65, 24) 0%, rgb(232, 65, 24) 74%)"
				/>
				<SchedulerCard
					time="3:00 PM"
					className="LOrem ipsum test class"
					color="linear-gradient(315deg, rgb(243, 156, 18) 0%, rgb(243, 156, 18) 74%)"
				/>
			</Card>
		</div>
	)
}

export default SchedulerCardConatiner
