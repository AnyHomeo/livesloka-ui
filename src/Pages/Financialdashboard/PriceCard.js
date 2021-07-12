import {Card, makeStyles} from "@material-ui/core"
import React from "react"
import AccountBalanceOutlinedIcon from "@material-ui/icons/AccountBalanceOutlined"
import MoneyOutlinedIcon from "@material-ui/icons/MoneyOutlined"
import MoneyOffOutlinedIcon from "@material-ui/icons/MoneyOffOutlined"
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined"
const PriceCard = ({data}) => {
	const useStyles = makeStyles(() => ({
		linearGrad: {
			backgroundImage: data.gradient,
			height: 150,
			width: "100%",
			color: "white",
			padding: 20,
			borderRadius: 10,
		},
		cardTitle: {
			fontSize: 24,
		},
		iconCont: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginTop: 15,
		},
		amount: {
			fontSize: 40,
			fontWeight: "bold",
		},
		icon: {
			height: 50,
			width: 50,
		},
	}))

	const classes = useStyles()
	return (
		<Card className={classes.linearGrad}>
			<div>
				<p className={classes.cardTitle}>{data.title}</p>
			</div>

			<div className={classes.iconCont}>
				<div>
					{data.title === "Net Amount" ? (
						<AccountBalanceOutlinedIcon className={classes.icon} />
					) : data.title === "Salary" ? (
						<MoneyOutlinedIcon className={classes.icon} />
					) : data.title === "Expenses" ? (
						<MoneyOffOutlinedIcon className={classes.icon} />
					) : (
						<AccountBalanceWalletOutlinedIcon className={classes.icon} />
					)}
				</div>

				<div>
					<p className={classes.amount}>{data.amount}</p>
				</div>
			</div>
		</Card>
	)
}

export default PriceCard
