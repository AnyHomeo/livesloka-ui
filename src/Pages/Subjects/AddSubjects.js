import {Container, IconButton} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import {Plus} from "react-feather"
import SubjectCards from "./SubjectCards"
import SubjectModal from "./SubjectModal"
import Axios from "axios"
import Lottie from "react-lottie"
import loadingAnimation from "../../Images/loading.json"
import AddPlans from "./AddPlans"
import {Alert} from "@material-ui/lab"
import {Snackbar} from "@material-ui/core"

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
let snackbarInitialState = {
	isShown: false,
	message: "",
	type: "error",
}
const AddSubjects = () => {
	const classes = useStyles()
	const [subjects, setSubjects] = useState([])
	const [modalOpen, setModalOpen] = useState(false)
	const [addPlanOpen, setAddPlanOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [refresh, setRefresh] = useState(false)
	const [message, setMessage] = useState(snackbarInitialState)

	useEffect(() => {
		getProducts()
	}, [refresh])

	const getProducts = async () => {
		setLoading(true)
		try {
			const data = await Axios.get(`${process.env.REACT_APP_API_KEY}/subscriptions/get/products`)
			setSubjects(data?.data.result?.products || [])
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	const getback = (status) => {
		if (status === 200) {
			getProducts()
		}
	}

	if (loading) {
		return <Lottie options={defaultOptions} height={400} width={400} />
	}

	const handleSnackbarClose = () => setMessage(snackbarInitialState)

	return (
		<div>
			<Snackbar
				open={message.isShown}
				autoHideDuration={6000}
				anchorOrigin={{vertical: "top", horizontal: "right"}}
				onClose={() => handleSnackbarClose()}
			>
				<Alert onClose={() => handleSnackbarClose()} variant="filled" severity={message.type}>
					{message.message}
				</Alert>
			</Snackbar>
			<Container>
				<div className={classes.container}>
					<p style={{fontSize: 24}}>Livesloka Products</p>

					<div style={{display: "flex"}}>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								marginRight: 10,
							}}
						>
							<IconButton
								style={{
									backgroundColor: "#3867d6",
									boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
									height: 55,
									width: 55,
									marginBottom: 10,
								}}
								onClick={() => setModalOpen(!modalOpen)}
							>
								<Plus style={{color: "white"}} />
							</IconButton>
							<p>Add Subject</p>
						</div>

						<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
							<IconButton
								style={{
									backgroundColor: "#3867d6",
									boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
									height: 55,
									width: 55,
									marginLeft: 10,
									marginBottom: 10,
								}}
								onClick={() => setAddPlanOpen(!addPlanOpen)}
							>
								<Plus style={{color: "white"}} />
							</IconButton>
							<p>Add Plan</p>
						</div>
					</div>
				</div>
				{subjects &&
					subjects.map((subject, i) => (
						<SubjectCards key={subject.id} data={subject} refresh={refresh} />
					))}
			</Container>
			<SubjectModal
				open={modalOpen}
				setOpen={setModalOpen}
				getback={getback}
				setRefresh={setRefresh}
				setMessage={setMessage}
			/>
			<AddPlans
				open={addPlanOpen}
				setOpen={setAddPlanOpen}
				getback={getback}
				products={subjects}
				setMessage={setMessage}
			/>
		</div>
	)
}

export default AddSubjects
