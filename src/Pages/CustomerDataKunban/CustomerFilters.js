import {Button, TextField} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import React, {useCallback, useEffect, useState} from "react"
import {getData} from "../../Services/Services"
import DateRangeDialog from "./DateRangeDialog"
import moment from "moment"
import {useSnackbar} from "notistack"

const initialFilterState = {
	classStatuses: [],
	timeZones: [],
	classes: [],
	teachers: [],
	countries: [],
	agents: [],
	subjects: [],
	paidClasses: [],
}

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

const CustomerFilters = ({setViews, closeDrawer}) => {
	const [classDropdown, setClassDropdown] = useState({})
	const [timeZoneDropdown, setTimeZoneDropdown] = useState({})
	const [classStatusDropdown, setClassStatusDropdown] = useState({})
	const [countryDropdown, setCountryDropdown] = useState({})
	const [teachersDropdown, setTeachersDropdown] = useState({})
	const [agentDropdown, setAgentDropdown] = useState({})
	const [subjectDropdown, setSubjectDropdown] = useState({})

	const [filters, setFilters] = useState(initialFilterState)
	const [filterName, setFilterName] = useState("")
	const {enqueueSnackbar} = useSnackbar()

	const fetchDropDown = useCallback(async (index) => {
		var obj = {}
		let data = await getData(names[index])
		data.data.result.forEach((item) => {
			if (names[index] === "Class Status") {
				if (item.status === "1") {
					obj[item.id] = item[status[index]]
				}
			} else {
				obj[item.id] = item[status[index]]
			}
		})
		return obj
	}, [])

	const AutoCompleteFilterData = useCallback(
		({dropdown, i}) => {
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
		},
		[filters]
	)

	//load all dropdowns
	const fetchAllDropdowns = useCallback(async () => {
		let setDropDowns = [
			setClassDropdown,
			setTimeZoneDropdown,
			setClassStatusDropdown,
			setCountryDropdown,
			setTeachersDropdown,
			setAgentDropdown,
			setSubjectDropdown,
		]

		for (let i = 0; i < setDropDowns.length; i++) {
			const setDropDown = setDropDowns[i]
			let dropDownData = await fetchDropDown(i)
			setDropDown(dropDownData)
		}
	}, [fetchDropDown])

	useEffect(() => {
		fetchAllDropdowns()
	}, [fetchAllDropdowns])

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
		<div style={{width: 400}}>
			<div style={{padding: 20}}>
				<p style={{fontSize: 18, fontWeight: 600}}>Custom Filters</p>
				<hr style={{marginTop: 20}} />
			</div>

			<DateRangeDialog
				open={open}
				setOpen={setOpen}
				setFilteredDate={setFilteredDate}
				filteredDate={filteredDate}
				from={"filters"}
			/>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "space-evenly",
					flexWrap: "wrap",
				}}
			>
				<div style={{width: "300px", margin: "10px 0"}}>
					<TextField
						size="small"
						fullWidth
						label="Filter name"
						variant="outlined"
						value={filterName}
						onChange={(e) => setFilterName(e.target.value)}
					/>

					<TextField
						style={{marginTop: 20}}
						fullWidth
						onClick={() => setOpen(!open)}
						size="small"
						label="Date Range"
						variant="outlined"
						value={`${moment(filteredDate && filteredDate[0].startDate).format(
							"MMM Do YY"
						)} - ${moment(filteredDate && filteredDate[0].endDate).format("MMM Do YY")}`}
					/>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
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
						style={{marginRight: "5px"}}
						onClick={() => {
							setFilters(initialFilterState)
							setFilterName("")
							closeDrawer()
						}}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						style={{margin: "5px"}}
						onClick={() => {
							if (filterName) {
								setFilters(initialFilterState)
								setViews((prev) => {
									let prevData = [...prev]
									prevData.push(filterName)
									return prevData
								})
								setFilterName("")
								closeDrawer()
								enqueueSnackbar("Customer Filter view added successfully", {variant: "success"})
							} else {
								enqueueSnackbar("View name is required", {variant: "error"})
							}
						}}
					>
						Apply
					</Button>
				</div>
			</div>
		</div>
	)
}

export default CustomerFilters
