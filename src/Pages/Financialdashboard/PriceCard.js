import {Card, IconButton, makeStyles} from "@material-ui/core"
import React from "react"
import AccountBalanceOutlinedIcon from "@material-ui/icons/AccountBalanceOutlined"
import MoneyOutlinedIcon from "@material-ui/icons/MoneyOutlined"
import MoneyOffOutlinedIcon from "@material-ui/icons/MoneyOffOutlined"
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined"
import CountUp from "react-countup"
import AddOutlinedIcon from "@material-ui/icons/AddOutlined"
import {Link} from "react-router-dom"
const PriceCard = ({data, setShowExpenses, showExpenses}) => {
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
		topCont: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
		},
	}))

	const classes = useStyles()
	return (
		<Card
			className={classes.linearGrad}
			style={{cursor: data.title === "Expenses" ? "pointer" : ""}}
			onClick={() => {
				if (data.title === "Expenses") {
					setShowExpenses(!showExpenses)
				}
			}}
		>
			<div className={classes.topCont}>
				<div>
					<p className={classes.cardTitle}>{data.title}</p>
				</div>

				{data.title === "Expenses" ? (
					<IconButton>
						<Link to="/expenses">
							<AddOutlinedIcon style={{color: "white"}} />
						</Link>
					</IconButton>
				) : null}
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
					<p className={classes.amount}>
						{!isNaN(data.amount) && <CountUp start={0} end={data.amount} separator="," />}

						{/* {data.amount} */}
					</p>
				</div>
			</div>
		</Card>
	)
}

export default PriceCard
