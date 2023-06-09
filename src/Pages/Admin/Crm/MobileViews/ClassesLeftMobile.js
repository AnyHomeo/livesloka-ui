import React from "react"
import {makeStyles} from "@material-ui/core/styles"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import moment from "moment"
const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		margin: "0 auto",
		marginTop: 5,
		marginBottom: 5,
	},
	heading: {
		fontSize: 15,
		fontWeight: theme.typography.fontWeightRegular,
		// marginRight: 20,
	},
	expanded: {},
	content: {
		"&$expanded": {
			marginBottom: 0,
			display: "flex",
			justifyContent: "space-between",
		},
	},
	subTitle: {
		marginTop: 5,
		marginBottom: 5,
		marginRight: 10,
		fontSize: 16,
	},
	noStudent: {
		fontSize: 14,
		opacity: 0.8,
	},
	flexContainer: {
		display: "flex",
		alignItems: "center",
		flexWrap: "wrap",
	},
	mainTitle: {
		fontSize: 14,
	},
}))

const ClassesLeftMobile = ({data}) => {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Accordion>
				<AccordionSummary
					classes={{content: classes.content, expanded: classes.expanded}}
					expandIcon={<ExpandMoreIcon style={{color: "white"}} />}
					style={{
						backgroundColor:
							data.comment === "Successful Payment!"
								? "#2ecc71"
								: data.comment === "Attendance Taken!"
								? "#f1c40f"
								: "#3498db",
						color: "white",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<Typography className={classes.heading}>
							{moment(data.createdAt).format("MMMM Do YYYY")}
						</Typography>
						<Typography className={classes.heading}>{data.nextValue}</Typography>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<div>
						<div className={classes.flexContainer}>
							<p className={classes.subTitle}>Date:</p>{" "}
							<p className={classes.mainTitle}>{moment(data.createdAt).format("LLL")}</p>
						</div>

						<div className={classes.flexContainer}>
							<p className={classes.subTitle}>Prev:</p>{" "}
							<p className={classes.mainTitle}>{data.previousValue}</p>
						</div>

						<div className={classes.flexContainer}>
							<p className={classes.subTitle}>Next:</p>{" "}
							<p className={classes.mainTitle}>{data.nextValue}</p>
						</div>
						<div className={classes.flexContainer}>
							<p className={classes.subTitle}>Comment:</p>{" "}
							<p className={classes.mainTitle}>{data.comment}</p>
						</div>
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	)
}

export default ClassesLeftMobile
