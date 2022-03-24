import {Button, Card, Collapse, IconButton, TextField} from "@material-ui/core"
import React, {
	forwardRef,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
	memo,
} from "react"
import SchedulerCard from "./SchedulerCard"
import {Link, useParams} from "react-router-dom"
import Axios from "axios"
import {ChevronDown, ChevronUp} from "react-feather"
import moment from "moment"
import GlobalContext from "../../../context/GlobalContext"
const SchedulerCardConatiner = () => {
	const globalContext = useContext(GlobalContext)

	const {state} = globalContext

	const [scheduleData, setScheduleData] = useState()
	const params = useParams()
	useEffect(() => {
		fetchSchedules()
	}, [params.id])

	const [selectedSlots, setSelectedSlots] = useState([])

	const [searchTerm, setSearchTerm] = useState("")

	const fetchSchedules = async () => {
		let url =
			searchTerm === ""
				? `https://livekumon-development-services.herokuapp.com/api/teachers/${params.id}/schedules?web=1`
				: `https://livekumon-development-services.herokuapp.com/api/teachers/${params.id}/schedules?web=1?search=${searchTerm}`
		try {
			const data = await Axios.get(url)

			setScheduleData(data?.data?.result)
			console.log(data?.data?.result)
		} catch (error) {}
	}

	// useEffect(() => {
	// 	const delayDebounceFn = setTimeout(() => {
	// 		fetchSchedules()
	// 		// Send Axios request here
	// 	}, 3000)

	// 	return () => clearTimeout(delayDebounceFn)
	// }, [searchTerm])
	// ({item, collapseAll})
	const ScheduledCard = ({item, collapseAll}) => {
		console.log("RERENDERING")
		const [collapse, setCollapse] = useState(false)

		// useEffect(() => {
		// 	setCollapse(collapseAll)
		// }, [collapseAll])

		// useEffect(() => {
		// 	if (moment().format("dddd").toUpperCase() === item.day.toUpperCase()) {
		// 		setCollapse(true)
		// 	}
		// }, [item])
		return (
			<>
				<Card
					style={{
						// margin: 5,
						width: "100%",
						height: "auto",
						display: "flex",
						flexDirection: "column",
						marginTop: 10,
						borderRadius: "0px !important",
						border: "1px solid rgb(9, 132, 227)",
						// margin: 10,
						boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
					}}
				>
					<Card
						style={{backgroundColor: "rgb(9, 132, 227)", display: "Flex", alignItems: "center"}}
					>
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
										teacher={scheduleData.teacher}
									/>
								</>
							)
						})}
					</Collapse>
				</Card>
			</>
		)
	}

	return (
		<div style={{margin: 5}}>
			<TextField
				fullWidth
				label="Search"
				variant="outlined"
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			{scheduleData &&
				scheduleData.schedules.map((item) => {
					return <ScheduledCard item={item} collapseAll={state.expandAll} />
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
		</div>
	)
}

export default SchedulerCardConatiner
