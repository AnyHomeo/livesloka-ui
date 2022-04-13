import {Chip, makeStyles} from "@material-ui/core"
import React from "react"
import Crown from "../../Images/crown.png"
const DataCard = ({data, provided, snapshot}) => {
	const useStyles = makeStyles({
		root: {
			userSelect: "none",
			padding: 5,
			margin: "0 0 8px 0",
			minHeight: "50px",
			backgroundColor: snapshot.isDragging ? "#70a1ff" : "white",
			boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
			borderRadius: 5,
			...provided.draggableProps.style,
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
			<span style={{display: "flex", justifyContent: "space-between"}}>
				<p style={{fontSize: 12, fontWeight: "bold"}}>{data.parent}</p>
				<p style={{fontSize: 12, display: "flex", alignItems: "center"}}>
					<img src={Crown} style={{height: 15, width: 15, marginRight: 3}} alt="" /> {data.agent}
				</p>
			</span>

			<span style={{display: "flex", justifyContent: "space-between"}}>
				<p style={{fontSize: 12, color: "#2f3542"}}>{data.studentName}</p>
				<p style={{fontSize: 12}}>{data.age}</p>
			</span>
			{data.tags.map((tag, i) => (
				<Chip
					style={{marginRight: 2, height: 20, backgroundColor: i === 0 ? "#FD7272" : "#9AECDB"}}
					size="small"
					label={<p style={{fontSize: 10, fontWeight: "bold"}}>{tag}</p>}
				/>
			))}
		</div>
	)
}

export default DataCard
