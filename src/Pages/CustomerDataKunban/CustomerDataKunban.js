import {Button, Drawer, IconButton, makeStyles, Menu} from "@material-ui/core"
import {Sort, Star} from "@material-ui/icons"
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab"
import Axios from "axios"
import React, {useCallback, useEffect, useState} from "react"
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd"
import {AlignJustify, BarChart2, ChevronDown, Clock, Edit2, Filter, Plus} from "react-feather"
import DataCard from "./DataCard"
import StatusColumn from "./StatusColumn"
import {editCustomer} from "../../Services/Services"
import "react-date-range/dist/styles.css" // main css file
import "react-date-range/dist/theme/default.css" // theme css file
import NewAdmission from "./NewAdmissioin"
import Comments from "../Admin/Crm/Comments"
import DateRangeDialog from "./DateRangeDialog"
import moment from "moment"
import EditCustomer from "./EditCustomer"
import CustomerFilters from "./CustomerFilters"
import EditDataCard from "./EditDataCard"
const useStyles = makeStyles({
	userFilter: {
		marginLeft: 15,
		height: 40,
		width: 150,
		border: "1px solid #bdc3c7",
		borderRadius: 50,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		cursor: "pointer",
		"&:hover": {
			border: "2px solid #27ae60",
		},
	},
	userFilterMenuItem: {
		display: "flex",
		height: 40,
		alignItems: "center",
		"&:hover": {
			backgroundColor: "lightblue",
		},
	},
	hideScrollBar: {
		margin: 8,
		overflowY: "scroll",
		boxShadow: "rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px",
		borderRadius: 5,
		"&::-webkit-scrollbar": {
			display: "none",
		},
	},
})

const updateCusomter = async (moved, destination, columns) => {
	const destColumn = columns[destination.droppableId]

	const resqust = {
		_id: moved.content._id,
		classStatusId: destColumn.data.id,
	}

	console.log("destColumn", destColumn)
	console.log(resqust)
	try {
		const data = await editCustomer(resqust)

		console.log(data)
	} catch (error) {}
}

const onDragEnd = (result, columns, setColumns) => {
	if (!result.destination) return
	const {source, destination} = result
	if (source.droppableId !== destination.droppableId) {
		const sourceColumn = columns[source.droppableId]
		const destColumn = columns[destination.droppableId]
		const sourceItems = [...sourceColumn.items]
		const destItems = [...destColumn.items]
		const [removed] = sourceItems.splice(source.index, 1)
		destItems.splice(destination.index, 0, removed)
		updateCusomter(removed, destination, columns)
		setColumns({
			...columns,
			[source.droppableId]: {
				...sourceColumn,
				items: sourceItems,
			},
			[destination.droppableId]: {
				...destColumn,
				items: destItems,
			},
		})
	} else {
		const column = columns[source.droppableId]
		const copiedItems = [...column.items]
		const [removed] = copiedItems.splice(source.index, 1)
		copiedItems.splice(destination.index, 0, removed)
		setColumns({
			...columns,
			[source.droppableId]: {
				...column,
				items: copiedItems,
			},
		})
	}
}

