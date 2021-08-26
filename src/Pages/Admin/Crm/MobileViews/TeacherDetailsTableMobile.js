import React, {useEffect, useState} from "react"
import {makeStyles} from "@material-ui/core/styles"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import {
	Card,
	IconButton,
	TextField,
	Switch,
	FormControl,
	Select,
	MenuItem,
} from "@material-ui/core"
import {Edit, Trash2, ArrowRightCircle, XCircle} from "react-feather"
import {editField} from "../../../../Services/Services"

const useStyles = makeStyles((theme) => ({
	root: {
		width: "95%",
		margin: "0 auto",
		marginTop: 5,
		marginBottom: 5,
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
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
		marginTop: 10,
		marginBottom: 10,
		fontSize: 14,
		fontWeight: "bold",
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
	subInfo: {
		opacity: 0.8,
	},

	cardContainer: {
		display: "flex",
		flexDirection: "row",
		flexGrow: 1,
		flex: 1,
		marginTop: 6,
		marginBottom: 6,
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
}))

const TeacherDetailsTableMobile = ({data, categoryData, statusData, getbackdata}) => {
	const classes = useStyles()
	const [editOption, setEditOption] = useState(false)

	function capitalize(word) {
		return word.charAt(0).toUpperCase() + word.substring(1)
	}

	function humanReadable(name) {
		var words = name.match(/[A-Za-z][^_\-A-Z]*|[0-9]+/g) || []
		return words.map(capitalize).join(" ")
	}

	const [textFieldData, setTextFieldData] = useState()

	useEffect(() => {
		setTextFieldData(data)
		setTextFieldData((prev) => {
			return {
				...prev,
				isDemoIncludedInSalaries:
					data.isDemoIncludedInSalaries === "" ? false : data.isDemoIncludedInSalaries,
			}
		})
	}, [data])

	const updateData = async () => {
		const res = await editField(`Update Teacher`, textFieldData)

		if (res.status === 200) {
			getbackdata(res.status)
			setEditOption(false)
		}
	}

	return (
		<div className={classes.root}>
			{data && (
				<Accordion>
					<AccordionSummary
						classes={{content: classes.content, expanded: classes.expanded}}
						expandIcon={<ExpandMoreIcon />}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<Typography className={classes.heading}>{data?.TeacherName}</Typography>
						</div>
					</AccordionSummary>
					<AccordionDetails>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100%",
							}}
						>
							{Object.keys(data).map((k, i) => {
								if (humanReadable(k) === "Id") {
									return null
								}

								if (humanReadable(k) === "Id") {
									return null
								}

								if (humanReadable(k) === "Teacher Image Link") {
									return null
								}

								if (humanReadable(k) === "Category") {
									return (
										<div key={i} className={classes.cardContainer}>
											<Card className={classes.card1}>
												<p style={{marginLeft: 5, fontSize: 12}}>{humanReadable(k)}</p>
											</Card>
											{editOption ? (
												<>
													<FormControl size="small" variant="outlined" className={classes.editText}>
														<Select
															style={{minWidth: "100%"}}
															value={textFieldData[k]}
															onChange={(e) => {
																e.persist()
																setTextFieldData((prev) => {
																	return {
																		...prev,
																		[k]: e.target.value,
																	}
																})
															}}
														>
															{categoryData &&
																categoryData?.data?.result?.map((cat) => {
																	return <MenuItem value={cat.id}>{cat.categoryName}</MenuItem>
																})}
														</Select>
													</FormControl>
												</>
											) : (
												<Card className={classes.card2}>
													{categoryData &&
														categoryData?.data?.result?.map((cat) => {
															if (cat.id === data.category) {
																return (
																	<p style={{marginLeft: 5, fontSize: 12}}>{cat.categoryName}</p>
																)
															}
														})}
												</Card>
											)}
										</div>
									)
								}

								if (humanReadable(k) === "Teacher Status") {
									return (
										<div key={i} className={classes.cardContainer}>
											<Card className={classes.card1}>
												<p style={{marginLeft: 5, fontSize: 12}}>{humanReadable(k)}</p>
											</Card>
											{editOption ? (
												<>
													<FormControl size="small" variant="outlined" className={classes.editText}>
														<Select
															style={{minWidth: "100%"}}
															value={textFieldData[k]}
															onChange={(e) => {
																e.persist()
																setTextFieldData((prev) => {
																	return {
																		...prev,
																		[k]: e.target.value,
																	}
																})
															}}
														>
															{statusData &&
																statusData?.data?.result?.map((cat) => {
																	return <MenuItem value={cat.statusId}>{cat.statusName}</MenuItem>
																})}
														</Select>
													</FormControl>
												</>
											) : (
												<Card className={classes.card2}>
													{statusData &&
														statusData?.data?.result?.map((cat) => {
															if (cat.statusId === data.TeacherStatus) {
																return <p style={{marginLeft: 5, fontSize: 12}}>{cat.statusName}</p>
															}
														})}
												</Card>
											)}
										</div>
									)
								}

								if (humanReadable(k) === "Is Demo Included In Salaries") {
									return (
										<div key={i} className={classes.cardContainer}>
											<Card className={classes.card1} style={{flex: editOption ? 0.48 : 0.4}}>
												<p style={{marginLeft: 5, fontSize: 12}}>{humanReadable(k)}</p>
											</Card>
											{editOption ? (
												<div>
													<Switch
														style={{
															position: "absolute",
															display: "flex",
															alignItems: "center",
															flex: 0.6,
														}}
														checked={textFieldData[k]}
														onChange={(e) => {
															e.persist()
															setTextFieldData((prev) => {
																return {
																	...prev,
																	[k]: e.target.checked,
																}
															})
														}}
														color="primary"
													/>
												</div>
											) : (
												<Card className={classes.card2}>
													<p style={{marginLeft: 5, fontSize: 12}}>{data[k] ? "Yes" : "NO"}</p>
												</Card>
											)}
										</div>
									)
								}

								return (
									<div key={i} className={classes.cardContainer}>
										<Card className={classes.card1}>
											<p style={{marginLeft: 5, fontSize: 12}}>{humanReadable(k)}</p>
										</Card>
										{editOption ? (
											<>
												<TextField
													size="small"
													variant="outlined"
													className={classes.editText}
													onChange={(e) => {
														e.persist()
														setTextFieldData((prev) => {
															return {
																...prev,
																[k]: e.target.value,
															}
														})
													}}
													value={textFieldData[k]}
												/>
											</>
										) : (
											<Card className={classes.card2}>
												<p style={{marginLeft: 5, fontSize: 12}}>{data[k]}</p>
											</Card>
										)}
									</div>
								)
							})}
							<div>
								{editOption ? (
									<>
										<IconButton onClick={updateData}>
											<ArrowRightCircle style={{color: "#2ecc71"}} />
										</IconButton>
										<IconButton onClick={() => setEditOption(!editOption)}>
											<XCircle />
										</IconButton>
									</>
								) : (
									<IconButton onClick={() => setEditOption(!editOption)}>
										<Edit style={{marginRight: 10, color: "#34495e"}} />
									</IconButton>
								)}

								<IconButton>
									<Trash2 style={{color: "#e74c3c"}} />
								</IconButton>
							</div>
						</div>
					</AccordionDetails>
				</Accordion>
			)}
		</div>
	)
}

export default TeacherDetailsTableMobile
