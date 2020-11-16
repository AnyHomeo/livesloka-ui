import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "../Pages/Login/Login";
import PasswordReset from "../Pages/Login/PasswordReset";
import PrivateRoute from "../auth/PrivateRoutes";
import Adminsidebar from "../Pages/Admin/Adminsidebar";
import Admin from "../Pages/Admin/Meetings/Admin";
import AddTeachers from "../Pages/Admin/Teachers/AddTeachers";
import AddStudent from "../Pages/Admin/Students/AddStudent";
import AdminRoute from "../auth/AdminRoutes";
import MeetingDetails from "../Pages/Admin/MeetingDetainls/MeetingDetails";
import CustomerData from "../Pages/Admin/Crm/CustomerData";
import AddFields from "../Pages/Admin/AddFields/AddFields";
import Comments from "../Pages/Admin/Crm/Comments";
import Scheduler from "../Pages/Admin/Meetings/Scheduler/Scheduler";
import Invoice from "../Pages/invoice/Invoice";
import Generator from "../Pages/invoice/Generator";
import Invoices from "../Pages/invoice/Invoices";
import Attedance from "../Pages/Admin/Crm/Attedance";

function Routes() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/password-reset" exact component={PasswordReset} />
          <Route path="/comments" exact component={Comments} />
          <AdminRoute path="/admin" exact component={Adminsidebar} />
          <AdminRoute path="/admin-meeting" exact component={Admin} />
          <AdminRoute path="/add-teacher" exact component={AddTeachers} />
          <AdminRoute path="/add-student" exact component={AddStudent} />
          <AdminRoute
            path="/meeting-details"
            exact
            component={MeetingDetails}
          />
          <AdminRoute path="/customer-data" exact component={CustomerData} />
          <AdminRoute path="/add-fields" exact component={AddFields} />
          <AdminRoute path="/meeting-schedule" exact component={Scheduler} />
          <AdminRoute path="/manual-invoice" exact component={Invoice} />
          <AdminRoute path="/invoice-generator" exact component={Generator} />
          <AdminRoute path="/invoices" exact component={Invoices} />
          <AdminRoute path="/attedance" exact component={Attedance} />
        </Switch>
      </Router>
    </>
  );
}

export default Routes;
