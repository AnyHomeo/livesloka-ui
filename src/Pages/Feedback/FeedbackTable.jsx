import React from 'react'
import MaterialTable from "material-table"
import { Chip, makeStyles } from '@material-ui/core'
import moment from 'moment'


export const FeedbackTable = ({data}) => {
	const classes = useStyles()


	const columns = [
		{
			title: "Date",
			field: "createdAt",
			type: "date",
		},
		{
			title: "Response",
			field: "response",
			type: "string",
			render: (row) => <Chip label={row.response} size="small" color="primary" />,
		},
		{
			title: "Customer",
			field: "customer",
			type: "string",
		},
		{
			title: "Teacher",
			field: "teacher",
			type: "string",
		},
	]

  return (
    <div className={classes.tableWrapper}>
			<MaterialTable data={data} columns={columns} title={`Feedback of ${moment().format("MMMM")} month`} />
		</div>
  )
}

const useStyles = makeStyles(() => ({
	tableWrapper: {
		padding: 20,
	},
}))