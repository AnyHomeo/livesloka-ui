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
<<<<<<< HEAD
import TeacherDetails from "../Pages/Admin/Crm/TeacherDetails"
=======
import UserPasswordReset from "../Pages/Admin/Crm/UserPasswordReset";
>>>>>>> 63c4031f7eaef9523f68a4bd07d41ae085f83300

function Routes() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/password-reset" exact component={PasswordReset} />
          <SideNav>
            <AdminRoute path="/customer-data" exact component={CustomerData} />
            <AdminRoute path="/add-fields" exact component={CustomTabs} />
            <AdminRoute path="/attendance" exact component={Attedance} />
            <AdminRoute path="/teacherDetails" exact component={TeacherDetails} />
            <AdminRoute
              path="/meeting-scheduler"
              exact
              component={MeetingScheduler}
            />
            <AdminRoute path="/invoice-generator" exact component={Generator} />
            <AdminRoute path="/manual-invoice" exact component={Invoice} />
            <AdminRoute path="/invoices" exact component={Invoices} />
            <Route path="/scheduler" exact component={Scheduler} />
            <Route path="/Analytics" exact component={FinancialAnalytics} />
            <Route path="/reset/password" exact component={UserPasswordReset} />
          </SideNav>
        </Switch>
      </Router>
    </>
  );
}

export default Routes;
