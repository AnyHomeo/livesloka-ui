import {TextField} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import React, {useEffect, useState} from "react"
import {getAdminsFromQuery, getClasses} from "../../Services/Services"

function SelectClassName({ setAllAdminIds,refresh }) {
	const [allClassNames, setAllClassNames] = useState([])
	const [selectedClassNames, setSelectedClassNames] = useState([])

	useEffect(() => {
		getClasses().then((data) => {
			console.log(data.data.result)
			setAllClassNames(data.data.result)
		})
	}, [])

	useEffect(() => {
		if (selectedClassNames.length) {
			getAdminsFromQuery(
				"classes",
				selectedClassNames.map((schedule) => schedule._id)
			)
				.then((data) => {
                    console.log(data.data.result)
					setAllAdminIds(data.data.result)
				})
				.catch((err) => {
					console.log(err)
				})
		} else {
			setAllAdminIds([])
		}
	}, [selectedClassNames])

	return (
		<Autocomplete
			style={{
				maxWidth: 400,
				margin: "auto",
			}}
			limitTags={5}
			fullWidth
			options={allClassNames}
			getOptionLabel={(name) => name.className}
			onChange={(event, value) => {
				if (value) {
					setSelectedClassNames(value)
				}
			}}
			multiple
			value={selectedClassNames}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Select Class Names"
					variant="outlined"
					placeholder="Customers"
					margin="normal"
				/>
			)}
		/>
	)
}

export default SelectClassName
