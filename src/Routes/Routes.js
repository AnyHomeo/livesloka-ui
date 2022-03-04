import React from "react"
import {Switch, Route} from "react-router-dom"
import Login from "../Pages/Login/Login"
import PasswordReset from "../Pages/Login/PasswordReset"
import DashboardLayout from "../DashboardLayout"
import NotFoundView from "../Pages/NotFoundView"
import {SnackbarProvider} from "notistack"
import Slide from "@material-ui/core/Slide"
import adminRoutes from "./permissions"
import AdminRoute from "../auth/AdminRoutes"
import PermissionController from "../Components/PermissionController"

function Routes() {
	return (
		<>
			<Switch>
				<Route path="/" exact component={Login} />
				<Route path="/login" exact component={Login} />
				<Route path="/password-reset" exact component={PasswordReset} />
				<Route path="/404" exact component={NotFoundView} />
				<SnackbarProvider
					maxSnack={10}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					TransitionComponent={Slide}
				>
					<DashboardLayout>
						{adminRoutes.map(({path, exact, component: Component,permission}) => (
							<AdminRoute
								path={path}
								exact={exact}
								component={() => (
									<PermissionController permission={permission} >
										<Component />
									</PermissionController>
								)}
							/>
						))}
					</DashboardLayout>
				</SnackbarProvider>
				<Route path="*" component={NotFoundView} />
			</Switch>
		</>
	)
}

export default Routes
