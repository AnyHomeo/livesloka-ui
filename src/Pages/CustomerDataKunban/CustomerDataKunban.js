import {Button, IconButton, makeStyles, Menu} from "@material-ui/core"
import {Sort, Star} from "@material-ui/icons"
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab"
import Axios from "axios"
import React, {useEffect, useState} from "react"
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd"
import {AlignJustify, BarChart2, ChevronDown, Clock, Filter, Plus} from "react-feather"
import {uuid} from "uuidv4"
import DataCard from "./DataCard"
import StatusColumn from "./StatusColumn"
import {editCustomer} from "../../Services/Services"
import {addDays} from "date-fns"
import {DateRangePicker} from "react-date-range"
import "react-date-range/dist/styles.css" // main css file
import "react-date-range/dist/theme/default.css" // theme css file

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
})

const itemsFromBackend = [
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
]

const itemsFromBackend1 = [
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
]

const itemsFromBackend2 = [
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
]

const itemsFromBackend3 = [
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
	{
		id: uuid(),
		content: {
			parent: "Tejaswini Sareddy",
			studentName: "Sindu Ajay",
			agent: "Ram Kishore",
			age: "23",
			tags: ["Bollywood", "EST"],
		},
	},
]

const columnsFromBackend = {
	[uuid()]: {
		data: {
			status: "New Inquiry",
			amount: "$0.00",
			admission: "8",
		},
		items: itemsFromBackend,
	},
	[uuid()]: {
		data: {
			status: "Details Sent",
			amount: "$0.00",
			admission: "8",
		},
		items: itemsFromBackend1,
	},
	[uuid()]: {
		data: {
			status: "Responded",
			amount: "$0.00",
			admission: "8",
		},
		items: itemsFromBackend2,
	},
	[uuid()]: {
		data: {
			status: "Demo Scheduled",
			amount: "$0.00",
			admission: "8",
		},
		items: itemsFromBackend3,
	},
	[uuid()]: {
		data: {
			status: "Demo Done",
			amount: "$0.00",
			admission: "8",
		},
		items: itemsFromBackend3,
	},
	[uuid()]: {
		data: {
			status: "Yes For Class",
			amount: "$0.00",
			admission: "8",
		},
		items: itemsFromBackend3,
	},
	[uuid()]: {
		data: {
			status: "Yes For Class",
			amount: "$0.00",
			admission: "8",
		},
		items: itemsFromBackend3,
	},
}

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
		// console.log("Removed", removed)
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
	const [showPicker, setShowPicker] = useState(false)
	const [filteredDate, setFilteredDate] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: "selection",
		},
	])

	const classes = useStyles()
	const [columns, setColumns] = useState({})

	const [userFilterMenu, setUserFilterMenu] = useState(null)
	const [filters, setFilters] = useState(null)

	const handleClick = (event) => {
		setUserFilterMenu(event.currentTarget)
	}

	const handleClose = () => {
		setUserFilterMenu(null)
	}

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		let url = `${process.env.REACT_APP_API_KEY}/api/customers/dashboard`
		if (filteredDate.length) {
			url = `${
				process.env.REACT_APP_API_KEY
			}/api/customers/dashboard?from=${filteredDate[0].startDate.toISOString()}&to=${filteredDate[0].endDate.toISOString()}`
		}
		try {
			const data = await Axios.get(url)
			setColumns(data?.data?.result)
		} catch (error) {}
	}

	return (
		<>
			{showPicker && (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginTop: 10,
						flexDirection: "column",
					}}
				>
					<DateRangePicker
						onChange={(item) => setFilteredDate([item.selection])}
						showSelectionPreview={true}
						moveRangeOnFirstSelection={false}
						months={2}
						ranges={filteredDate}
						direction="horizontal"
					/>

					<Button
						style={{backgroundColor: "#3867d6", marginTop: 10, color: "white"}}
						onClick={() => {
							fetchData()
							setShowPicker(false)
						}}
					>
						Apply
					</Button>
				</div>
			)}

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
					height: 70,
					width: "100%",
					backgroundColor: "white",
					marginTop: 25,
					boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
					padding: 10,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div style={{display: "flex", alignItems: "center"}}>
					<IconButton style={{backgroundColor: "#2ecc7050"}}>
						<Filter style={{color: "#27ae60"}} />
					</IconButton>
					<div className={classes.userFilter} onClick={handleClick}>
						<p style={{color: "#2d3436"}}>Ram Leads</p>
						<ChevronDown />
					</div>
					<IconButton
						style={{backgroundColor: "#2ecc7050", marginLeft: 20}}
						onClick={() => setShowPicker(!showPicker)}
					>
						<Clock style={{color: "#27ae60"}} />
					</IconButton>
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
					height: "100%",
					marginTop: 20,
					width: "100%",
					// overflowX: "scroll",
					// width: "min-content",
					marginLeft: "auto",
					// overflowY: "scroll",
					overflow: "scroll",
					// overflow: "hidden",
				}}
			>
				{columns && (
					<DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
						{Object.entries(columns).map(([columnId, column], index) => {
							return (
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
									key={columnId}
								>
									<StatusColumn data={column} />
									{/* <h2>{column.name}</h2> */}
									<div style={{margin: 8}}>
										<Droppable droppableId={columnId} key={columnId}>
											{(provided, snapshot) => {
												return (
													<div
														{...provided.droppableProps}
														ref={provided.innerRef}
														style={{
															background: snapshot.isDraggingOver ? "lightblue" : "#f1f2f6",
															padding: 2,
															width: 250,
															minHeight: 500,
															boxShadow:
																"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
															borderRadius: 5,
														}}
													>
														{column.items.map((item, index) => {
															return (
																<Draggable key={item.id} draggableId={item.id} index={index}>
																	{(provided, snapshot) => {
																		return (
																			<DataCard
																				data={item.content}
																				provided={provided}
																				snapshot={snapshot}
																			/>
																		)
																	}}
																</Draggable>
															)
														})}
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
		</>
	)
}

export default CustomerDataKunban
