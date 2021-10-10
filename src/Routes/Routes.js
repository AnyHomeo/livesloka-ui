import React from "react"
import { Switch, Route} from "react-router-dom"
import Login from "../Pages/Login/Login"
import PasswordReset from "../Pages/Login/PasswordReset"
import AdminRoute from "../auth/AdminRoutes"
import CustomerData from "../Pages/Admin/Crm/CustomerData"
import Invoice from "../Pages/invoice/Invoice"
import Generator from "../Pages/invoice/Generator"
import Invoices from "../Pages/invoice/Invoices"
import Attedance from "../Pages/Admin/Crm/Attedance"
import CustomTabs from "../Components/CustomTabs"
import MeetingScheduler from "../Pages/Admin/Crm/MeetingScheduler"
import Scheduler from "../Pages/Admin/Scheduler/Scheduler"
import FinancialAnalytics from "../Pages/Analytics/FinancialAnalytics"
import TeacherDetails from "../Pages/Admin/Crm/TeacherDetails"
import NewTeacherDetails from "../Pages/Admin/Crm/NewTeacherData"
import UserPasswordReset from "../Pages/Admin/Crm/UserPasswordReset"
import EditSchedule from "../Pages/Admin/Crm/EditSchedule"
import AttedanceByClass from "../Pages/Admin/Crm/AttendanceByClass"
import EditAttendance from "../Pages/Admin/Crm/EditAttendance"
import MeetingDashboard from "../Pages/ZoomMeetings/MeetingDashboard"
import ZoomAccountDashboard from "../Pages/ZoomMeetings/ZoomAccountDashboard"
import DashboardLayout from "../DashboardLayout"
import Dashboard from "../Pages/reports"
import NotFoundView from "../Pages/NotFoundView"
import TeacherSalary from "../Pages/TeacherSalary"
import TeacherSalaries from "../Pages/Admin/Crm/TeacherSalaries"
import CustomerDetails from "../Pages/MobileView/CustomerDetails"
import CustomersDetailsMb from "../Pages/MobileView/CustomerDetails/CustomersDetailsMb"
import AddNewCustomer from "../Pages/MobileView/CustomerDetails/AddNewCustomer"
import LeavesTabs from "./../Pages/Leaves/LeavesTabs"
import PaymentsPage from "../Pages/reports/PaymentsPage"
import UpdateNumberOfBoughtClasses from "./../Pages/Admin/Crm/UpdateNumberOfBoughtClasses"
import AvailableMeetingSchedule from "../Pages/Admin/Crm/AvailableMeetingSchedule"
import Stats from "../Pages/Statistics/Statistics"
import SummerCampsCustomerTable from "../Pages/Admin/Crm/SummerCampsCustomerTable"
import DemoAndInclassStudents from "../Components/DemoAndInclassStudents"
import Careers from "../Pages/Admin/Crm/Careers"
import NotificationSettings from "../Pages/BroadcastMessages/NotificationSettings"
import NotificationsTable from "../Pages/BroadcastMessages/NotificationsTable"
import FinancialDashboard from "../Pages/Financialdashboard"
import Expenseform from "../Pages/Financialdashboard/Expenseform"
import {SnackbarProvider} from "notistack"
import Slide from "@material-ui/core/Slide"
import {AddSubjects} from "../Pages/Subjects"
import ChatRoom from "../Pages/ChatRoom"
import NonChatRoom from "../Pages/NonChatRoom"
import Options from "../Pages/SubscriptionScheduler/Options"
import Groups from "../Pages/Groups"
import ProductAndPlans from "../Pages/ProductsAndPlans"
import {SubscriptionTransactions} from "../Pages/SubscriptionTransactions"
import {Folders, Videomanager} from "../Pages/Videomanager"
import CategorizeVideo from "../Pages/Videomanager/CategorizeVideo"

