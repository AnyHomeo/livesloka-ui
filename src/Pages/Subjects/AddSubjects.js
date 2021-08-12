import {Container, IconButton} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import {Plus} from "react-feather"
import SubjectCards from "./SubjectCards"
import SubjectModal from "./SubjectModal"
import Axios from "axios"
import Lottie from "react-lottie"
import loadingAnimation from "../../Images/loading.json"

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: loadingAnimation,
	rendererSettings: {
		preserveAspectRatio: "xMidYMid slice",
	},
}

const useStyles = makeStyles({
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
})
const AddSubjects = () => {
	const classes = useStyles()

	const [paypalToken, setPaypalToken] = useState("")
	const [subjects, setSubjects] = useState([])
	const [modalOpen, setModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		getToken(true)
	}, [])

	const getToken = async (isProductsCallNeeded) => {
		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/scripts/paypal/access-token`)
			setPaypalToken(data?.data?.result)
			if (isProductsCallNeeded) {
				getProducts(data?.data?.result)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const getProducts = async (token) => {
		try {
			setLoading(true)
			let config = {
				headers: {
					Authorization: `Bearer ${token ? token : paypalToken}`,
					"Content-Type": "application/json",
				},
			}
			const data = await Axios.get(
				`${process.env.REACT_APP_PAYPAL_URL}/v1/catalogs/products`,
				config
			)
			console.log(data)
			setSubjects(data?.data?.products)
			setLoading(false)
		} catch (error) {
			setLoading(false)
			console.log(error)
		}
	}

	const getback = (status) => {
		if (status === 201) {
			getProducts()
		}
	}

	if (loading) {
		return <Lottie options={defaultOptions} height={400} width={400} />
	}

	return (
		<div>
			<Container>
				<div className={classes.container}>
					<p style={{fontSize: 24}}>Add new subject</p>
					<IconButton
						style={{
							backgroundColor: "#3867d6",
							boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
							height: 55,
							width: 55,
						}}
						onClick={() => setModalOpen(!modalOpen)}
					>
						<Plus style={{color: "white"}} />
					</IconButton>
				</div>

				{subjects && subjects.map((subject, i) => <SubjectCards key={subject.id} data={subject} />)}
			</Container>
			<SubjectModal
				open={modalOpen}
				setOpen={setModalOpen}
				paypalToken={paypalToken}
				getback={getback}
			/>
		</div>
	)
}

export default AddSubjects
