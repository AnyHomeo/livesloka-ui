import React, {useState, useEffect, useMemo, useCallback} from "react"
import {
	getAllCustomerDetails,
	getByUserSettings,
	getData,
	updateSettings,
} from "../../../Services/Services"
import {Grid, Card, TextField, IconButton, Typography, Button} from "@material-ui/core/"
import {makeStyles} from "@material-ui/core/styles"
import {Link} from "react-router-dom"
import {PlusSquare, Monitor, BarChart2} from "react-feather"
import {useHistory} from "react-router-dom"
import WhatsAppIcon from "@material-ui/icons/WhatsApp"
import "./style.css"
import Autocomplete from "@material-ui/lab/Autocomplete"
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined"
import StatisticsCards from "./StatisticsCards"
import {isAutheticated} from "../../../auth"
import useDocumentTitle from "../../../Components/useDocumentTitle"
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos"
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		margin: "10px",
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
}))

const names = [
	"Class",
	"Time Zone",
	"Class Status",
	"Currency",
	"Country",
	"Teacher",
	"Agent",
	"Category",
	"Subject",
]

const status = [
	"className",
	"timeZoneName",
	"classStatusName",
	"currencyName",
	"countryName",
	"TeacherName",
	"AgentName",
	"categoryName",
	"subjectName",
]

