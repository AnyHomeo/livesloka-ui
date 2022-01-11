import React, {useEffect, useState} from "react"
import TableContainer from "@material-ui/core/TableContainer"
import {Paper} from "@material-ui/core"
import {Table} from "@material-ui/core"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import TableBody from "@material-ui/core/TableBody"
import Axios from "axios"

function RewardsTable({redeems}) {
	return (
		<TableContainer component={Paper}>
			<Table aria-label="Rewards table">
				<TableHead>
					<TableRow>
						<TableCell>Previous </TableCell>
						<TableCell>Next </TableCell>
						<TableCell align="right">Comment</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{redeems.map((row) => (
						<TableRow key={row.name}>
							<TableCell component="th" scope="row">
								{row.prev}
							</TableCell>
							<TableCell align="right">{row.present}</TableCell>
							<TableCell align="right">{row.message}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default RewardsTable