function Routes() {
	return (
		<>
			<Switch>
				<Route path="/" exact component={Login} />
				<Route path="/login" exact component={Login} />
				<Route path="/password-reset" exact component={PasswordReset} />
				<Route path="/404" exact component={NotFoundView} />
				<SnackbarProvider
					maxSnack={3}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					TransitionComponent={Slide}
				>
					<DashboardLayout>
						<AdminRoute path="/dashboard" exact component={Dashboard} />
						<AdminRoute path="/financial" exact component={FinancialDashboard} />
						<AdminRoute path="/inclass" exact component={DemoAndInclassStudents} />
						<AdminRoute path="/update/classes" exact component={UpdateNumberOfBoughtClasses} />
						<AdminRoute path="/update/classes/:id" exact component={UpdateNumberOfBoughtClasses} />
						<AdminRoute path="/zoom-dashboard" exact component={ZoomAccountDashboard} />
						<AdminRoute path="/customer-data" exact component={CustomerData} />
						<AdminRoute path="/customer-data-mobile" exact component={CustomerDetails} />
						<AdminRoute path="/customer-data-info" exact component={CustomersDetailsMb} />
						<AdminRoute path="/statistics" exact component={Stats} />
						<AdminRoute path="/add-customer-mobile" exact component={AddNewCustomer} />
						<AdminRoute path="/teacher-salary" exact component={TeacherSalary} />
						<AdminRoute path="/add-fields" exact component={CustomTabs} />
						<AdminRoute path="/attendance" exact component={Attedance} />
						<AdminRoute path="/summercamps" exact component={SummerCampsCustomerTable} />
						<AdminRoute
							path="/edit/attendance/:scheduleId/:date"
							exact
							component={EditAttendance}
						/>
						<AdminRoute path="/teacherDetails" exact component={TeacherDetails} />
						<AdminRoute path="/teacher" exact component={NewTeacherDetails} />
						<AdminRoute path="/meeting-scheduler" exact component={MeetingScheduler} />
						<AdminRoute
							path="/availabe-scheduler/:slot/:teacher"
							exact
							component={AvailableMeetingSchedule}
						/>
						<AdminRoute path="/attendance/class" exact component={AttedanceByClass} />
						<AdminRoute path="/invoice-generator" exact component={Generator} />
						<AdminRoute path="/payments" exact component={PaymentsPage} />
						<AdminRoute path="/careers" exact component={Careers} />
						<AdminRoute path="/manual-invoice" exact component={Invoice} />
						<AdminRoute path="/invoices" exact component={Invoices} />
						<AdminRoute path="/scheduler" exact component={Scheduler} />
						<AdminRoute path="/leaves" exact component={LeavesTabs} />
						<AdminRoute path="/Messages" exact component={NotificationSettings} />
						<AdminRoute path="/analytics" exact component={FinancialAnalytics} />
						<AdminRoute path="/reset/password" exact component={UserPasswordReset} />
						<AdminRoute path="/edit-schedule/:id" exact component={EditSchedule} />
						<AdminRoute path="/zoom/dashboard" exact component={MeetingDashboard} />
						<AdminRoute path="/teacherSalaries" exact component={TeacherSalaries} />
						<AdminRoute path="/test" exact component={ZoomAccountDashboard} />
						<AdminRoute path="/notifications" exact component={NotificationsTable} />
						<AdminRoute path="/expenses" exact component={Expenseform} />
						<AdminRoute path="/add-subjects" exact component={AddSubjects} />
						<AdminRoute path="/options" exact component={Options} />
						<AdminRoute path="/room/:roomID" exact component={ChatRoom} />
						<AdminRoute path="/room" exact component={ChatRoom} />
						<AdminRoute path="/nonroom/:roomID" exact component={NonChatRoom} />
						<AdminRoute path="/nonroom" exact component={NonChatRoom} />
						<AdminRoute path="/group/:groupID" exact component={Groups} />
						<AdminRoute path="/group" exact component={Groups} />
						<AdminRoute path="/products" exact component={ProductAndPlans} />
						<AdminRoute path="/subscription-data" exact component={SubscriptionTransactions} />
						<AdminRoute path="/video-folders" exact component={Folders} />
						<AdminRoute path="/video-folders/:id" exact component={Videomanager} />
						<AdminRoute path="/video-folders/:type/:id" exact component={CategorizeVideo} />
					</DashboardLayout>
				</SnackbarProvider>
				<Route path="*" component={NotFoundView} />
			</Switch>
		</>
	)
}

export default Routes
