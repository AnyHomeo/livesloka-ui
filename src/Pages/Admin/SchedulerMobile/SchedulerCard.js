import {Card, IconButton, Tooltip} from "@material-ui/core"
import React from "react"
import {
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	ChevronUp,
	Send,
	Star,
	UserCheck,
} from "react-feather"
const SchedulerCard = ({time, className, color}) => {
	return (
		<div>
			<Card
				style={{
					height: 60,
					width: "100%",
					margin: 1,
					display: "flex",
					marginTop: 3,
					marginBottom: 3,
					flexDirection: "column",
					background: color,
				}}
			>
				<div style={{display: "flex", justifyContent: "space-between", marginBottom: 5}}>
					<div
						style={{
							height: 30,
							width: 60,
							backgroundColor: "#e74c3c",
							borderTopRightRadius: 15,
							borderBottomRightRadius: 15,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							color: "white",
						}}
					>
						<p style={{fontSize: 12}}>{time}</p>
					</div>

					<div style={{display: "flex", alignItems: "center", paddingRight: 5}}>
						<IconButton size="small">
							<Send size={20} />
						</IconButton>

						<Tooltip>
							<div
								style={{
									borderRadius: 10,
									padding: "0px 8px",
									backgroundColor: "#3A68D5",
									height: 20,
									width: 20,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									color: "white",
								}}
							>
								<p style={{fontSize: 10}}>10</p>
							</div>
						</Tooltip>
					</div>
				</div>
				<p style={{fontSize: 12, textAlign: "center"}}>{className}</p>
			</Card>
		</div>
	)
}

export default SchedulerCard