function CustomerDataKunban() {
	let dateFilter = [
		{
			startDate: new Date(moment().subtract(1, "month").format()),
			endDate: new Date(),
			key: "selection",
		},
	]
	const [filteredDate, setFilteredDate] = useState(dateFilter)
	const classes = useStyles()
	const [columns, setColumns] = useState({})
	const [refresh, setRefresh] = useState(false)
	const [userFilterMenu, setUserFilterMenu] = useState(null)
	const [filters, setFilters] = useState(null)

	const handleClick = (event) => setUserFilterMenu(event.currentTarget)
	const handleClose = () => setUserFilterMenu(null)

	const fetchData = useCallback(async () => {
		let url = `${process.env.REACT_APP_API_KEY}/api/customers/dashboard`
		if (filteredDate != null && filteredDate.length) {
			url = `${
				process.env.REACT_APP_API_KEY
			}/api/customers/dashboard?from=${filteredDate[0].startDate.toISOString()}&to=${filteredDate[0].endDate.toISOString()}`
		}
		try {
			const data = await Axios.get(url)
			console.log(data?.data?.result)
			setColumns(data?.data?.result)
		} catch (error) {
			console.error(error)
		}
	}, [filteredDate])

	useEffect(() => {
		fetchData()
	}, [fetchData, refresh])

	const [selectedCommentsCustomerId, setSelectedCommentsCustomerId] = useState("")
	const [selectedCustomer, setSelectedCustomer] = useState({})
	const [drawerState, setDrawerState] = useState({
		right: false,
		left: false,
	})

	const [editCustomerData, setEditCustomerData] = useState({
		right: false,
	})

	const toggleDrawer = (anchor, open) => (event) => {
		setDrawerState({...drawerState, [anchor]: open})
	}

	const toggleDrawerEditData = (anchor, open) => (event) => {
		setEditCustomerData({...editCustomerData, [anchor]: open})
	}
	const [open, setOpen] = useState(false)

	const [customFilterOpen, setCustomFilterOpen] = useState(false)
	const [editCardDrawer, seteditCardDrawer] = useState({
		right: false,
	})

	const [filtersDrawer, setFiltersDrawer] = useState({
		right: false,
	})
	const [statusData, setStatusData] = useState({})

	console.log(filtersDrawer)
	return (
		<>
			<DateRangeDialog
				open={open}
				setOpen={setOpen}
				setFilteredDate={setFilteredDate}
				filteredDate={filteredDate}
				fetchData={fetchData}
			/>

			<div>
				<Menu
					anchorEl={userFilterMenu}
					keepMounted={false}
					open={Boolean(userFilterMenu)}
					onClose={handleClose}
				>
					<div style={{width: 300, height: "auto", cursor: "pointer"}}>
						<div className={classes.userFilterMenuItem}>
							<Star style={{color: "#27ae60", marginLeft: 5, marginRight: 5}} />
							<p>Ram Kishore</p>
						</div>
						<div className={classes.userFilterMenuItem}>
							<Star style={{color: "#27ae60", marginLeft: 5, marginRight: 5}} />
							<p>Ram Kishore</p>
						</div>
						<div className={classes.userFilterMenuItem}>
							<Star style={{color: "#27ae60", marginLeft: 5, marginRight: 5}} />
							<p>Ram Kishore</p>
						</div>
						<div className={classes.userFilterMenuItem}>
							<Star style={{color: "#27ae60", marginLeft: 5, marginRight: 5}} />
							<p>Ram Kishore</p>
						</div>
					</div>
				</Menu>
			</div>

			<div>
				<Menu
					anchorEl={filters}
					keepMounted={false}
					open={Boolean(filters)}
					onClose={() => setFilters(null)}
				>
					<div style={{width: 300, height: "auto", cursor: "pointer"}}>
						<div className={classes.userFilterMenuItem}>
							<Star style={{color: "#27ae60", marginLeft: 5, marginRight: 5}} />
							<p>Created Date</p>
						</div>
						<div className={classes.userFilterMenuItem}>
							<Star style={{color: "#27ae60", marginLeft: 5, marginRight: 5}} />
							<p>Modified Date</p>
						</div>
					</div>
				</Menu>
			</div>

			<div
				style={{
					height: 60,
					width: "100%",
					backgroundColor: "white",
					marginTop: 10,
					boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
					padding: 10,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div style={{display: "flex", alignItems: "center"}}>
					<IconButton
						onClick={() => setFiltersDrawer({...filtersDrawer, right: true})}
						style={{backgroundColor: "#3867d650", height: 40, width: 40}}
					>
						<Filter style={{color: "#3867d6"}} />
					</IconButton>
					<div className={classes.userFilter} onClick={handleClick}>
						<p style={{color: "#2d3436"}}>Ram Leads</p>
						<ChevronDown />
					</div>
					<IconButton
						style={{backgroundColor: "#3867d650", marginLeft: 20, height: 40, width: 40}}
						onClick={() => setOpen(!open)}
					>
						<Clock style={{color: "#3867d6"}} />
					</IconButton>
					<p style={{marginLeft: 10, fontWeight: 600}}>
						{moment(filteredDate && filteredDate[0].startDate).format("MMM Do YY")} -{" "}
						{moment(filteredDate && filteredDate[0].endDate).format("MMM Do YY")}
					</p>
				</div>
				<div style={{display: "flex", alignItems: "center"}}>
					<p>Sort By</p>

					<div>
						<div
							className={classes.userFilter}
							onClick={(event) => setFilters(event.currentTarget)}
						>
							<p style={{color: "#2d3436"}}>Created Time</p>
							<ChevronDown />
						</div>
					</div>
					<IconButton style={{border: "1px solid #b2bec3", height: 40, width: 40, marginLeft: 10}}>
						<Sort style={{height: 25, width: 25}} />
					</IconButton>

					<ToggleButtonGroup
						style={{height: 40, marginLeft: 10}}
						value={"left"}
						exclusive
						aria-label="text alignment"
					>
						<ToggleButton value="left" aria-label="left aligned">
							<BarChart2 style={{transform: "rotate(180deg)", color: "#27ae60"}} />
						</ToggleButton>
						<ToggleButton value="center" aria-label="centered">
							<AlignJustify />
						</ToggleButton>
					</ToggleButtonGroup>

					<Button
						onClick={() => setDrawerState({...drawerState, right: true})}
						style={{
							marginLeft: 10,
							backgroundColor: "#27ae60",
							color: "white",
							borderRadius: 50,
							boxShadow:
								"rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
							height: 40,
							width: 120,
							display: "flex",
							alignItems: "centers",
						}}
					>
						<Plus style={{height: 20, width: 20}} />
						<p style={{fontSize: 14}}>Admission</p>
					</Button>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-start",
					marginTop: 10,
					width: "100%",
					overflowX: "scroll",
					marginLeft: "auto",
					height: "calc(100vh - 150px)",
				}}
			>
				{columns && (
					<DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
						{Object.entries(columns)
							.sort((a, b) => a[1].data.statusOrder - b[1].data.statusOrder)
							.map(([columnId, column], index) => {
								return (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
										}}
										key={columnId}
									>
										<StatusColumn
											data={column}
											drawerState={editCardDrawer}
											setDrawerState={seteditCardDrawer}
											statusData={statusData}
											setStatusData={setStatusData}
										/>
										<div className={classes.hideScrollBar}>
											<Droppable droppableId={columnId} key={columnId}>
												{(provided, snapshot) => {
													return (
														<div
															{...provided.droppableProps}
															ref={provided.innerRef}
															style={{
																background: snapshot.isDraggingOver ? "lightblue" : "#f1f2f6",
																padding: 1,
																width: 220,
																minHeight: "calc(100vh - 160px)",

																borderRadius: 5,
																overflow: "hidden",
															}}
														>
															{column.items.length == 0 ? (
																<div
																	style={{
																		display: "flex",
																		justifyContent: "center",
																		alignItems: "center",
																		height: "calc(100vh - 250px)",
																	}}
																>
																	<p style={{fontSize: 14, fontWeight: 600}}>
																		No Admission in this stage
																	</p>
																</div>
															) : (
																<>
																	{column.items.map((item, index) => {
																		return (
																			<Draggable key={item.id} draggableId={item.id} index={index}>
																				{(provided, snapshot) => {
																					return (
																						<DataCard
																							data={item.content}
																							provided={provided}
																							snapshot={snapshot}
																							setSelectedCommentsCustomerId={
																								setSelectedCommentsCustomerId
																							}
																							drawerState={drawerState}
																							setDrawerState={setDrawerState}
																							editCustomerData={editCustomerData}
																							setEditCustomerData={setEditCustomerData}
																							setSelectedCustomer={setSelectedCustomer}
																						/>
																					)
																				}}
																			</Draggable>
																		)
																	})}
																</>
															)}

															{provided.placeholder}
														</div>
													)
												}}
											</Droppable>
										</div>
									</div>
								)
							})}
					</DragDropContext>
				)}
			</div>

			<Drawer anchor={"right"} open={drawerState["right"]} onClose={toggleDrawer("right", false)}>
				<NewAdmission
					onClose={toggleDrawer("right", false)}
					refresh={() => {
						setRefresh((prev) => !prev)
						toggleDrawer("right", false)()
					}}
				/>
			</Drawer>

			<Drawer
				anchor={"right"}
				open={editCustomerData["right"]}
				onClose={toggleDrawerEditData("right", false)}
			>
				<EditCustomer selectedCustomer={selectedCustomer} fetchData={fetchData} />
			</Drawer>

			<Drawer anchor={"left"} open={drawerState["left"]} onClose={toggleDrawer("left", false)}>
				<Comments
					commentsCustomerId={selectedCommentsCustomerId}
					drawerState={drawerState}
					setDrawerState={setDrawerState}
				/>
			</Drawer>

			<Drawer
				anchor={"right"}
				open={editCardDrawer["right"]}
				onClose={() => seteditCardDrawer({...editCardDrawer, ["right"]: false})}
			>
				<EditDataCard
					drawerState={editCardDrawer}
					setDrawerState={seteditCardDrawer}
					statusData={statusData}
				/>
			</Drawer>

			<Drawer
				anchor={"right"}
				open={filtersDrawer["right"]}
				onClose={() => setFiltersDrawer({...filtersDrawer, ["right"]: false})}
			>
				<CustomerFilters />
			</Drawer>
		</>
	)
}

export default CustomerDataKunban
