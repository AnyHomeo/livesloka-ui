import React, {useState, useEffect, useMemo} from "react"

import {
	TextField,
	Select,
	MenuItem,
	Switch,
	InputLabel,
	FormControl,
	IconButton,
	Card,
	Dialog,
} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import moment from "moment"
import {getData, editCustomer, deleteUser} from "../../../Services/Services"
import {Edit, Trash, ArrowRightCircle} from "react-feather"
import StudentHistoryTable from "../../Admin/Crm/StudentsHistoryTable"
import Axios from "axios"
import useDocumentTitle from "../../../Components/useDocumentTitle"
import {useLocation} from "react-router-dom"
import {retrieveMeetingLink} from "../../../Services/utils"
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"

const useStyles = makeStyles(() => ({
	textLable: {
		marginBottom: "10px",
		marginTop: "10px",
	},
	divCon: {
		marginTop: "10px",
		marginBottom: "10px",
		width: "100%",
	},
	appBar: {
		position: "relative",
	},

	card1: {
		height: 50,
		width: "40%",
		display: "flex",
		alignItems: "center",
		marginBottom: 10,
		backgroundColor: "#2980b9",
		color: "white",
		borderRadius: 0,
		border: "1px solid #2980b9",
	},

	card2: {
		height: 50,
		width: "55%",
		display: "flex",
		alignItems: "center",
		marginBottom: 10,
		backgroundColor: "#ecf0f1",
		color: "black",
		border: "1px solid #2980b9",
		borderRadius: 0,
	},
	subText: {
		fontSize: 15,
		fontWeight: "bold",
		width: "100%",
		textAlign: "right",
		marginRight: 7,
	},
	subText1: {
		fontSize: 15,
		fontWeight: "bold",
		marginLeft: 5,
	},
}))
const CustomersDetailsMb = () => {
	useDocumentTitle("Customer Info")
	const {
		state: {data},
	} = useLocation()

	const classes = useStyles()

	const [classesIdDropdown, setClassesIdDropdown] = useState()
	const [timezoneDropdown, setTimezoneDropdown] = useState()
	const [classStatusDropDown, setClassStatusDropDown] = useState()
	const [currencyDropdown, setCurrencyDropdown] = useState()
	const [teacherDropdown, setTeacherDropdown] = useState()
	const [agentDropdown, setAgentDropdown] = useState()
	const [categoryDropdown, setCategoryDropdown] = useState()
	const [subjectDropdown, setSubjectDropdown] = useState()
	const [countryDropdown, setCountryDropdown] = useState()

	const [customersEditData, setCustomersEditData] = useState({})

	useEffect(() => {
		setCustomersEditData(data)
	}, [data])

	const fetchDropDown = async (name) => {
		try {
			const data = await getData(name)
			if (name === "Class") {
				setClassesIdDropdown(data && data.data.result)
			} else if (name === "Time Zone") {
				setTimezoneDropdown(data && data.data.result)
			} else if (name === "Class Status") {
				setClassStatusDropDown(data && data.data.result)
			} else if (name === "Currency") {
				setCurrencyDropdown(data && data.data.result)
			} else if (name === "Country") {
				setCountryDropdown(data && data.data.result)
			} else if (name === "Teacher") {
				setTeacherDropdown(data && data.data.result)
			} else if (name === "Agent") {
				setAgentDropdown(data && data.data.result)
			} else if (name === "Category") {
				setCategoryDropdown(data && data.data.result)
			} else if (name === "Subject") {
				setSubjectDropdown(data && data.data.result)
			}
		} catch (error) {
			console.log(error.response)
		}
	}
	useEffect(() => {
		fetchDropDown("Class")
		fetchDropDown("Time Zone")
		fetchDropDown("Class Status")
		fetchDropDown("Currency")
		fetchDropDown("Country")
		fetchDropDown("Teacher")
		fetchDropDown("Agent")
		fetchDropDown("Category")
		fetchDropDown("Subject")
	}, [])

	const handleFormValueChange = (e) => {
		setCustomersEditData({
			...customersEditData,
			[e.target.name]: e.target.value,
		})
	}
	const [disableEditButton, setDisableEditButton] = useState(true)

	const onCustomerUpdate = async () => {
		try {
			const res = await editCustomer({...customersEditData, _id: data._id})
			if (res.status === 200) {
				setDisableEditButton(true)
			}
		} catch (error) {
			console.log(error.response)
		}
	}

	const onUserDelete = async () => {
		try {
			const res = await deleteUser(data._id)
			if (res.status === 200) {
				window.open("/customer-data-mobile", "_self")
			}
		} catch (error) {
			console.log(error.response)
		}
	}

	const handleDropDownChange = (e) => {
		setCustomersEditData({
			...customersEditData,
			[e.target.name]: e.target.value,
		})
	}

	const copyToClipboard = (text) => {
		var textField = document.createElement("textarea")
		textField.innerText = text
		document.body.appendChild(textField)
		textField.select()
		document.execCommand("copy")
		textField.remove()
	}

	const [historyStudentData, setHistoryStudentData] = useState()
	const [historySelectedId, setHistorySelectedId] = useState("")
	const [historyOpen, setHistoryOpen] = useState(false)

	const studentsHistorytable = async (id) => {
		const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/class-history/${id}`)
		setHistoryStudentData(data)
		setHistorySelectedId(id)

		if (data.status === 200) {
			setHistoryOpen(true)
		}
	}

	const meetingLink = useMemo(() => {
		return retrieveMeetingLink(customersEditData)
	}, [customersEditData])

	console.log(customersEditData)
	return (
		<div
			style={{
				marginLeft: "10px",
				marginTop: "20px",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Card className={classes.card1}>
						<p className={classes.subText}>Join Button By Admin:</p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{customersEditData.isJoinButtonEnabledByAdmin ? "Enabled" : "Not enabled"}
							</p>
						) : (
							<Switch
								style={{
									position: "absolute",
									display: "flex",
									alignItems: "center",
									flex: 0.6,
								}}
								checked={customersEditData.isJoinButtonEnabledByAdmin}
								onChange={(e) => {
									e.persist()
									setCustomersEditData((prev) => {
										return {
											...prev,
											isJoinButtonEnabledByAdmin: e.target.checked,
										}
									})
								}}
								color="primary"
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							classStatusDropDown.forEach((data) => {
								if (data.id === customersEditData.classStatusId) {
									copyToClipboard(data.classStatusName)
								}
							})
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Card className={classes.card1}>
						<p className={classes.subText}>Class Status:</p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{classStatusDropDown &&
									classStatusDropDown.forEach((data) => {
										if (data.id === customersEditData.classStatusId) {
											return <span>{data.classStatusName}</span>
										}
									})}
							</p>
						) : (
							<FormControl variant="outlined" style={{minWidth: "100%"}}>
								<Select
									fullWidth
									value={customersEditData.classStatusId}
									disabled={disableEditButton}
									name="classStatusId"
									onChange={handleDropDownChange}
								>
									{classStatusDropDown &&
										classStatusDropDown.map((data) => (
											<MenuItem value={data.id}>{data.classStatusName}</MenuItem>
										))}
								</Select>
							</FormControl>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							classStatusDropDown.forEach((data) => {
								if (data.id === customersEditData.classStatusId) {
									copyToClipboard(data.classStatusName)
								}
							})
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>
				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}> Entry Date:</p>
					</Card>
					<Card className={classes.card2}>
						<p className={classes.subText1}>{moment(customersEditData.createdAt).format("l")}</p>
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.createdAt)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>
				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}> Timezone:</p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{timezoneDropdown &&
									timezoneDropdown.forEach((data) => {
										if (data.id === customersEditData.timeZoneId) {
											return <span>{data.timeZoneName}</span>
										}
									})}
							</p>
						) : (
							<FormControl variant="outlined" style={{minWidth: "100%"}}>
								<Select
									fullWidth
									variant="outlined"
									name="timeZoneId"
									value={customersEditData.timeZoneId}
									onChange={handleDropDownChange}
									disabled={disableEditButton}
								>
									{timezoneDropdown &&
										timezoneDropdown.map((data) => (
											<MenuItem value={data.id}>{data.timeZoneName}</MenuItem>
										))}
								</Select>
							</FormControl>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							timezoneDropdown.forEach((data) => {
								if (data.id === customersEditData.timeZoneId) {
									copyToClipboard(data.timeZoneName)
								}
							})
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}> Firstname:</p>
					</Card>{" "}
					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>{customersEditData.firstName}</p>
						) : (
							<TextField
								fullWidth
								variant="outlined"
								name="firstName"
								value={customersEditData.firstName}
								onChange={handleFormValueChange}
								InputProps={{
									readOnly: disableEditButton,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.firstName)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}> Requested Subject:</p>
					</Card>{" "}
					<Card className={classes.card2}>
						<div sytle={{display: "flex", flexDirection: "column"}}>
							{subjectDropdown &&
								subjectDropdown.map((data) => {
									return customersEditData.requestedSubjects.forEach((sub) => {
										if (data.id === sub) {
											return (
												<p
													style={{
														marginLeft: 5,
														fontWeight: "bold",
														fontSize: 13,
													}}
												>
													{data.subjectName}
												</p>
											)
										}
									})
								})}
						</div>
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.firstName)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}> Lastname:</p>
					</Card>{" "}
					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>{customersEditData.lastName}</p>
						) : (
							<TextField
								variant="outlined"
								fullWidth
								name="lastName"
								label="Guardian"
								onChange={handleFormValueChange}
								value={customersEditData.lastName}
								InputProps={{
									readOnly: disableEditButton,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.lastName)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}> No Of Classes:</p>
					</Card>{" "}
					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>{customersEditData.noOfClasses}</p>
						) : (
							<TextField
								label="No Of Classes"
								variant="outlined"
								fullWidth
								name="noOfClasses"
								onChange={handleFormValueChange}
								value={customersEditData.noOfClasses}
								InputProps={{
									readOnly: disableEditButton,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.noOfClasses)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div
					style={{display: "flex", flexDirection: "row", cursor: "pointer"}}
					onClick={() => studentsHistorytable(customersEditData._id)}
				>
					<Card className={classes.card1}>
						<p className={classes.subText}> Classes Left: </p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>{customersEditData.numberOfClassesBought}</p>
						) : (
							<TextField
								label="Classes Left"
								variant="outlined"
								fullWidth
								name="numberOfClassesBought"
								onChange={handleFormValueChange}
								value={customersEditData.numberOfClassesBought}
								InputProps={{
									readOnly: true,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.numberOfClassesBought)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Gender: </p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>{customersEditData.gender}</p>
						) : (
							<TextField
								label="Gender"
								variant="outlined"
								fullWidth
								name="gender"
								onChange={handleFormValueChange}
								value={customersEditData.gender}
								InputProps={{
									readOnly: disableEditButton,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.gender)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Due Date: </p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{customersEditData.paidTill
									? moment(customersEditData.paidTill).format("MMM DD, yyyy")
									: ""}
							</p>
						) : (
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<DatePicker
									label="Basic example"
									value={customersEditData.paidTill}
									onChange={(e) => {
										setCustomersEditData({
											...customersEditData,
											["paidTill"]: e,
										})
									}}
									animateYearScrolling
								/>
							</MuiPickersUtilsProvider>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.gender)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Class Name:</p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{classesIdDropdown &&
									classesIdDropdown.forEach((data) => {
										if (data.id === customersEditData.classId) {
											return <span>{data.className}</span>
										}
									})}
							</p>
						) : (
							<FormControl variant="outlined" style={{minWidth: "100%"}}>
								<Select
									label="Class Name"
									name="classId"
									fullWidth
									variant="outlined"
									value={customersEditData.classId}
									disabled={disableEditButton}
									onChange={handleDropDownChange}
								>
									{classesIdDropdown &&
										classesIdDropdown.map((data) => (
											<MenuItem value={data.id}>{data.className}</MenuItem>
										))}
								</Select>
							</FormControl>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							classesIdDropdown &&
								classesIdDropdown.forEach((data) => {
									if (data.id === customersEditData.classId) {
										copyToClipboard(data.className)
									}
								})
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Subject:</p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{subjectDropdown &&
									subjectDropdown.forEach((data) => {
										if (data.id === customersEditData.subjectId) {
											return <span>{data.subjectName}</span>
										}
									})}
							</p>
						) : (
							<FormControl variant="outlined" style={{minWidth: "100%"}}>
								<Select
									label="Subject"
									fullWidth
									variant="outlined"
									disabled={disableEditButton}
									name="subjectId"
									value={customersEditData.subjectId}
									onChange={handleDropDownChange}
									// onChange={handleChange}
								>
									{subjectDropdown &&
										subjectDropdown.map((data) => (
											<MenuItem value={data.id}>{data.subjectName}</MenuItem>
										))}
								</Select>
							</FormControl>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							subjectDropdown &&
								subjectDropdown.forEach((data) => {
									if (data.id === customersEditData.subjectId) {
										copyToClipboard(data.subjectName)
									}
								})
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Email:</p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>{customersEditData.email}</p>
						) : (
							<TextField
								label="Email"
								variant="outlined"
								fullWidth
								name="email"
								onChange={handleFormValueChange}
								value={customersEditData.email}
								InputProps={{
									readOnly: disableEditButton,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.email)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Whatsapp No:</p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>{customersEditData.whatsAppnumber}</p>
						) : (
							<TextField
								label="Whatsapp Number"
								variant="outlined"
								fullWidth
								name="whatsAppnumber"
								onChange={handleFormValueChange}
								value={customersEditData.whatsAppnumber}
								InputProps={{
									readOnly: disableEditButton,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.whatsAppnumber)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Teacher:</p>
					</Card>{" "}
					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{teacherDropdown &&
									teacherDropdown.forEach((data) => {
										if (data.id === customersEditData.teacherId) {
											return <span>{data.TeacherName}</span>
										}
									})}
							</p>
						) : (
							<FormControl variant="outlined" style={{minWidth: "100%"}}>
								<Select
									label="Teacher"
									fullWidth
									variant="outlined"
									value={customersEditData.teacherId}
									disabled={disableEditButton}
									name="teacherId"
									onChange={handleDropDownChange}
									// onChange={handleChange}
								>
									{teacherDropdown &&
										teacherDropdown.map((data) => (
											<MenuItem value={data.id}>{data.TeacherName}</MenuItem>
										))}
								</Select>
							</FormControl>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							teacherDropdown &&
								teacherDropdown.forEach((data) => {
									if (data.id === customersEditData.teacherId) {
										copyToClipboard(data.TeacherName)
									}
								})
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Country:</p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{countryDropdown &&
									countryDropdown.forEach((data) => {
										if (data.id === customersEditData.countryId) {
											return <span>{data.countryName}</span>
										}
									})}
							</p>
						) : (
							<FormControl variant="outlined" style={{minWidth: "100%"}}>
								<Select
									label="Country"
									fullWidth
									variant="outlined"
									value={customersEditData.countryId}
									disabled={disableEditButton}
									name="countryId"
									onChange={handleDropDownChange}
								>
									{countryDropdown &&
										countryDropdown.map((data) => (
											<MenuItem value={data.id}>{data.countryName}</MenuItem>
										))}
								</Select>
							</FormControl>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							countryDropdown &&
								countryDropdown.forEach((data) => {
									if (data.id === customersEditData.countryId) {
										copyToClipboard(data.countryName)
									}
								})
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>No Of Students: </p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>{customersEditData.numberOfStudents}</p>
						) : (
							<TextField
								label="No Of Students"
								variant="outlined"
								fullWidth
								name="numberOfStudents"
								onChange={handleFormValueChange}
								value={customersEditData.numberOfStudents}
								InputProps={{
									readOnly: disableEditButton,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.numberOfStudents)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Amount:</p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>{customersEditData.proposedAmount}</p>
						) : (
							<TextField
								label="Proposed Amount"
								variant="outlined"
								fullWidth
								name="proposedAmount"
								onChange={handleFormValueChange}
								value={customersEditData.proposedAmount}
								InputProps={{
									readOnly: disableEditButton,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.proposedAmount)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Currency:</p>
					</Card>

					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{currencyDropdown &&
									currencyDropdown.forEach((data) => {
										if (data.id === customersEditData.proposedCurrencyId) {
											return <span>{data.currencyName}</span>
										}
									})}
							</p>
						) : (
							<FormControl variant="outlined" style={{minWidth: "100%"}}>
								<Select
									label="Currency"
									fullWidth
									variant="outlined"
									disabled={disableEditButton}
									value={customersEditData.proposedCurrencyId}
									name="proposedCurrencyId"
									onChange={handleDropDownChange}
								>
									{currencyDropdown &&
										currencyDropdown.map((data) => (
											<MenuItem value={data.id}>{data.currencyName}</MenuItem>
										))}
								</Select>
							</FormControl>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							currencyDropdown &&
								currencyDropdown.forEach((data) => {
									if (data.id === customersEditData.proposedCurrencyId) {
										copyToClipboard(data.currencyName)
									}
								})
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Agent:</p>
					</Card>{" "}
					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{agentDropdown &&
									agentDropdown.forEach((data) => {
										if (data.id === customersEditData.agentId) {
											return <span>{data.AgentName}</span>
										}
									})}
							</p>
						) : (
							<FormControl variant="outlined" style={{minWidth: "100%"}}>
								<Select
									label="Agent"
									fullWidth
									variant="outlined"
									name="agentId"
									value={customersEditData.agentId}
									onChange={handleDropDownChange}
									disabled={disableEditButton}
									// onChange={handleChange}
								>
									{agentDropdown &&
										agentDropdown.map((data) => (
											<MenuItem value={data.id}>{data.AgentName}</MenuItem>
										))}
								</Select>
							</FormControl>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							agentDropdown &&
								agentDropdown.forEach((data) => {
									if (data.id === customersEditData.agentId) {
										copyToClipboard(data.AgentName)
									}
								})
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Schedule Des:</p>
					</Card>
					<Card className={classes.card2}>
						{disableEditButton ? (
							<p style={{marginLeft: 5, fontWeight: "bold", fontSize: 10}}>
								{customersEditData.scheduleDescription}
							</p>
						) : (
							<TextField
								label="Schedule Des"
								variant="outlined"
								fullWidth
								name="scheduleDescription"
								onChange={handleFormValueChange}
								value={customersEditData.scheduleDescription}
								InputProps={{
									readOnly: disableEditButton,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(customersEditData.scheduleDescription)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Agent:</p>
					</Card>
					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText1}>
								{categoryDropdown &&
									categoryDropdown.forEach((data) => {
										if (data.id === customersEditData.categoryId) {
											return <span>{data.categoryName}</span>
										}
									})}
							</p>
						) : (
							<FormControl variant="outlined" style={{minWidth: "100%"}}>
								<InputLabel id="demo-simple-select-filled-label">Category:</InputLabel>
								<Select
									label="Category Name"
									fullWidth
									variant="outlined"
									name="categoryId"
									value={customersEditData.categoryId}
									onChange={handleDropDownChange}
									disabled={disableEditButton}
									// onChange={handleChange}
								>
									{categoryDropdown &&
										categoryDropdown.map((data) => (
											<MenuItem value={data.id}>{data.categoryName}</MenuItem>
										))}
								</Select>
							</FormControl>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							categoryDropdown &&
								categoryDropdown.forEach((data) => {
									if (data.id === customersEditData.categoryId) {
										copyToClipboard(data.categoryName)
									}
								})
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>

				<div style={{display: "flex", flexDirection: "row"}}>
					<Card className={classes.card1}>
						<p className={classes.subText}>Meeting Link:</p>
					</Card>{" "}
					<Card className={classes.card2}>
						{disableEditButton ? (
							<p className={classes.subText}>{meetingLink}</p>
						) : (
							<TextField
								label="Meeting Link"
								variant="outlined"
								fullWidth
								name="meetingLink"
								onChange={handleFormValueChange}
								value={meetingLink}
								InputProps={{
									readOnly: true,
								}}
							/>
						)}
					</Card>
					<IconButton
						style={{marginTop: -15}}
						onClick={() => {
							copyToClipboard(meetingLink)
						}}
					>
						<FileCopyIcon />
					</IconButton>
				</div>
			</>

			<div style={{textAlign: "right"}}>
				{disableEditButton ? (
					<IconButton onClick={() => setDisableEditButton(false)}>
						<Edit style={{fontSize: 24}} />
					</IconButton>
				) : (
					<IconButton onClick={onCustomerUpdate}>
						<ArrowRightCircle style={{fontSize: 24}} />
					</IconButton>
				)}

				<IconButton onClick={onUserDelete}>
					<Trash style={{fontSize: 24}} />
				</IconButton>
			</div>

			{historyStudentData && (
				<Dialog open={historyOpen} fullWidth onClose={() => setHistoryOpen(false)}>
					<StudentHistoryTable
						data={historyStudentData}
						id={historySelectedId}
						setHistoryOpen={setHistoryOpen}
					/>
				</Dialog>
			)}
		</div>
	)
}

export default CustomersDetailsMb
