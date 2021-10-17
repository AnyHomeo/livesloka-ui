import React from "react"
import TableContainer from "@material-ui/core/TableContainer"
import {Paper} from "@material-ui/core"
import {Table} from "@material-ui/core"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableBody from "@material-ui/core/TableBody"

function RewardsTable({customerId}) {
	const rewardsHistory = [
		{
			prev: 0,
			next: 1,
			teacher:'Jill Mehta Bharatanatyam',
			comment: "Teacher Absent",
		},
		{
			prev: 1,
			next: 2,
			teacher:'Jill Mehta Bharatanatyam',
			comment: "Teacher Absent",
		},
		{
			prev: 2,
			next: 3,
			teacher:'Jill Mehta Bharatanatyam',
			comment: "Teacher Absent",
		},
		{
			prev: 3,
			next: 4,
			teacher:'Jill Mehta Bharatanatyam',
			comment: "Teacher Absent",
		},
		{
			prev: 4,
			next: 5,
			teacher:'Jill Mehta Bharatanatyam',
			comment: "Teacher Absent",
		},
	]

	return (
		<TableContainer component={Paper}>
			<Table aria-label="Rewards table">
				<TableHead>
					<TableRow>
						<TableCell>Previous </TableCell>
						<TableCell>Next </TableCell>
						<TableCell>Teacher </TableCell>
						<TableCell align="right">Comment</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rewardsHistory.map((row) => (
						<TableRow key={row.name}>
							<TableCell component="th" scope="row">
								{row.prev}
							</TableCell>
							<TableCell align="right">{row.next}</TableCell>
							<TableCell align="right">{row.teacher}</TableCell>
							<TableCell align="right">{row.comment}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default RewardsTable
