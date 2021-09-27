import {Container} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import Axios from "axios"
import Lottie from "react-lottie"
import loadingAnimation from "../../Images/loading.json"
import TransactionCard from "./TransactionCard"
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
	useEffect(() => {
		getProducts()
	}, [refresh])

	const getProducts = async () => {
		setLoading(true)
		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/subscriptions/`)

			console.log(data)
			setSubscription(data?.data.result || [])
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	// useEffect(() => {
	// 	filterData()
	// }, [searchKeyword])

	// const filterData = () => {
	//     console.log(subscription)
	// 	let regex = new RegExp(`^${searchKeyword}`, `i`)
	// 	const sortedArr =
	//     subscription &&
	// 		subscription.filter(
	// 			(x) => regex.test(x.name.toLowerCase()) || regex.test(x.description.toLowerCase())
	// 		)

	// 	setFilteredData(sortedArr)
	// }

	if (loading) {
		return <Lottie options={defaultOptions} height={400} width={400} />
	}

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
						{/* <div>
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
						</div> */}
					</div>
				</div>

				{subscription &&
					subscription.map((subs, i) => (
						<TransactionCard key={subs.id} data={subs} refresh={refresh} />
					))}
			</Container>
		</div>
	)
}

export default Transactions
