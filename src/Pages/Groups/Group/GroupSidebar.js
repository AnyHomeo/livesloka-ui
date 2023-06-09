import React, {useState, useEffect, useMemo} from "react"
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Box,
	Chip,
	Grid,
	IconButton,
	List,
	ListItem,
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
import {toast} from "react-toastify"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"

let socket
const Sidebar = React.memo(() => {
	console.log("sidebar rerendering")

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
	const [activeStep, setActiveStep] = React.useState(0)

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
		console.log(data)
		if (type === "agent") {
			setAgent(data)
		} else if (type === "customer") {
			setCustomer(data)
		} else if (type === "teacher") {
			setTeacher(data)
		}
	}

	useEffect(() => {
		// socket = io.connect(process.env.REACT_APP_API_KEY)

		axios.get(`${process.env.REACT_APP_API_KEY}/allusers`).then(({data}) => {
			const {customers, rest} = data
			const teachers = rest.filter((el) => el.roleId === 2)
			const agents = rest.filter((el) => el.roleId === 4 || el.roleId === 5)
			const customersD = customers.map((el) => {
				return {
					...el,
					username: el.firstName,
				}
			})

			setTeachers(teachers)
			setAgents(agents)
			setCustomers(customersD)
			setLoading(false)
		})

		// return removeListners
	}, [])

	useEffect(() => {
		console.log("reloading and changing group")
		if (getRole === 3) {
			axios.get(`${process.env.REACT_APP_API_KEY}/allgroups`).then(({data}) => {
				// console.log(data)

				setGroups(data)
				setAllGroups(data)
			})
		} else {
			axios
				.get(`${process.env.REACT_APP_API_KEY}/groupByRole/${getRole}/${getUserID}`)
				.then(({data}) => {
					// console.log(data)

					setGroups(data)
					setAllGroups(data)
				})
		}
	}, [reload])
	// const removeListners = () => {
	// 	socket.removeAllListeners()
	// }
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

	useEffect(() => {
		console.log("groups  is changed and here")
	}, [groups])

	const createGroup = () => {
		axios
			.post(`${process.env.REACT_APP_API_KEY}/create-group`, {
				customer: customer.map((el) => ({id: el._id, email: el.email})),
				agent: agent.map((el) => el._id),
				teacher: teacher.map((el) => el._id),
				groupName: group,
				// groupID: uuidv4(),
				isClass: true,
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
				customer: customer.map((el) => ({id: el._id, email: el.email})),
				agent: agent.map((el) => el._id),
				teacher: teacher.map((el) => el._id),
				groupName: group,
				groupID: editGroupID,
				isClass: true,
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
				setActiveStep(4)
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

	const renderGroups = useMemo(() => {
		console.log("group is updating")
		return groups.map(({groupID, groupName}) => (
			<GroupSidebarChat key={groupID} id={groupID} name={groupName} />
		))
	}, [groups])
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
												{steps.map((label, idx) => (
													<Step key={idx}>
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

														{activeStep === 3 && (
															<div
																style={{
																	display: "flex",
																	justifyContent: "space-around",
																}}
															>
																<div>
																	<h3>Teachers</h3>
																	<List
																		style={{
																			maxHeight: "35vh",
																			overflow: "auto",
																		}}
																	>
																		{teacher.map((el, idx) => (
																			<ListItem key={idx}>
																				<ListItemText primary={el.username} />
																			</ListItem>
																		))}
																	</List>
																</div>
																<div>
																	<h3>Customers</h3>
																	<List
																		style={{
																			maxHeight: "35vh",
																			overflow: "auto",
																		}}
																	>
																		{customer.map((el, idx) => (
																			<ListItem key={idx}>
																				<ListItemText primary={el.username} />
																			</ListItem>
																		))}
																	</List>
																</div>
																<div>
																	<h3>Agents</h3>

																	<List
																		style={{
																			maxHeight: "35vh",
																			overflow: "auto",
																		}}
																	>
																		{agent.map((el, idx) => (
																			<ListItem key={idx}>
																				<ListItemText primary={el.username} />
																			</ListItem>
																		))}
																	</List>
																</div>
															</div>
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
																					.map((el) => el.username)
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
																					.map((el) => el.username)
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
																					.map((el) => el.firstName)
																					.join(", ")
																					.toString()}
																			</TableCell>
																		</TableRow>
																	</TableBody>
																</Table>
															)}
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
												{steps.map((label, idx) => (
													<Step key={idx}>
														<StepLabel>{label}</StepLabel>
													</Step>
												))}
											</Stepper>
											<div>
												{activeStep === steps.length ? (
													<div>
														<div
															style={{
																display: "flex",
																justifyContent: "space-around",
															}}
														>
															<div>
																<h3>Teachers</h3>
																<List
																	style={{
																		maxHeight: "35vh",
																		overflow: "auto",
																	}}
																>
																	{teacher.map((el, idx) => (
																		<ListItem key={idx}>
																			<ListItemText primary={el.username} />
																		</ListItem>
																	))}
																</List>
															</div>
															<div>
																<h3>Customers</h3>
																<List
																	style={{
																		maxHeight: "35vh",
																		overflow: "auto",
																	}}
																>
																	{customer.map((el, idx) => (
																		<ListItem key={idx}>
																			<ListItemText primary={el.username} />
																		</ListItem>
																	))}
																</List>
															</div>
															<div>
																<h3>Agents</h3>

																<List
																	style={{
																		maxHeight: "35vh",
																		overflow: "auto",
																	}}
																>
																	{agent.map((el, idx) => (
																		<ListItem key={idx}>
																			<ListItemText primary={el.username} />
																		</ListItem>
																	))}
																</List>
															</div>
														</div>
														<Typography>All Steps Done</Typography>
														<Button color="primary" onClick={handleReset}>
															Edit
														</Button>
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

														{activeStep === 3 && (
															<div
																style={{
																	display: "flex",
																	justifyContent: "space-around",
																}}
															>
																<div>
																	<h3>Teachers</h3>
																	<List
																		style={{
																			maxHeight: "35vh",
																			overflow: "auto",
																		}}
																	>
																		{teacher.map((el, idx) => (
																			<ListItem key={idx}>
																				<ListItemText primary={el.username} />
																			</ListItem>
																		))}
																	</List>
																</div>
																<div>
																	<h3>Customers</h3>
																	<List
																		style={{
																			maxHeight: "35vh",
																			overflow: "auto",
																		}}
																	>
																		{customer.map((el, idx) => (
																			<ListItem key={idx}>
																				<ListItemText primary={el.username} />
																			</ListItem>
																		))}
																	</List>
																</div>
																<div>
																	<h3>Agents</h3>

																	<List
																		style={{
																			maxHeight: "35vh",
																			overflow: "auto",
																		}}
																	>
																		{agent.map((el, idx) => (
																			<ListItem key={idx}>
																				<ListItemText primary={el.username} />
																			</ListItem>
																		))}
																	</List>
																</div>
															</div>
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
			<div
				className="sidebar_chats"
				style={{
					height: "71vh",
					overflowY: "auto",
				}}
			>
				{renderGroups}
			</div>
		</div>
	)
})

export default Sidebar

function getSteps() {
	return ["Add Teachers", "Add Agents", "Add Customers", "Review"]
}
