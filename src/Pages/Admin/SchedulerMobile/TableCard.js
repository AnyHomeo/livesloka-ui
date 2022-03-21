import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Card,
	Chip,
	IconButton,
	makeStyles,
	Switch,
	Tooltip,
} from "@material-ui/core"
import React, {useState} from "react"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import CancelIcon from "@material-ui/icons/Cancel"
import momentTZ from "moment-timezone"
import WhatsAppIcon from "@material-ui/icons/WhatsApp"

const useStyles = makeStyles((theme) => ({
	cardContainer: {
		display: "flex",
		flexDirection: "row",
		flexGrow: 1,
		flex: 1,
		marginTop: 3,
		marginBottom: 3,
		justifyContent: "space-between",
		padding: 5,
		paddingLeft: 5,
		paddingRight: 5,
	},

	card1: {
		height: 40,
		display: "flex",
		alignItems: "center",
		marginBottom: 5,
		backgroundColor: "#2980b9",
		color: "white",
		borderRadius: 0,
		border: "1px solid #2980b9",
		marginTop: -5,
		flex: 0.4,
	},

	card2: {
		height: 40,
		display: "flex",
		alignItems: "center",
		marginBottom: 5,
		backgroundColor: "#ecf0f1",
		color: "black",
		border: "1px solid #2980b9",
		borderRadius: 0,
		marginTop: -5,
		flex: 0.6,
	},

	editText: {
		height: 40,
		display: "flex",
		alignItems: "center",
		marginTop: -5,
		flex: 0.6,
	},
	content: {
		"&$expanded": {
			marginBottom: 0,
			display: "flex",
			justifyContent: "space-between",
		},
	},
}))

const TableCard = ({data, timeZoneLookup}) => {
	const [editOption, setEditOption] = useState(false)
	const classes = useStyles()

	return (
		<div style={{marginTop: 10}}>
			{data &&
				data.map((item, i) => (
					<>
						{/* {console.log(item)} */}
						<Card
							style={{
								height: "auto",
								width: "100%",
								// borderRadius: 10,
								margin: 1,
								display: "flex",
								marginTop: 3,
								marginBottom: 3,

								justifyContent: "space-between",
							}}
						>
							<div>
								<div style={{padding: 5}}>
									<p style={{fontSize: 12}}>{`${item.firstName} (${item.lastName})`}</p>
								</div>
							</div>

							<div
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<div
									style={{
										height: "100%",
										width: 50,
										backgroundColor: "#fa8231",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<WhatsAppIcon
										style={{color: "white", height: 20, width: 20}}
										onClick={() =>
											window.open(
												`https://api.whatsapp.com/send?phone=${
													item.whatsAppnumber.indexOf("+") !== -1
														? item.whatsAppnumber.split("+")[1].split(" ").join("")
														: item.countryCode
														? item.countryCode + item.whatsAppnumber.split(" ").join("")
														: item.whatsAppnumber.split(" ").join("")
												}`
											)
										}
									/>
								</div>
							</div>
						</Card>
					</>
				))}
		</div>
	)
}

export default TableCard
