import React, {useState, useEffect} from "react"
import clsx from "clsx"
import PropTypes from "prop-types"
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Grid,
	Typography,
	colors,
	makeStyles,
} from "@material-ui/core"
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"
import MoneyIcon from "@material-ui/icons/Money"
import CountUp from "react-countup"
import axios from "axios"
const moment = require("moment")

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

	const [usdVal, setUsdVal] = useState()

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
				{/* <Box mt={2} display="flex" alignItems="center">
          <ArrowDownwardIcon className={classes.differenceIcon} />
          <Typography className={classes.differenceValue} variant="body2">
            12%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography>
        </Box> */}
			</CardContent>
		</Card>
	)
}

Budget.propTypes = {
	className: PropTypes.string,
}

export default Budget
