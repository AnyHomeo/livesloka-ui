import React from "react"
import {getAdminsFromQuery, getData} from "../../Services/Services"
import {TextField} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import {useEffect, useState} from "react"

function AgentsFilters({ setAllAdminIds }) {
	const [allAgents, setAllAgents] = useState([])
	const [selectedAgents, setSelectedAgents] = useState([])

	useEffect(() => {
		getData("Agent")
			.then((data) => {
				setAllAgents(data.data.result)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

    useEffect(() => {
        if (selectedAgents.length) {
			getAdminsFromQuery(
				"agent",
				selectedAgents.map((agent) => agent.id)
			)
				.then((data) => {
					setAllAdminIds(data.data.result)
				})
				.catch((err) => {
					console.log(err)
				})
		}else {
			setAllAdminIds([])
		}
    }, [selectedAgents])

	return (
		<Autocomplete
			style={{
				maxWidth: 400,
				margin: "auto",
			}}
			limitTags={5}
			fullWidth
			options={allAgents}
			getOptionLabel={(name) => name.AgentName}
			onChange={(event, value) => {
				if (value) {
					setSelectedAgents(value)
				}
			}}
			multiple
			value={selectedAgents}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Select Agent"
					variant="outlined"
					placeholder="Customers"
					margin="normal"
				/>
			)}
		/>
	)
}

export default AgentsFilters
