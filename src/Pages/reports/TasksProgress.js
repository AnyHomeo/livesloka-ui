import React from "react"
import clsx from "clsx"
import PropTypes from "prop-types"
import {Avatar, Card, CardContent, Grid, Typography, makeStyles} from "@material-ui/core"
import InsertChartIcon from "@material-ui/icons/InsertChartOutlined"

const useStyles = makeStyles(() => ({
	root: {
		height: "100%",
	},
	avatar: {
		backgroundColor: "#27ae60",
		height: 56,
		width: 56,
	},
}))

const TasksProgress = ({success, className, ...rest}) => {
	const classes = useStyles()

	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<CardContent>
				<Grid container justify="space-between" spacing={3}>
					<Grid item>
						<Typography color="textSecondary" gutterBottom variant="h6" style={{fontSize: 12}}>
							SUCCESS TRANSACTIONS
						</Typography>
						<Typography color="textPrimary" variant="h3">
							{success}
						</Typography>
					</Grid>
					<Grid item>
						<Avatar className={classes.avatar}>
							<InsertChartIcon />
						</Avatar>
					</Grid>
				</Grid>
				{/* <Box mt={3}>
          <LinearProgress value={75.5} variant="determinate" />
        </Box> */}
			</CardContent>
		</Card>
	)
}

TasksProgress.propTypes = {
	className: PropTypes.string,
}

export default TasksProgress
