import "react-perfect-scrollbar/dist/css/styles.css"
import React, {useCallback, useEffect} from "react"
import {ThemeProvider} from "@material-ui/core"
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
import {useHistory, useLocation} from "react-router-dom"
import GlobalState from "./context/GlobalState"
let socket

const queryClient = new QueryClient()
const App = () => {
	if (process.env.REACT_APP_STAGING === "PROD") console.log = function no_console() {}

	const history = useHistory()
	const location = useLocation()

	const handelToast = useCallback(
		(roomID) => {
			history.replace(`/room/${roomID}`)
		},
		[history]
	)

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_API_KEY)
		if (isAutheticated().roleId !== 3) {
			let users = []
			socket.on("userWating", ({userID, roomID, typeMessage}) => {
				if (!users.find((el) => el === userID)) {
					console.log("/room/" + roomID)

					if (location.pathname === `/room/${roomID}`) {
						console.log(location.pathname)

						return
					}
					const message = (
						<div>
							<div onClick={() => handelToast(roomID)}>
								User {userID} : {typeMessage}
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
	}, [location, handelToast])

	useEffect(() => {
		if (isAutheticated().roleId !== 3) {
			socket.on("agent-to-agent-assign", ({agentID, roomID, assigneID, user}) => {
				console.log("agent-t0 assign", agentID, roomID, agentID === isAutheticated().userId)
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
	}, [location, handelToast])
	const removeListners = () => {
		socket.removeAllListeners()
	}

	return (
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<ConfirmProvider>
					<GlobalState>
						<GlobalStyles />
						<Routes />
						<ToastContainer />
					</GlobalState>
				</ConfirmProvider>
			</QueryClientProvider>
		</ThemeProvider>
	)
}

export default App
