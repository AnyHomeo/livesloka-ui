import {Chip, makeStyles} from "@material-ui/core"
import React from "react"
import Teacher from "../../Images/teacher.png"
import money from "../../Images/money.png"
const DataCard = ({data, provided, snapshot}) => {
	const useStyles = makeStyles({
		root: {
			userSelect: "none",
			// padding: 5,
			margin: "0 0 8px 0",
			minHeight: "50px",
			backgroundColor: snapshot.isDragging ? "#70a1ff" : "white",
			boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
			borderRadius: 5,
			...provided.draggableProps.style,
			overflow: "hidden",
		},
	})
	const classes = useStyles()

	return (
		<div
			className={classes.root}
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
		>
			<div style={{height: 20, widht: "100%", backgroundColor: "#3867d6"}}>
				<p style={{fontSize: 12, textAlign: "center", color: "white"}}>{data.lastName}</p>
			</div>
			<div style={{padding: 2}}>
				<span style={{display: "flex", justifyContent: "space-between"}}>
					<p style={{fontSize: 12}}>{data.firstName}</p>
					<p style={{fontSize: 12, display: "flex", alignItems: "center"}}>
						<img src={Teacher} style={{height: 15, width: 15, marginRight: 5}} alt="" />{" "}
						{"Preeti Bisht"}
					</p>
				</span>
				<span style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
					<p style={{fontSize: 12}}>{"Tollywood"}</p>

					<p style={{fontSize: 12, display: "flex", alignItems: "center"}}>
						<img src={money} style={{height: 15, width: 15, marginRight: 5}} alt="" />{" "}
						{`${data.proposedAmount}.00`}
					</p>
				</span>
				<span
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginTop: 2,
					}}
				>
					<p style={{fontSize: 12}}>{data?.timeZone?.timeZoneName}</p>
					<p style={{fontSize: 12}}>{data.age}</p>
				</span>
			</div>
		</div>
	)
}

export default DataCard
