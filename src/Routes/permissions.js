import CustomerData from "../Pages/Admin/Crm/CustomerData"
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
import Dashboard from "../Pages/reports"
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
import {AddSubjects} from "../Pages/Subjects"
import ChatRoom from "../Pages/ChatRoom"
import NonChatRoom from "../Pages/NonChatRoom"
import Options from "../Pages/SubscriptionScheduler/Options"
import Groups from "../Pages/Groups"
import ProductAndPlans from "../Pages/ProductsAndPlans"
import {SubscriptionTransactions} from "../Pages/SubscriptionTransactions"
import {Folders, Videomanager} from "../Pages/Videomanager"
import CategorizeVideo from "../Pages/Videomanager/CategorizeVideo"
import UpdateNumberOfBoughtRewards from "../Pages/Admin/Crm/UpdateNumberOfRewards"
import InvoicePages from "../Pages/Accountant/InvoicePages"

const adminRoutes = [
	{ permission:"Financial Dashboard", path: "/dashboard", exact: true, component: Dashboard},
	{ permission:"Financial Dashboard", path: "/financial", exact: true, component: FinancialDashboard},
	{ permission:"Customer Data", path: "/inclass", exact: true, component: DemoAndInclassStudents},
	{ permission:"Update Classes Paid", path: "/update/classes", exact: true, component: UpdateNumberOfBoughtClasses},
	{ permission:"Update Classes Paid", path: "/update/classes/:id", exact: true, component: UpdateNumberOfBoughtClasses},
	{ permission:"Customer Data", path: "/update/rewards", exact: true, component: UpdateNumberOfBoughtRewards},
	{ permission:"Customer Data", path: "/update/rewards/:id", exact: true, component: UpdateNumberOfBoughtRewards},
	{ permission:"Zoom Dashboard", path: "/zoom-dashboard", exact: true, component: ZoomAccountDashboard},
	{ permission:"Customer Data", path: "/customer-data", exact: true, component: CustomerData},
	{ permission:"Customer Data", path: "/customer-data-mobile", exact: true, component: CustomerDetails},
	{ permission:"Customer Data", path: "/customer-data-info", exact: true, component: CustomersDetailsMb},
	{ permission:"Statistics", path: "/statistics", exact: true, component: Stats},
	{ permission:"Customer Data", path: "/add-customer-mobile", exact: true, component: AddNewCustomer},
	{ permission:"Teachers Salary", path: "/teacher-salary", exact: true, component: TeacherSalary},
	{ permission:"Add Fields", path: "/add-fields", exact: true, component: CustomTabs},
	{ permission:"Attendance", path: "/attendance", exact: true, component: Attedance},
	{ permission:"Summer Camp Data", path: "/summercamps", exact: true, component: SummerCampsCustomerTable},
	{ permission:"Attendance", path: "/edit/attendance/:scheduleId/:date", exact: true, component: EditAttendance},
	{ permission:"Teachers Data", path: "/teacherDetails", exact: true, component: TeacherDetails},
	{ permission:"Teachers Data", path: "/teacher", exact: true, component: NewTeacherDetails},
	{ permission:"Scheduler", path: "/meeting-scheduler", exact: true, component: MeetingScheduler},
	{ permission:"Scheduler", path: "/availabe-scheduler/:slot/:teacher", exact: true, component: AvailableMeetingSchedule},
	{ permission:"Attendance", path: "/attendance/class", exact: true, component: AttedanceByClass},
	{ permission:"Payments", path: "/payments", exact: true, component: PaymentsPage},
	{ permission:"Careers Applications", path: "/careers", exact: true, component: Careers},
	{ permission:"Scheduler", path: "/scheduler", exact: true, component: Scheduler},
	{ permission:"Leaves", path: "/leaves", exact: true, component: LeavesTabs},
	{ permission:"Messages", path: "/Messages", exact: true, component: NotificationSettings},
	{ permission:"Financial Dashboard", path: "/analytics", exact: true, component: FinancialAnalytics},
	{ permission:"Reset Password", path: "/reset/password", exact: true, component: UserPasswordReset},
	{ permission:"Scheduler", path: "/edit-schedule/:id", exact: true, component: EditSchedule},
	{ permission:"Zoom Dashboard", path: "/zoom/dashboard", exact: true, component: MeetingDashboard},
	{ permission:"Teachers Salary", path: "/teacherSalaries", exact: true, component: TeacherSalaries},
	{ permission:"Broadcast Notifications", path: "/notifications", exact: true, component: NotificationsTable},
	{ permission:"Financial Dashboard", path: "/expenses", exact: true, component: Expenseform},
	{ permission:"Paypal & Stripe", path: "/add-subjects", exact: true, component: AddSubjects},
	{ permission:"Options", path: "/options", exact: true, component: Options},
	{ permission:"Messages", path: "/room/:roomID", exact: true, component: ChatRoom},
	{ permission:"Messages", path: "/room", exact: true, component: ChatRoom},
	{ permission:"Messages", path: "/nonroom/:roomID", exact: true, component: NonChatRoom},
	{ permission:"Messages", path: "/nonroom", exact: true, component: NonChatRoom},
	{ permission:"Payments", path: "/subscription-data/:id", exact: true, component: SubscriptionTransactions},
	{ permission:"Messages", path: "/group/:groupID", exact: true, component: Groups},
	{ permission:"Messages", path: "/group", exact: true, component: Groups},
	{ permission:"Paypal & Stripe", path: "/products", exact: true, component: ProductAndPlans},
	{ permission:"Paypal & Stripe", path: "/subscription-data", exact: true, component: SubscriptionTransactions},
	{ permission:"Video Manager", path: "/video-folders", exact: true, component: Folders},
	{ permission:"Video Manager", path: "/video-folders/:id", exact: true, component: Videomanager},
	{ permission:"Video Manager", path: "/video-folders/:type/:id", exact: true, component: CategorizeVideo},
	{ permission:"Accounts", path: "/accountant/invoice", exact: true, component: InvoicePages},
]

export default adminRoutes