const CustomerDetails = () => {
	useDocumentTitle("Customer Data Mobile")

	const history = useHistory()
	const classes = useStyles()

	const [filteredData, setFilteredData] = useState()
	const [searchKeyword, setSearchKeyword] = useState("")
	const [classStatusDrop, setClassStatusDrop] = useState()
	const [timeZoneId, setTimeZoneId] = useState()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	useEffect(() => {
		fetchCustomerDetails()
		fetchClassStatus()
	}, [])

	const fetchCustomerDetails = async () => {
		setLoading(true)
		const data = await getAllCustomerDetails()
		setData(data && data.data.result)
		setLoading(false)
	}

	const filterData = useCallback(() => {
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1)
		}

		let value = capitalizeFirstLetter(searchKeyword)
		if (value.includes("Https")) {
			value = value.split("?")[0]
		}

		let regex = new RegExp(`^${value}`, `i`)
		const sortedArr =
			data &&
			data.filter(
				(x) =>
					regex.test(x.firstName) ||
					regex.test(x.meetingLink) ||
					regex.test(x.email) ||
					regex.test(x.lastName) ||
					regex.test(x.noOfClasses) ||
					regex.test(x.proposedAmount) ||
					regex.test(x.scheduleDescription) ||
					regex.test(x.whatsAppnumber) ||
					regex.test(x.gender)
			)

		setFilteredData(sortedArr)
	}, [data, searchKeyword])

	useEffect(() => {
		filterData()
	}, [filterData])

	const fetchClassStatus = async () => {
		const classStatusResponse = await getData("Class Status")
		const timeZoneResponse = await getData("Time Zone")

		setClassStatusDrop(classStatusResponse.data.result)
		setTimeZoneId(timeZoneResponse.data.result)
	}

	const statusBackgroundColorMapping = useMemo(
		() => ({
			left: {
				New: "#3498db",
				"In Class": "#26de81",
				"Schedule Demo": "#e67e22",
				"Demo Scheduled": "#e67e22",
			},
			right: {
				New: "#2980b9",
				"In Class": "#20bf6b",
				"Schedule Demo": "#d35400",
				"Demo Scheduled": "#d35400",
			},
		}),
		[]
	)

	const backgroundColorReturn = (id, direction) => {
		return (
			statusBackgroundColorMapping[direction]?.[
				classStatusDrop?.[classStatusDrop?.findIndex((classStatus) => classStatus.id === id)]
					?.classStatusName
			] || (direction === "left" ? "#95a5a6" : "#7f8c8d")
		)
	}

	function getTimeZone(id) {
		return (
			<p style={{color: "white", fontSize: 10}}>
				{timeZoneId?.filter((timeZone) => timeZone?.id === id)[0]?.timeZoneName}
			</p>
		)
	}

	const [toggleStatistics, setToggleStatistics] = useState(false)
	const [filterOpen, setFilterOpen] = useState(false)
	const [classStatusDropdown, setClassStatusDropdown] = useState({})
	const [timeZoneDropdown, setTimeZoneDropdown] = useState({})
	const [classDropdown, setClassDropdown] = useState({})
	const [countryDropdown, setCountryDropdown] = useState({})
	const [teachersDropdown, setTeachersDropdown] = useState({})
	const [agentDropdown, setAgentDropdown] = useState({})
	const [subjectDropdown, setSubjectDropdown] = useState({})

	const [filters, setFilters] = useState({
		classStatuses: [],
		timeZones: [],
		classes: [],
		teachers: [],
		countries: [],
		agents: [],
		subjects: [],
		paidClasses: [],
	})

	const fetchDropDown = useCallback((index) => {
		var obj = {}
		getData(names[index])
			.then((data) => {
				data.data.result.forEach((item) => {
					if (names[index] === "Class Status") {
						if (item.status === "1") {
							obj[item.id] = item[status[index]]
						}
					} else {
						obj[item.id] = item[status[index]]
					}
				})
			})
			.catch((err) => {
				console.error(err)
			})
		return obj
	}, [])

	useEffect(() => {
		setClassDropdown(fetchDropDown(0))
		setTimeZoneDropdown(fetchDropDown(1))
		setClassStatusDropdown(fetchDropDown(2))
		setCountryDropdown(fetchDropDown(4))
		setTeachersDropdown(fetchDropDown(5))
		setAgentDropdown(fetchDropDown(6))
		setSubjectDropdown(fetchDropDown(8))
	}, [fetchDropDown])

	const fetchData = async () => {
		try {
			setLoading(true)
			let id = isAutheticated()._id
			let data

			data = await getByUserSettings(id)

			let details = data.data.result
			setData(details)
			setLoading(false)
		} catch (error) {
			console.error(error)
		}
	}

	const AutoCompleteFilterData = ({dropdown, i}) => {
		return (
			<Autocomplete
				multiple
				size="small"
				id="tags-standard"
				filterSelectedOptions
				options={Object.keys(dropdown).map((id) => ({
					id,
					name: dropdown[id],
				}))}
				limitTags={1}
				getOptionSelected={(option, value) => option.id === value.id}
				value={
					filters[
						[
							"classStatuses",
							"timeZones",
							"classes",
							"teachers",
							"countries",
							"agents",
							"subjects",
						][i]
					]
				}
				onChange={(e, v) => {
					setFilters((prev) => {
						let prevFilters = {...prev}
						return {
							...prevFilters,
							[[
								"classStatuses",
								"timeZones",
								"classes",
								"teachers",
								"countries",
								"agents",
								"subjects",
							][i]]: v,
						}
					})
				}}
				getOptionLabel={(option) => option.name}
				renderInput={(params) => (
					<TextField
						{...params}
						variant="outlined"
						label={
							["Class Status", "Time Zone", "Class", "Teacher", "Country", "Agent", "Subject"][i]
						}
					/>
				)}
			/>
		)
	}

	return (
		<div className={classes.root}>
			{toggleStatistics && <StatisticsCards />}

			{filterOpen ? (
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						margin: "30px",
						alignItems: "center",
						justifyContent: "space-evenly",
						flexWrap: "wrap",
					}}
				>
					{[
						classStatusDropdown,
						timeZoneDropdown,
						classDropdown,
						teachersDropdown,
						countryDropdown,
						agentDropdown,
						subjectDropdown,
					].map((dropdown, i) => (
						<div
							key={data._id}
							style={{
								width: "300px",
								margin: "10px 0",
							}}
						>
							<AutoCompleteFilterData dropdown={dropdown} i={i} key={i} />
						</div>
					))}
					<div
						style={{
							width: "300px",
							margin: "10px 0",
						}}
					>
						<Autocomplete
							multiple
							size="small"
							filterSelectedOptions
							options={[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
							limitTags={1}
							getOptionSelected={(option, value) => option === value}
							value={filters["paidClasses"]}
							onChange={(e, v) => {
								setFilters((prev) => {
									let prevFilters = {...prev}
									return {
										...prevFilters,
										paidClasses: v,
									}
								})
							}}
							getOptionLabel={(option) => option.toString()}
							renderInput={(params) => (
								<TextField {...params} variant="outlined" label={"Paid Classes"} />
							)}
						/>
					</div>
					<div
						style={{
							width: "300px",
							margin: "10px 0",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-evenly",
						}}
					>
						<Button
							variant="contained"
							color="primary"
							style={{margin: "5px"}}
							onClick={(e) => {
								setLoading(true)
								let id = isAutheticated()._id
								if (id) {
									updateSettings(id, {
										filters,
									})
										.then((data) => {
											fetchData()
										})
										.catch((err) => {
											console.log(err)
										})
								}
							}}
						>
							Apply
						</Button>

						<Button
							variant="contained"
							color="primary"
							style={{margin: "5px"}}
							onClick={() => {
								let id = isAutheticated()._id
								setLoading(true)
								setFilters({
									classStatuses: [],
									timeZones: [],
									classes: [],
									teachers: [],
									countries: [],
									agents: [],
									subjects: [],
									paidClasses: [],
								})
								updateSettings(id, {
									filters: {
										classStatuses: [],
										timeZones: [],
										classes: [],
										teachers: [],
										countries: [],
										agents: [],
										subjects: [],
										paidClasses: [],
									},
								})
									.then((data) => {
										fetchData()
									})
									.catch((err) => {
										console.log(err)
									})
							}}
						>
							Clear
						</Button>
					</div>
				</div>
			) : (
				""
			)}

			<div style={{textAlign: "right"}}>
				<IconButton onClick={() => setFilterOpen(!filterOpen)}>
					<FilterListOutlinedIcon />
				</IconButton>

				<IconButton onClick={() => setToggleStatistics(!toggleStatistics)}>
					<BarChart2 />
				</IconButton>
				<Link
					to={{
						pathname: "/add-customer-mobile",
					}}
				>
					<IconButton>
						<PlusSquare />
					</IconButton>
				</Link>
				<IconButton onClick={() => history.push("/customer-data")}>
					<Monitor />
				</IconButton>
			</div>
			<TextField
				fullWidth
				style={{marginBottom: "20px"}}
				label="Search"
				variant="outlined"
				onChange={(e) => setSearchKeyword(e.target.value)}
				value={searchKeyword}
			/>

			<Grid container spacing={2}>
				{loading
					? ""
					: searchKeyword
					? filteredData &&
					  filteredData.map((data) => (
							<div key={data._id} style={{display: "flex", width: "100%"}}>
								<Card
									style={{
										width: "100%",
										height: 60,
										marginBottom: 5,
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
										border: "1px solid #ecf0f1",
										backgroundColor: backgroundColorReturn(data.classStatusId, "left"),
										color: "white",
										overflow: "hidden",
									}}
								>
									<Link
										to={{
											pathname: "/customer-data-info",
											state: {data},
										}}
										style={{
											width: "100%",
											textDecoration: "none",
											color: "white",
										}}
									>
										<div
											style={{
												marginLeft: 10,
												display: "flex",
												flexDirection: "column",
											}}
										>
											<Typography className={classes.heading} style={{fontSize: 14}}>
												{data.firstName}
											</Typography>

											<div
												style={{
													display: "flex",
													alignItems: "center",
												}}
											>
												<Typography className={classes.heading} style={{fontSize: 10}}>
													{data.lastName}
												</Typography>
												<Typography
													// className={classes.heading}
													style={{
														fontSize: 10,
														marginRight: 10,
														marginLeft: 10,
													}}
												>
													{data.numberOfClassesBought}
												</Typography>
												{getTimeZone(data.timeZoneId)}
											</div>
										</div>
									</Link>
									<div
										style={{
											height: "100%",
											width: "70px",
											backgroundColor: backgroundColorReturn(data.classStatusId, "right"),
											borderRadius: "0px 7px 5px 0px",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											flexDirection: "column",
											overflow: "hidden",
										}}
									>
										<a
											href={`https://wa.me/${
												data.countryCode ? data.countryCode : data.countryCode
											}${data.whatsAppnumber}`}
											target="_blank"
											rel="noreferrer"
										>
											<IconButton>
												<WhatsAppIcon style={{color: "#fff"}} />
											</IconButton>
										</a>
									</div>
								</Card>
								<Link
									to={{
										pathname: "/add-customer-mobile",
										state: {data},
									}}
								>
									<IconButton>
										<AddToPhotosIcon />
									</IconButton>
								</Link>
							</div>
					  ))
					: data &&
					  data.map((data) => {
							return (
								<div key={data._id} style={{display: "flex", width: "100%"}}>
									<Card
										style={{
											width: "100%",
											height: 60,
											marginBottom: 5,
											display: "flex",
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
											border: "1px solid #ecf0f1",
											backgroundColor: backgroundColorReturn(data.classStatusId, "left"),
											color: "white",
											overflow: "hidden",
										}}
									>
										<Link
											key={data._id}
											to={{
												pathname: "/customer-data-info",
												state: {data},
											}}
											style={{
												width: "100%",
												textDecoration: "none",
												color: "white",
											}}
										>
											<div
												style={{
													marginLeft: 10,
													display: "flex",
													flexDirection: "column",
												}}
											>
												<Typography className={classes.heading} style={{fontSize: 14}}>
													{data.firstName}
												</Typography>

												<div
													style={{
														display: "flex",
														alignItems: "center",
													}}
												>
													<Typography className={classes.heading} style={{fontSize: 10}}>
														{data.lastName}
													</Typography>
													<Typography
														// className={classes.heading}
														style={{
															fontSize: 10,
															marginRight: 10,
															marginLeft: 10,
														}}
													>
														{data.numberOfClassesBought}
													</Typography>
													{getTimeZone(data.timeZoneId)}
												</div>
											</div>
										</Link>
										<div
											style={{
												height: "100%",
												width: "70px",
												backgroundColor: backgroundColorReturn(data.classStatusId, "right"),
												borderRadius: "0px 7px 5px 0px",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												flexDirection: "column",
												overflow: "hidden",
											}}
										>
											<a
												href={`https://wa.me/${
													data.countryCode ? data.countryCode : data.countryCode
												}${data.whatsAppnumber}`}
												target="_blank"
												rel="noreferrer"
											>
												<IconButton>
													<WhatsAppIcon style={{color: "#fff"}} />
												</IconButton>
											</a>
										</div>
									</Card>
									<Link
										to={{
											pathname: "/add-customer-mobile",
											state: {data},
										}}
									>
										<IconButton>
											<AddToPhotosIcon />
										</IconButton>
									</Link>
								</div>
							)
					  })}
			</Grid>
		</div>
	)
}

export default CustomerDetails
