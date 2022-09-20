import React from "react"
import clsx from "clsx"
import PropTypes from "prop-types"
import {Avatar, Card, CardContent, Grid, Typography, colors, makeStyles} from "@material-ui/core"
import MoneyIcon from "@material-ui/icons/Money"
import CountUp from "react-countup"

const useStyles = makeStyles((theme) => ({
	root: {
		height: "100%",
	},
	avatar: {
		backgroundColor: "#6ab04c",
		height: 56,
		width: 56,
	},
	differenceIcon: {
		color: colors.red[900],
	},
	differenceValue: {
		color: colors.red[900],
		marginRight: theme.spacing(1),
	},
}))

const Budget = ({dataa, amount, className, ...rest}) => {
	const classes = useStyles()
	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<CardContent>
				<Grid container justify="space-between" spacing={3}>
					<Grid item>
						<Typography color="textSecondary" gutterBottom variant="h6">
							TOTAL AMOUNT
						</Typography>
						<Typography color="textPrimary" variant="h3">
							$ {isNaN(amount) ? amount : <CountUp start={0} end={amount} separator="," />}
							{/* ₹ {amount * 73.08} */}
						</Typography>
					</Grid>
					<Grid item>
						<Avatar className={classes.avatar}>
							<MoneyIcon />
						</Avatar>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	)
}

Budget.propTypes = {
	className: PropTypes.string,
}

export default Budget
