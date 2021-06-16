import React, {useEffect, useState} from "react"
import Axios from "axios"
import {TextField} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import {getAdminsFromQuery, getClasses} from "../../Services/Services"

function SelectTeacher({setAllAdminIds}) {
	const [allTeachers, setAllTeachers] = useState([])
	const [selectedTeachers, setSelectedTeachers] = useState([])

	useEffect(() => {
		Axios.get(`${process.env.REACT_APP_API_KEY}/teacher?params=id,TeacherName`)
			.then((data) => {
				setAllTeachers(data.data.result)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	useEffect(() => {
		if (selectedTeachers.length) {
			getAdminsFromQuery(
				"teacher",
				selectedTeachers.map((teacher) => teacher.id)
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
	}, [selectedTeachers])

	return (
		<Autocomplete
			style={{
				maxWidth: 400,
				margin: "auto",
			}}
			limitTags={5}
			fullWidth
			options={allTeachers}
			getOptionLabel={(name) => name.TeacherName}
			onChange={(event, value) => {
				if (value) {
					setSelectedTeachers(value)
				}
			}}
			multiple
			value={selectedTeachers}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Select a Teacher"
					variant="outlined"
					placeholder="Customers"
					margin="normal"
				/>
			)}
		/>
	)
}

export default SelectTeacher
