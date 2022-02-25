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

const StatisticsMobile = ({data, timeZoneLookup, toggleNewOldButton, toggleJoinButton}) => {
	const [editOption, setEditOption] = useState(false)
	const classes = useStyles()

	console.log(data)
	return (
		<div style={{marginTop: 10}}>
			{data &&
				data.map((item, i) => (
					<Accordion style={{marginTop: 5}}>
						<AccordionSummary
							classes={{content: classes.content, expanded: classes.expanded}}
							expandIcon={<ExpandMoreIcon />}
						>
							<p style={{marginLeft: 5, fontSize: 12}}>{item.firstName}</p>
						</AccordionSummary>

						<AccordionDetails>
							<div className={classes.cardContainer}>
								<Card className={classes.card1}>
									<p style={{marginLeft: 5, fontSize: 12}}>Present</p>
								</Card>
								<Card className={classes.card2}>
									<p style={{marginLeft: 5, fontSize: 12}}>
										{item.isStudentJoined ? (
											<CheckCircleIcon style={{color: "green"}} />
										) : (
											<CancelIcon style={{color: "red"}} />
										)}
									</p>
								</Card>
							</div>

							<div className={classes.cardContainer}>
								<Card className={classes.card1}>
									<p style={{marginLeft: 5, fontSize: 12}}>Customer Type</p>
								</Card>
								<Card className={classes.card2}>
									<p style={{marginLeft: 5, fontSize: 12}}>{item.autoDemo ? "New" : "Old"}</p>
								</Card>
							</div>

							<div className={classes.cardContainer}>
								<Card className={classes.card1}>
									<p style={{marginLeft: 5, fontSize: 12}}>Student</p>
								</Card>
								<Card className={classes.card2}>
									<p style={{marginLeft: 5, fontSize: 12}}>{item.firstName}</p>
								</Card>
							</div>

							<div className={classes.cardContainer}>
								<Card className={classes.card1}>
									<p style={{marginLeft: 5, fontSize: 12}}>Parent</p>
								</Card>
								<Card className={classes.card2}>
									<p style={{marginLeft: 5, fontSize: 12}}>{item.lastName}</p>
								</Card>
							</div>

							<div className={classes.cardContainer}>
								<Card className={classes.card1}>
									<p style={{marginLeft: 5, fontSize: 12}}>Classes Left / Due Date</p>
								</Card>
								<Card className={classes.card2}>
									<p style={{marginLeft: 5, fontSize: 12}}>
										{item.autoDemo && item.paidTill
											? momentTZ(item.paidTill).format("MMM DD, YYYY")
											: item.numberOfClassesBought}
									</p>
								</Card>
							</div>
							<div className={classes.cardContainer}>
								<Card className={classes.card1}>
									<p style={{marginLeft: 5, fontSize: 12}}>Timezone</p>
								</Card>
								<Card className={classes.card2}>
									<p style={{marginLeft: 5, fontSize: 12}}>{timeZoneLookup[item.timeZoneId]}</p>
								</Card>
							</div>
							<div className={classes.cardContainer}>
								<Card className={classes.card1}>
									<p style={{marginLeft: 5, fontSize: 12}}>User Id</p>
								</Card>
								<Card className={classes.card2}>
									<p style={{marginLeft: 5, fontSize: 12}}>{item.email}</p>
								</Card>
							</div>
							<div className={classes.cardContainer}>
								<Card className={classes.card1}>
									<p style={{marginLeft: 5, fontSize: 12}}>Whatsapp number</p>
								</Card>
								<Card className={classes.card2}>
									<div style={{display: "flex", alignItems: "center"}}>
										<Tooltip title={`Message ${item.firstName} on Whatsapp`}>
											<IconButton
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
											>
												<WhatsAppIcon style={{height: 20, width: 20}} />
											</IconButton>
										</Tooltip>
										<p style={{fontSize: 12}}>
											{item.countryCode} {item.whatsAppnumber}
										</p>
									</div>
								</Card>
							</div>

							<div
								className={classes.cardContainer}
								style={{display: "flex", alignItems: "center"}}
							>
								<p style={{fontSize: 16, flex: 0.4}}>Join</p>
								<Switch
									onChange={() => toggleJoinButton(item, i)}
									checked={item.isJoinButtonEnabledByAdmin}
									name="isJoinButtonEnabledByAdmin"
									inputProps={{"aria-label": "secondary checkbox"}}
								/>
							</div>
							<div
								className={classes.cardContainer}
								style={{display: "flex", alignItems: "center"}}
							>
								<p style={{fontSize: 16, flex: 0.4}}>New/Old</p>
								<Switch
									onChange={() => toggleNewOldButton(item, i)}
									checked={item?.autoDemo}
									name="autoDemo"
									inputProps={{"aria-label": "secondary checkbox"}}
								/>
							</div>
						</AccordionDetails>
					</Accordion>
				))}
		</div>
	)
}

export default StatisticsMobile
