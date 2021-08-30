import "react-perfect-scrollbar/dist/css/styles.css"
import React, {useEffect} from "react"
import {Snackbar, ThemeProvider} from "@material-ui/core"
import GlobalStyles from "./Components/GlobalStyles"
import theme from "./theme"
import Routes from "./Routes/Routes"
import {ConfirmProvider} from "material-ui-confirm"
import "./main.css"
import {QueryClient, QueryClientProvider} from "react-query"
import {io} from "socket.io-client"
import {isAutheticated} from "./auth"
import {ToastContainer, toast} from "react-toastify"

import "react-toastify/dist/ReactToastify.css"
import {Link, useHistory, useLocation} from "react-router-dom"
let socket = io.connect(process.env.REACT_APP_API_KEY)

const queryClient = new QueryClient()
const App = () => {
	if (process.env.REACT_APP_STAGING === "PROD") console.log = function no_console() {}

	let users = []
	const history = useHistory()
	const location = useLocation()
	useEffect(() => {
		// socket = io.connect(process.env.REACT_APP_API_KEY)
		if (isAutheticated().roleId === 4) {
			socket.on("userWating", ({userID, roomID}) => {
				if (!users.find((el) => el === userID)) {
					// users.push(userID)
					console.log("/room/" + roomID)

					if (location.pathname === `/room/${roomID}`) {
						console.log(location.pathname)

						return
					}
					const message = (
						<div>
							<div onClick={() => handelToast(roomID)}>Chat with {userID}</div>
						</div>
					)
					toast.success(message, {
						position: "top-center",
						autoClose: false,
						hideProgressBar: true,
						closeOnClick: true,
						pauseOnHover: false,
						draggable: true,
						progress: undefined,
					})
				}
			})
		}
		return removeListners
	}, [location])

	useEffect(() => {
		// socket = io.connect(process.env.REACT_APP_API_KEY)

		if (isAutheticated().roleId === 4) {
			socket.on("agent-to-agent-assign", ({agentID, roomID, assigneID, user}) => {
				if (agentID === isAutheticated().userId) {
					const message = (
						<div>
							<div onClick={() => handelToast(roomID)}>
								{assigneID} assigned you {user}
							</div>
						</div>
					)
					toast.success(message, {
						position: "top-center",
						autoClose: false,
						hideProgressBar: true,
						closeOnClick: true,
						pauseOnHover: false,
						draggable: true,
						progress: undefined,
					})
				}
			})
		}
		return removeListners
	}, [])
	const removeListners = () => {
		socket.removeAllListeners()
	}
	const handelToast = (roomID) => {
		history.replace(`/room/${roomID}`)
	}

	return (
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<ConfirmProvider>
					<GlobalStyles />
					<Routes />
					<ToastContainer />
				</ConfirmProvider>
			</QueryClientProvider>
		</ThemeProvider>
	)
}

export default App
