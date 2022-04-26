import {Button, TextField} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import React, {useCallback, useEffect, useState} from "react"
import {isAutheticated} from "../../auth"
import {getByUserSettings, getData, getSettings, updateSettings} from "../../Services/Services"
import DateRangeDialog from "./DateRangeDialog"
import moment from "moment"
const CustomerFilters = () => {
	const [data, setData] = useState([])

	const fetchData = useCallback(async () => {
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
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData])
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

	const [classDropdown, setClassDropdown] = useState({})
	const [timeZoneDropdown, setTimeZoneDropdown] = useState({})
	const [classStatusDropdown, setClassStatusDropdown] = useState({})
	const [countryDropdown, setCountryDropdown] = useState({})
	const [teachersDropdown, setTeachersDropdown] = useState({})
	const [agentDropdown, setAgentDropdown] = useState({})
	const [subjectDropdown, setSubjectDropdown] = useState({})
	const [loading, setLoading] = useState(false)
	const [currencyDropdown, setCurrencyDropdown] = useState({})
	const [categoryDropdown, setCategoryDropdown] = useState({})

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

	const fetchDropDown = (index) => {
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
	}

	//load all dropdowns
	useEffect(() => {
		setClassDropdown(fetchDropDown(0))
		setTimeZoneDropdown(fetchDropDown(1))
		setClassStatusDropdown(fetchDropDown(2))
		setCurrencyDropdown(fetchDropDown(3))
		setCountryDropdown(fetchDropDown(4))
		setTeachersDropdown(fetchDropDown(5))
		setAgentDropdown(fetchDropDown(6))
		setCategoryDropdown(fetchDropDown(7))
		setSubjectDropdown(fetchDropDown(8))
	}, [])

	let dateFilter = [
		{
			startDate: new Date(),
			endDate: new Date(),
			key: "selection",
		},
	]
	const [filteredDate, setFilteredDate] = useState(dateFilter)

	const [open, setOpen] = useState(false)

	return (
		<div>
			<DateRangeDialog
				open={open}
				setOpen={setOpen}
				setFilteredDate={setFilteredDate}
				filteredDate={filteredDate}
				fetchData={fetchData}
				from={"filters"}
			/>

			<div
				style={{
					display: "flex",
					flexDirection: "row",
					margin: "30px",
					alignItems: "center",
					justifyContent: "center",
					flexWrap: "wrap",
				}}
			>
				<TextField size="small" label="Filter name" variant="outlined" />

				<TextField
					onClick={() => setOpen(!open)}
					style={{marginLeft: 20}}
					size="small"
					label="Date Range"
					variant="outlined"
					value={`${moment(filteredDate && filteredDate[0].startDate).format(
						"MMM Do YY"
					)} - ${moment(filteredDate && filteredDate[0].endDate).format("MMM Do YY")}`}
				/>
			</div>

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
						style={{
							width: "300px",
							margin: "10px 0",
						}}
					>
						<AutoCompleteFilterData dropdown={dropdown} i={i} />
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
		</div>
	)
}

export default CustomerFilters
