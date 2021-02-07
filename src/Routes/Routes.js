import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "../Pages/Login/Login";
import PasswordReset from "../Pages/Login/PasswordReset";
import AdminRoute from "../auth/AdminRoutes";
import CustomerData from "../Pages/Admin/Crm/CustomerData";
import Invoice from "../Pages/invoice/Invoice";
import Generator from "../Pages/invoice/Generator";
import Invoices from "../Pages/invoice/Invoices";
import Attedance from "../Pages/Admin/Crm/Attedance";
import SideNav from "../Components/SideNav";
import CustomTabs from "../Components/CustomTabs";
import MeetingScheduler from "../Pages/Admin/Crm/MeetingScheduler";
import Scheduler from "../Pages/Admin/Scheduler/Scheduler";
import FinancialAnalytics from "../Pages/Analytics/FinancialAnalytics";
import TeacherDetails from "../Pages/Admin/Crm/TeacherDetails";
import UserPasswordReset from "../Pages/Admin/Crm/UserPasswordReset";
import EditSchedule from "../Pages/Admin/Crm/EditSchedule";
import AttedanceByClass from "../Pages/Admin/Crm/AttendanceByClass";
import EditAttendance from "../Pages/Admin/Crm/EditAttendance";
import MeetingDashboard from "../Pages/ZoomMeetings/MeetingDashboard";
import ZoomAccountDashboard from "../Pages/ZoomMeetings/ZoomAccountDashboard";
import DashboardLayout from "../DashboardLayout";
import Dashboard from "../Pages/reports";
import NotFoundView from "../Pages/NotFoundView";
import TeacherSalary from "../Pages/TeacherSalary";
import TeacherSalaries from "../Pages/Admin/Crm/TeacherSalaries";
import CustomerDetails from "../Pages/MobileView/CustomerDetails";
import CustomersDetailsMb from "../Pages/MobileView/CustomerDetails/CustomersDetailsMb";
import AddNewCustomer from "../Pages/MobileView/CustomerDetails/AddNewCustomer";
function Routes() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/password-reset" exact component={PasswordReset} />
          <Route path="/404" exact component={NotFoundView} />
          <DashboardLayout>
            <AdminRoute path="/dashboard" exact component={Dashboard} />
            <AdminRoute
              path="/zoom-dashboard"
              exact
              component={ZoomAccountDashboard}
            />
            <AdminRoute path="/customer-data" exact component={CustomerData} />
            <AdminRoute
              path="/customer-data-mobile"
              exact
              component={CustomerDetails}
            />
            <AdminRoute
              path="/customer-data-info"
              exact
              component={CustomersDetailsMb}
            />
            <AdminRoute
              path="/add-customer-mobile"
              exact
              component={AddNewCustomer}
            />
            <AdminRoute
              path="/teacher-salary"
              exact
              component={TeacherSalary}
            />
            <AdminRoute path="/add-fields" exact component={CustomTabs} />
            <AdminRoute path="/attendance" exact component={Attedance} />
            <AdminRoute
              path="/edit/attendance/:scheduleId/:date"
              exact
              component={EditAttendance}
            />
            <AdminRoute
              path="/teacherDetails"
              exact
              component={TeacherDetails}
            />
            <AdminRoute
              path="/meeting-scheduler"
              exact
              component={MeetingScheduler}
            />
            <AdminRoute
              path="/attendance/class"
              exact
              component={AttedanceByClass}
            />
            <AdminRoute path="/invoice-generator" exact component={Generator} />
            <AdminRoute path="/manual-invoice" exact component={Invoice} />
            <AdminRoute path="/invoices" exact component={Invoices} />
            <AdminRoute path="/scheduler" exact component={Scheduler} />
            <AdminRoute
              path="/analytics"
              exact
              component={FinancialAnalytics}
            />
            <AdminRoute
              path="/reset/password"
              exact
              component={UserPasswordReset}
            />
            <AdminRoute
              path="/edit-schedule/:id"
              exact
              component={EditSchedule}
            />
            <AdminRoute
              path="/zoom/dashboard"
              exact
              component={MeetingDashboard}
            />
            <AdminRoute
              path="/teacherSalaries"
              exact
              component={TeacherSalaries}
            />
            <AdminRoute path="/test" exact component={ZoomAccountDashboard} />
          </DashboardLayout>
          <Route path="*" component={NotFoundView} />
        </Switch>
      </Router>
    </>
  );
}

export default Routes;
