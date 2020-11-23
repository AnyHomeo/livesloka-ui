import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "../Pages/Login/Login";
import PasswordReset from "../Pages/Login/PasswordReset";
import Admin from "../Pages/Admin/Meetings/Admin";
import AdminRoute from "../auth/AdminRoutes";
import CustomerData from "../Pages/Admin/Crm/CustomerData";
import Comments from "../Pages/Admin/Crm/Comments";
import Invoice from "../Pages/invoice/Invoice";
import Generator from "../Pages/invoice/Generator";
import Invoices from "../Pages/invoice/Invoices";
import Attedance from "../Pages/Admin/Crm/Attedance";
import SideNav from "../Components/SideNav";
import CustomTabs from "../Components/CustomTabs";
import Timeslot from "../Pages/Admin/Crm/Timeslot";

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
          <AdminRoute path="/invoice-generator" exact component={Generator} />
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
            <Route path="/attendance" exact component={Attedance} />
            <Route path="/time-slot" exact component={Timeslot} />
            <AdminRoute path="/manual-invoice" exact component={Invoice} />
            <AdminRoute path="/invoices" exact component={Invoices} />
          </SideNav>
        </Switch>
      </Router>
    </>
  );
}

export default Routes;
