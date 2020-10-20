exports.services = {
  // dev: {
  //   main: "http://localhost:5000",
  //   login: "/api/login",
  //   changePassword: "",
  // },
  prod: {
    main: "http://localhost:5000",
    // main: "https://livesloka.azurewebsites.net",
    login: "/login",
    changePassword: "/ChangePassword",

    "Time Zone": "/admin/timezones",
    "Add Time Zone": "/admin/addtimezone",
    "Update Time Zone": "/admin/updatetimezone",
    "Delete Time Zone": "/admin/deletetimezone",

    Class: "/admin/classes",
    "Add Class": "/admin/addclass",
    "Update Class": "/admin/updateclass",
    "Delete Class": "/admin/deleteclass",

    "Class Status": "/admin/classstatus",
    "Add Class Status": "/admin/addclassstatus",
    "Update Class Status": "/admin/updateclassstatus",
    "Delete Class Status": "/admin/deleteclassstatus",

    Currency: "/admin/currencies",
    "Add Currency": "/admin/addcurrency",
    "Update Currency": "/admin/updatecurrency",
    "Delete Currency": "/admin/deletecurrency",

    Country: "/admin/countries",
    "Add Country": "/admin/addcountry",
    "Update Country": "/admin/updatecountry",
    "Delete Country": "/admin/deletecountry",

    Status: "/admin/statuses",
    "Add Status": "/admin/addstatus",
    "Update Status": "/admin/updatestatus",

    allCustomerDetails: "/customer/details",
    addCustomer: "/customer/registerCustomer",
    updateCustomer: "/customer/updateCustomer",

    getComment: "/admin/comments",
    addComment: "/admin/addcomment",
    updateComment: "/admin/updatecomment",

    getAllAdmins: "/employee/admins",
    getAllTeachers: "/employee/teachers",
  },
};
