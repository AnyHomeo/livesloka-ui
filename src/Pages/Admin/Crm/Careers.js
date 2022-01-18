import React, {useEffect, useState} from "react"
import MaterialTable from "material-table"
import {getCareersApplications} from "../../../Services/Services"
import {IconButton, Tooltip} from "@material-ui/core"
import LaunchIcon from "@material-ui/icons/Launch"
import useDocumentTitle from "../../../Components/useDocumentTitle"

function Careers() {
	useDocumentTitle("Careers")

	const [applications, setApplications] = useState([])
	useEffect(() => {
		getCareersApplications()
			.then((data) => {
				setApplications(data.data.result)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	return (
		<MaterialTable
			columns={[
				{
					field: "createdAt",
					title: "Applied on",
					type: "date",
				},
				{
					field: "firstName",
					title: "First Name",
				},
				{
					field: "lastName",
					title: "Last Name",
				},
				{
					field: "position",
					title: "Position",
				},
				{
					field: "email",
					title: "Email",
				},
				{
					field: "phone",
					title: "Phone no.",
				},
				{
					field: "resumeLink",
					title: "Resume",
					render: (row) =>
						row.resumeLink ? (
							<a target="__blank" href={row.resumeLink}>
								<Tooltip title="Open Resume">
									<IconButton>
										<LaunchIcon />
									</IconButton>
								</Tooltip>
							</a>
						) : (
							""
						),
				},
			]}
			style={{
				margin: 20,
				padding: 20,
			}}
			data={applications}
			title="Applications"
		/>
	)
}

export default Careers
