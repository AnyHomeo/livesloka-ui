import React, {useState, useEffect, useRef} from "react"
import "./GroupSidebar.css"
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Box,
	Chip,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	makeStyles,
	Menu,
	MenuItem,
	TextField,
} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"

import MoreVertIcon from "@material-ui/icons/MoreVert"
import {ArrowBack, Edit, ExpandMore, Folder, SearchOutlined} from "@material-ui/icons"
import GroupSidebarChat from "./GroupSidebarChat"
import axios from "axios"
import {isAutheticated} from "../../../auth"
import {io} from "socket.io-client"
import {useHistory} from "react-router"
import TransferList from "./NewGroup"
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step"
import StepLabel from "@material-ui/core/StepLabel"
import Typography from "@material-ui/core/Typography"
import {v4 as uuidv4} from "uuid"
import {toast} from "react-toastify"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"

let socket
function Sidebar() {
	const useStyles = makeStyles({
		dialogPaper: {
			minHeight: "70vh",
			minWidth: "70vw",
		},
	})
	const classes = useStyles()
	const [allGroups, setAllGroups] = useState([])

	const [groups, setGroups] = useState([])
	const [shouldEdit, setShouldEdit] = useState(true)
	const [editGroupID, setEditGroupID] = useState(null)

	const getRole = isAutheticated().roleId
	const getUserID = isAutheticated().userId

	const [group, SetGroup] = useState("")
	const [customers, setCustomers] = useState([])
	const [agents, setAgents] = useState([])
	const [teachers, setTeachers] = useState([])

	const [customer, setCustomer] = useState([])
	const [agent, setAgent] = useState([])
	const [teacher, setTeacher] = useState([])
	const [reload, setReload] = useState(false)

	const history = useHistory()
	const [anchorEl, setAnchorEl] = useState(null)
	const [open, setOpen] = React.useState(false)

	const [loading, setLoading] = useState(false)

	const [groupSearch, setGroupSearch] = useState("")

	const handleClickOpen = () => {
		setOpen(true)
		handleCloseMenu()
	}

	const handelClickClose = () => {
		setOpen(false)
	}

	const handleOpenMenu = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleCloseMenu = () => {
		setAnchorEl(null)
	}

	const dataFromChild = (data, type) => {
		if (type === "agent") {
			setAgent(data)
		} else if (type === "customer") {
			setCustomer(data)
		} else if (type === "teacher") {
			setTeacher(data)
		}
	}

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)

		axios.get(`${process.env.REACT_APP_API_KEY}/allusers`).then(({data}) => {
			// const customers = data.reduce(
			// 	(a, o) => (
			// 		o.roleId === 1 && (o.username ? a.push(o.username) : a.push(o.userId.split("@")[0])[0]), a
			// 	),
			// 	[]
			// )
			// const customers = data.reduce(
			// 	(a, o) => (o.roleId === 1 && a.push(`${o.username}@${o.userId.split("@")[0]}`), a),
			// 	[]
			// )
			const teachers = data.reduce(
				(a, o) => (o.roleId === 2 && a.push(`${o.username}|${o.userId}`), a),
				[]
			)
			const agents = data.reduce(
				(a, o) => ((o.roleId === 4 || o.roleId === 5) && a.push(`${o.username}|${o.userId}`), a),
				[]
			)

			setTeachers(teachers)
			setAgents(agents)

			axios.get(`${process.env.REACT_APP_API_KEY}/findInClassCustomers`).then(({data}) => {
				const customers = data.reduce((a, o) => (a.push(`${o.firstName}|${o.email}`), a), [])

				setCustomers(customers)
				setLoading(false)
			})
		})

		return removeListners
	}, [])

	useEffect(() => {
		console.log("reloading")
		if (getRole === 3) {
			axios.get(`${process.env.REACT_APP_API_KEY}/allgroups`).then(({data}) => {
				console.log(data)

				setGroups(data)
				setAllGroups(data)
			})
		} else {
			axios
				.get(`${process.env.REACT_APP_API_KEY}/groupByRole/${getRole}/${getUserID}`)
				.then(({data}) => {
					console.log(data)

					setGroups(data)
					setAllGroups(data)
				})
		}
	}, [reload])
	const removeListners = () => {
		socket.removeAllListeners()
	}
	const [activeStep, setActiveStep] = React.useState(0)
	const steps = getSteps()

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1)
	}

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1)
	}

	const handleReset = () => {
		setActiveStep(0)
	}

	const createGroup = () => {
		axios
			.post(`${process.env.REACT_APP_API_KEY}/create-group`, {
				customer,
				agent,
				teacher,
				groupName: group,
				groupID: uuidv4(),
			})
			.then(({data}) => {
				toast.success(`${group} created Sucessfully 🎉`, {
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				})
				console.log(data)
				setReload(!reload)
				setShouldEdit(true)
			})
			.catch((err) => {
				console.log(err)
			})
		handelClickClose()
	}
	const updateGroup = () => {
		axios
			.post(`${process.env.REACT_APP_API_KEY}/update-group`, {
				customer,
				agent,
				teacher,
				groupName: group,
				groupID: editGroupID,
			})
			.then(({data}) => {
				console.log(data)
				toast.success(`${group} updated Sucessfully 🎉🎉`, {
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				})
				setReload(!reload)
				setEditGroupID(null)
			})
			.catch((err) => {
				toast.error(`${group} failed to update`, {
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				})
			})

		handelClickClose()
	}

	useEffect(() => {
		return () => {
			setEditGroupID(null)
			resetState()
		}
	}, [shouldEdit])

	const resetState = () => {
		setEditGroupID(null)
		setCustomer([])
		setAgent([])
		setTeacher([])
		SetGroup("")
		handleReset()
	}

	const editGroup = (gid) => {
		axios.get(`${process.env.REACT_APP_API_KEY}/groupInfo/${gid}`).then(({data}) => {
			console.log(data)
			if (data) {
				const {agents, customers, teachers, groupName} = data
				setEditGroupID(gid)
				setCustomer(customers)
				setAgent(agents)
				setTeacher(teachers)
				SetGroup(groupName)
				setActiveStep(3)
			}
		})
	}

	const handelGroup = (e) => {
		SetGroup(e.target.value)
	}

	const handelSearch = (e) => {
		const value = e.target.value.toLowerCase().trim()
		const copyGroups = [...allGroups].filter((group) =>
			group.groupName.toLowerCase().includes(value)
		)
		setGroups(copyGroups)
		setGroupSearch(value)
	}
	return (
		<div className="sidebar">
			<div className="sidebar_header">
				<div className="sidebar_headerRight">
					<Chip
						avatar={<Avatar>R</Avatar>}
						label="Room"
						onClick={() => {
							history.push("/room")
						}}
					/>
					<Chip
						avatar={<Avatar>N</Avatar>}
						label="NonRoom"
						onClick={() => {
							history.push("/nonroom")
						}}
					/>
					<Chip
						avatar={<Avatar>N</Avatar>}
						label="Group"
						color="primary"
						onClick={() => {
							history.push("/group")
						}}
					/>
					{getRole === 3 && (
						<div>
							<IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleOpenMenu}>
								<MoreVertIcon />
							</IconButton>

							<Menu
								id="simple-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleCloseMenu}
							>
								<MenuItem onClick={handleClickOpen}>Edit Groups</MenuItem>
							</Menu>
						</div>
					)}
				</div>
			</div>
			<div>
				<Dialog
					open={open}
					onClose={handelClickClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					classes={{paper: classes.dialogPaper}}
				>
					<DialogTitle id="alert-dialog-title">{shouldEdit ? "Edit" : "Create"} Group</DialogTitle>

					<Box
						style={{
							position: "absolute",
							right: 0,
							padding: "10px",
						}}
					>
						{shouldEdit ? (
							!editGroupID && (
								<Button
									variant="contained"
									color="primary"
									onClick={() => {
										setShouldEdit(false)
										setEditGroupID(null)
									}}
								>
									Create Group
								</Button>
							)
						) : (
							<Button
								variant="contained"
								color="primary"
								onClick={() => {
									setShouldEdit(true)
								}}
							>
								Edit Group
							</Button>
						)}
					</Box>

					<DialogContent>
						{!shouldEdit ? (
							<Box textAlign="center">
								<TextField
									id="outlined-basic"
									label="Group Name"
									variant="outlined"
									value={group}
									onChange={handelGroup}
								/>
								<Box marginTop="10px">
									{!loading && (
										<div>
											<Stepper activeStep={activeStep} alternativeLabel>
												{steps.map((label) => (
													<Step key={label}>
														<StepLabel>{label}</StepLabel>
													</Step>
												))}
											</Stepper>
											<div>
												{activeStep === steps.length ? (
													<div>
														<Typography>All Steps Done</Typography>
														<Button onClick={handleReset}>Edit</Button>
													</div>
												) : (
													<div>
														{activeStep === 0 && (
															<TransferList
																toRoom={teachers}
																inRoom={teacher}
																dataToParent={dataFromChild}
																type="teacher"
															/>
														)}
														{activeStep === 1 && (
															<TransferList
																toRoom={agents}
																inRoom={agent}
																dataToParent={dataFromChild}
																type="agent"
															/>
														)}
														{activeStep === 2 && (
															<TransferList
																toRoom={customers}
																inRoom={customer}
																dataToParent={dataFromChild}
																type="customer"
															/>
														)}

														<div
															style={{
																marginTop: 15,
															}}
														>
															<Button disabled={activeStep === 0} onClick={handleBack}>
																Back
															</Button>
															<Button variant="contained" color="primary" onClick={handleNext}>
																{activeStep === steps.length - 1 ? "Finish" : "Next"}
															</Button>
														</div>
													</div>
												)}
											</div>
										</div>
									)}
								</Box>
							</Box>
						) : !editGroupID ? (
							<Grid container spacing={2}>
								<Grid
									item
									xs={12}
									style={{
										display: "flex",
										width: "100%",
										justifyContent: "center",
									}}
								>
									<TextField
										type="search"
										label="Search Group"
										variant="outlined"
										onChange={handelSearch}
										value={groupSearch}
									/>
								</Grid>
								<Grid item xs={12}>
									<div className={classes.demo}>
										<List>
											{groups.map((group) => (
												<ListItem key={group.groupID}>
													{/* <ListItemAvatar>
														<Avatar>
															{group.groupName
																.toUpperCase()
																.split(" ")
																.map((el) => el[0])}
														</Avatar>
													</ListItemAvatar>{" "} */}
													<Accordion
														style={{
															width: "100%",
														}}
													>
														<AccordionSummary
															expandIcon={<ExpandMore />}
															aria-controls="panel1a-content"
															id="panel1a-header"
														>
															<Typography className={""}>{group.groupName}</Typography>
														</AccordionSummary>
														<AccordionDetails
															style={{
																maxHeight: "30vh",
																overflow: "auto",
															}}
														>
															{group.agents.length > 0 && (
																<Table className={classes.table} size="small">
																	<TableHead
																		style={{
																			backgroundColor: "#222831",
																		}}
																	>
																		<TableRow>
																			<TableCell
																				align="center"
																				style={{
																					color: "#fff",
																				}}
																			>
																				Agents
																			</TableCell>
																		</TableRow>
																	</TableHead>
																	<TableBody>
																		<TableRow>
																			<TableCell>
																				{group.agents
																					.map((el) => el.split("|")[0])
																					.join(", ")
																					.toString()}
																			</TableCell>
																		</TableRow>
																	</TableBody>
																</Table>
															)}
															{group.teachers.length > 0 && (
																<Table className={classes.table} size="small">
																	<TableHead
																		style={{
																			backgroundColor: "#222831",
																		}}
																	>
																		<TableRow>
																			<TableCell
																				align="center"
																				style={{
																					color: "#fff",
																				}}
																			>
																				Teachers
																			</TableCell>
																		</TableRow>
																	</TableHead>
																	<TableBody>
																		<TableRow>
																			<TableCell>
																				{group.teachers
																					.map((el) => el.split("|")[0])
																					.join(", ")
																					.toString()}
																			</TableCell>
																		</TableRow>
																	</TableBody>
																</Table>
															)}

															{group.customers.length > 0 && (
																<Table className={classes.table} size="small">
																	<TableHead
																		style={{
																			backgroundColor: "#222831",
																		}}
																	>
																		<TableRow>
																			<TableCell
																				align="center"
																				style={{
																					color: "#fff",
																				}}
																			>
																				Customers
																			</TableCell>
																		</TableRow>
																	</TableHead>
																	<TableBody>
																		<TableRow>
																			<TableCell>
																				{group.customers
																					.map((el) => el.split("|")[0])
																					.join(", ")
																					.toString()}
																			</TableCell>
																		</TableRow>
																	</TableBody>
																</Table>
															)}

															{/* <Table className={classes.table} size="small">
																<TableHead>
																	<TableRow>
																		<TableCell>Type</TableCell>
																		<TableCell>Names</TableCell>
																	</TableRow>
																</TableHead>
																<TableBody>
																	<TableRow>
																		{group.customers.length > 0 && (
																			<>
																				<TableCell>Customers</TableCell>

																				<TableCell>
																					{group.customers
																						.map((el) => el.split("@")[0])
																						.join(", ")
																						.toString()}
																				</TableCell>
																			</>
																		)}
																	</TableRow>
																	<TableRow>
																		{group.agents.length > 0 && (
																			<>
																				<TableCell>Agents</TableCell>
																				<TableCell>
																					{group.agents
																						.map((el) => el.split("@")[0])
																						.join(", ")
																						.toString()}
																				</TableCell>
																			</>
																		)}
																	</TableRow>
																	<TableRow>
																		{group.teachers.length > 0 && (
																			<>
																				<TableCell>Teachers</TableCell>

																				<TableCell>
																					{group.teachers
																						.map((el) => el.split("@")[0])
																						.join(", ")
																						.toString()}
																				</TableCell>
																			</>
																		)}
																	</TableRow>
																</TableBody>
															</Table> */}
														</AccordionDetails>
													</Accordion>
													<IconButton onClick={() => editGroup(group.groupID)}>
														<Edit />
													</IconButton>
												</ListItem>
											))}
										</List>
									</div>
								</Grid>
							</Grid>
						) : (
							<Box textAlign="center">
								<Box display="flex" justifyContent="center">
									<IconButton aria-label="delete" className={classes.margin} onClick={resetState}>
										<ArrowBack fontSize="large" />
									</IconButton>{" "}
									<TextField
										style={{
											margin: "auto",
										}}
										id="outlined-basic"
										label="Group Name"
										variant="outlined"
										value={group}
										onChange={handelGroup}
									/>
								</Box>
								<Box marginTop="10px">
									{!loading && (
										<div>
											<Stepper activeStep={activeStep} alternativeLabel>
												{steps.map((label) => (
													<Step key={label}>
														<StepLabel>{label}</StepLabel>
													</Step>
												))}
											</Stepper>
											<div>
												{activeStep === steps.length ? (
													<div>
														<Typography>All Steps Done</Typography>
														<Button onClick={handleReset}>Edit</Button>
													</div>
												) : (
													<div>
														{activeStep === 0 && (
															<TransferList
																toRoom={teachers}
																inRoom={teacher}
																dataToParent={dataFromChild}
																type="teacher"
															/>
														)}
														{activeStep === 1 && (
															<TransferList
																toRoom={agents}
																inRoom={agent}
																dataToParent={dataFromChild}
																type="agent"
															/>
														)}
														{activeStep === 2 && (
															<TransferList
																toRoom={customers}
																inRoom={customer}
																dataToParent={dataFromChild}
																type="customer"
															/>
														)}

														<div
															style={{
																marginTop: 15,
															}}
														>
															<Button disabled={activeStep === 0} onClick={handleBack}>
																Back
															</Button>
															<Button variant="contained" color="primary" onClick={handleNext}>
																{activeStep === steps.length - 1 ? "Finish" : "Next"}
															</Button>
														</div>
													</div>
												)}
											</div>
										</div>
									)}
								</Box>
							</Box>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={handelClickClose} color="secondary">
							Cancel
						</Button>
						{shouldEdit ? (
							<Button onClick={updateGroup} color="primary" disabled={!group}>
								Update Group
							</Button>
						) : (
							<Button onClick={createGroup} color="primary" disabled={!group}>
								Create Group
							</Button>
						)}
					</DialogActions>
				</Dialog>
			</div>

			<div className="sidebar_search">
				<div className="sidebar_searchContainer">
					<SearchOutlined />

					<input
						type="search"
						id="chat_search"
						placeholder="Search or start new chat"
						onChange={handelSearch}
						value={groupSearch}
						style={{
							width: "80%",
						}}
					/>
				</div>
			</div>
			<div className="sidebar_chats">
				{groups.map((group) => (
					<GroupSidebarChat key={group.groupID} id={group.groupID} name={group.groupName} />
				))}
			</div>
		</div>
	)
}

export default Sidebar

function getSteps() {
	return ["Add Teachers", "Add Agents", "Add Customers"]
}
