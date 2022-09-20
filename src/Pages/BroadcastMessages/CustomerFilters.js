import React from "react"
import Autocomplete from "@material-ui/lab/Autocomplete"
import {TextField} from "@material-ui/core"

function CustomerFilters({allAdminIds, setAllAdminIds, allCustomers}) {
	return (
		<Autocomplete
			style={{
				maxWidth: 400,
				margin: "auto",
			}}
			limitTags={2}
			fullWidth
			getOptionSelected={(option, value) => option.userId === value.userId}
			options={allCustomers}
			getOptionLabel={(name) =>
				name.customerId && name.customerId.firstName
					? `${name.customerId.firstName}${
							name.customerId.email ? "(" + name.customerId.email + ")" : ""
					  }`
					: name.customerId && name.customerId.email
					? name.customerId.email
					: name.userId
			}
			onChange={(event, value) => {
				if (value) {
					setAllAdminIds(value)
				}
			}}
			multiple
			value={allAdminIds}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Select Students"
					variant="outlined"
					placeholder="Customers"
					margin="normal"
				/>
			)}
		/>
	)
}

export default CustomerFilters
