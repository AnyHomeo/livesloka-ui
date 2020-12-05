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
import TimeSlots from "../Pages/Admin/Crm/TimeSlots";
import TeachersStudents from '../Pages/TeachersStudents'

function Routes() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/password-reset" exact component={PasswordReset} />
          {/* <Route path="/comments" exact component={Comments} />
          <AdminRoute path="/meeting-schedule" exact component={Scheduler} />
          <AdminRoute path="/admin" exact component={Adminsidebar} />
          <AdminRoute path="/admin-meeting" exact component={Admin} />
          <AdminRoute path="/add-teacher" exact component={AddTeachers} />
          <AdminRoute path="/add-student" exact component={AddStudent} /> */}
          {/* <AdminRoute
            path="/meeting-details"
            exact
            component={MeetingDetails}
          /> */}
          <SideNav>
            <AdminRoute path="/customer-data" exact component={CustomerData} />
            <AdminRoute path="/add-fields" exact component={CustomTabs} />
            <AdminRoute path="/attendance" exact component={Attedance} />
            <AdminRoute path="/time-slots" exact component={TimeSlots} />
            <AdminRoute
              path="/meeting-scheduler"
              exact
              component={MeetingScheduler}
            />
            <AdminRoute path="/invoice-generator" exact component={Generator} />
            <AdminRoute path="/manual-invoice" exact component={Invoice} />
            <AdminRoute path="/invoices" exact component={Invoices} />
            <AdminRoute path="/TeachersStudents" exact component={TeachersStudents} />
          </SideNav>
        </Switch>
      </Router>
    </>
  );
}

export default Routes;
