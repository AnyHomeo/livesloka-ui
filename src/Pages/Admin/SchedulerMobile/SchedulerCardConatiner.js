import {Button, Card, Collapse, IconButton, Paper, TextField} from "@material-ui/core"
import React, {useCallback, useContext, useEffect, useState} from "react"
import SchedulerCard from "./SchedulerCard"
import {Link, useParams} from "react-router-dom"
import Axios from "axios"
import {ChevronDown, ChevronUp} from "react-feather"
import moment from "moment"
import GlobalContext from "../../../context/GlobalContext"
import SchedulerModal from "./SchedulerModal"
import InputBase from "@material-ui/core/InputBase"
import SearchIcon from "@material-ui/icons/Search"
import {makeStyles} from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "2px 4px",
		display: "flex",
		alignItems: "center",
		width: "100%",
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
}))

const ScheduleCard = ({
	item,
	collapseAll,
	fetchSchedules,
	setSelectedSlots,
	selectedSlots,
	setSelectedData,
}) => {
	const [collapse, setCollapse] = useState(false)

	useEffect(() => {
		setCollapse(collapseAll)
	}, [collapseAll])

	useEffect(() => {
		if (moment().format("dddd").toUpperCase() === item.day.toUpperCase()) {
			setCollapse(true)
		}
	}, [item])
	return (
		<Card
			style={{
				width: "100%",
				height: "auto",
				display: "flex",
				flexDirection: "column",
				marginTop: 10,
				borderRadius: "0px !important",
				border: "1px solid rgb(9, 132, 227)",
				boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
			}}
		>
			<Card style={{backgroundColor: "rgb(9, 132, 227)", display: "Flex", alignItems: "center"}}>
				<div style={{flex: 1.5, marginLeft: 50}}>
					<p style={{textAlign: "center", padding: 5, color: "white"}}>{item.day}</p>
				</div>
				<div>
					<IconButton onClick={() => setCollapse(!collapse)}>
						{collapse ? (
							<ChevronUp style={{color: "white"}} />
						) : (
							<ChevronDown style={{color: "white"}} />
						)}
					</IconButton>
				</div>
			</Card>
			<Collapse in={collapse}>
				{item.schedules.map((schedules) => {
					let isAvailable
					if (schedules.isAvailableSlot) {
						isAvailable = true
					} else {
						isAvailable = false
					}
					return (
						<>
							<SchedulerCard
								isAvailable={isAvailable}
								schedules={schedules}
								fetchSchedules={fetchSchedules}
								selectedSlots={selectedSlots}
								setSelectedSlots={setSelectedSlots}
								setSelectedData={setSelectedData}
							/>
						</>
					)
				})}
			</Collapse>
		</Card>
	)
}

const SchedulerCardConatiner = () => {
	const classes = useStyles()

	const [searchTerm, setSearchTerm] = useState("")

	const {state} = useContext(GlobalContext)

	const [scheduleData, setScheduleData] = useState([])
	const params = useParams()

	const fetchSchedules = useCallback(
		async (testing) => {
			let url =
				testing === ""
					? `${process.env.REACT_APP_API_KEY}/api/teachers/${params.id}/schedules?web=1`
					: `${process.env.REACT_APP_API_KEY}/api/teachers/${params.id}/schedules?web=1&search=${testing}`
			console.log(testing)
			console.log(url)
			try {
				const data = await Axios.get(url)

				setScheduleData(data?.data?.result)
				console.log(data?.data?.result)
			} catch (error) {
				console.log(error)
			}
		},
		[params.id]
	)

	useEffect(() => {
		fetchSchedules()
	}, [fetchSchedules])

	const [selectedSlots, setSelectedSlots] = useState([])
	const [selectedData, setSelectedData] = useState({})

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			fetchSchedules(searchTerm)
			// Send Axios request here
		}, 2000)

		return () => clearTimeout(delayDebounceFn)
	}, [searchTerm])

	return (
		<div style={{margin: 5}}>
			{/* <TextField
				label="Search"
				fullWidth
				variant="outlined"
				onChange={(e) => setSearchTerm(e.target.value)}
			/> */}

			<Paper component="form" className={classes.root}>
				<InputBase
					onChange={(e) => setSearchTerm(e.target.value)}
					className={classes.input}
					placeholder="Search"
				/>
				<IconButton type="submit" className={classes.iconButton} aria-label="search">
					<SearchIcon onClick={() => fetchSchedules(searchTerm)} />
				</IconButton>
			</Paper>
			{Object.keys(scheduleData).length &&
				scheduleData.schedules.map((item) => {
					return (
						<ScheduleCard
							item={item}
							collapseAll={state.expandAll}
							fetchSchedules={fetchSchedules}
							selectedSlots={selectedSlots}
							setSelectedSlots={setSelectedSlots}
							setSelectedData={setSelectedData}
						/>
					)
				})}

			{selectedSlots.length ? (
				<div
					style={{
						position: "fixed",
						top: "80%",
						left: "18%",
						trnasform: "translate(-80%, -18%)",
						padding: 20,
						backgroundColor: "#eee",
						borderRadius: 20,
						boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
					}}
				>
					<Button
						style={{marginRight: 20}}
						variant="outlined"
						color="secondary"
						onClick={() => setSelectedSlots([])}
					>
						Cancel
					</Button>
					<Link to={`/availabe-scheduler/${selectedSlots.join(",")}/${params.id}`}>
						<Button variant="contained" color="primary">
							Schedule
						</Button>
					</Link>
				</div>
			) : (
				""
			)}
			<SchedulerModal
				selectedSchedule={selectedData}
				setSelectedSchedule={setSelectedData}
				fetchSchedules={fetchSchedules}
				teacher={scheduleData?.teacher}
			/>
		</div>
	)
}

export default SchedulerCardConatiner
