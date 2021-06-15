import React from "react"
import CustomerFilters from "./CustomerFilters"
import SelectClassName from "./SelectClassName"
import SelectTeacher from "./SelectTeacher"
import {FormControlLabel, Checkbox, Collapse} from "@material-ui/core"
import AgentsFilters from "./AgentsFilters"

function RenderAllFilters({
	queryFrom,
	allAdminIds,
	setAllAdminIds,
	allCustomers,
	isForAll,
	setIsForAll,
}) {
	switch (queryFrom) {
		case "customers":
			return (
				<>
					<FormControlLabel
						control={
							<Checkbox
								checked={isForAll}
								onChange={() => setIsForAll((prev) => !prev)}
								name="isForAll"
							/>
						}
						label="Broadcast Notification to all Customers"
					/>
					<Collapse in={!isForAll} style={{width: "100%"}}>
						<CustomerFilters
							allAdminIds={allAdminIds}
							setAllAdminIds={setAllAdminIds}
							allCustomers={allCustomers}
						/>
					</Collapse>
				</>
			)
			break
		case "classname":
			return (
				<>
					<SelectClassName allAdminIds={allAdminIds} setAllAdminIds={setAllAdminIds} />
					<CustomerFilters
						allAdminIds={allAdminIds}
						setAllAdminIds={setAllAdminIds}
						allCustomers={allCustomers}
					/>
				</>
			)
		case "teacher":
			return (
				<>
					<SelectTeacher allAdminIds={allAdminIds} setAllAdminIds={setAllAdminIds} />
					<CustomerFilters
						allAdminIds={allAdminIds}
						setAllAdminIds={setAllAdminIds}
						allCustomers={allCustomers}
					/>
				</>
			)
		case "agent":
			return (
				<>
					<AgentsFilters allAdminIds={allAdminIds} setAllAdminIds={setAllAdminIds} />
					<CustomerFilters
						allAdminIds={allAdminIds}
						setAllAdminIds={setAllAdminIds}
						allCustomers={allCustomers}
					/>
				</>
			)
		default:
			return <div>Still in development</div>
	}
}

export default RenderAllFilters
