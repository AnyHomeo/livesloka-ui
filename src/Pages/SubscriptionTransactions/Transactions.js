import {Container, IconButton, InputBase, Paper, Button} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import Axios from "axios"
import Lottie from "react-lottie"
import loadingAnimation from "../../Images/loading.json"
import TransactionCard from "./TransactionCard"
import {useParams} from "react-router"
import SearchIcon from "@material-ui/icons/Search"

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: loadingAnimation,
	rendererSettings: {
		preserveAspectRatio: "xMidYMid slice",
	},
}

const useStyles = makeStyles((theme) => ({
	inputField: {
		padding: "2px 4px",
		display: "flex",
		alignItems: "center",
		width: 400,
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
	container: {
		marginTop: 30,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	card: {
		height: 80,
		width: "100%",
		boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
		borderRadius: 10,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
	},
	info: {
		display: "flex",
		alignItems: "center",
		flex: 0.333,
	},
	Button: {
		height: 50,
		width: 150,
		border: "1px solid #0984e3",
		margin: 5,
	},
	activeButton: {
		height: 50,
		width: 150,
		margin: 5,
		backgroundColor: "#0984e3",
		color: "white",

		"&:hover": {
			backgroundColor: "#0984e3",
		},
	},
}))

let snackbarInitialState = {
	isShown: false,
	message: "",
	type: "error",
}
const Transactions = () => {
	const classes = useStyles()
	const [subscription, setSubscription] = useState([])
	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(false)
	const [searchKeyword, setSearchKeyword] = useState("")
	const [filteredData, setFilteredData] = useState([])
	const [isActive, setIsActive] = useState(1)
	const params = useParams()
	useEffect(() => {
		getProducts()
	}, [refresh, isActive])

	const getProducts = async () => {
		setLoading(true)
		try {
			const data = await Axios.get(
				`${process.env.REACT_APP_API_KEY}/subscriptions/customer/${params?.id}?isActive=${isActive}`
			)
			console.log(data)
			setSubscription(data?.data.result || [])
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	useEffect(() => {
		filterData()
	}, [searchKeyword])

	const filterData = () => {
		let regex = new RegExp(`^${searchKeyword}`, `i`)
		const sortedArr =
			subscription && subscription.filter((x) => regex.test(x?.customerId?.firstName.toLowerCase()))

		setFilteredData(sortedArr)
	}

	if (loading) {
		return <Lottie options={defaultOptions} height={400} width={400} />
	}
	console.log(isActive)
	return (
		<div>
			<Container>
				<div className={classes.container}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
						}}
					>
						<p style={{fontSize: 24}}>Livesloka Subscription</p>
						<div>
							<Paper className={classes.inputField}>
								<InputBase
									onChange={(e) => setSearchKeyword(e.target.value)}
									className={classes.input}
									placeholder="Search Subjects"
								/>
								<IconButton className={classes.iconButton} aria-label="search">
									<SearchIcon />
								</IconButton>
							</Paper>
						</div>
					</div>
				</div>

				<div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
					<div>
						<Button
							className={isActive === 1 ? classes.activeButton : classes.Button}
							onClick={() => {
								setIsActive(1)
							}}
						>
							Active
						</Button>
						<Button
							className={isActive === 0 ? classes.activeButton : classes.Button}
							onClick={() => {
								setIsActive(0)
							}}
						>
							Cancelled
						</Button>
					</div>
				</div>

				{searchKeyword ? (
					<>
						{filteredData &&
							filteredData.map((subject, i) => (
								<TransactionCard key={subject.id} data={subject} refresh={refresh} />
							))}
					</>
				) : (
					<>
						{subscription &&
							subscription.map((subs, i) => (
								<TransactionCard key={subs.id} data={subs} refresh={refresh} />
							))}
					</>
				)}
			</Container>
		</div>
	)
}

export default Transactions
