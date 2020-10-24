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

    "Time Zone": "/admin/get/timezones",
    "Add Time Zone": "/admin/addtimezone",
    "Update Time Zone": "/admin/update/updatetimezone",
    "Delete Time Zone": "/admin/delete/timeZone",

    Class: "/admin/get/classes",
    "Add Class": "/admin/addclass",
    "Update Class": "/admin/update/updateclass",
    "Delete Class": "/admin/delete/classes",

    "Class Status": "/admin/get/classstatus",
    "Add Class Status": "/admin/addclassstatus",
    "Update Class Status": "/admin/update/updateclassstatus",
    "Delete Class Status": "/admin/delete/classstatus",

    Currency: "/admin/get/currencies",
    "Add Currency": "/admin/addcurrency",
    "Update Currency": "/admin/update/updatecurrency",
    "Delete Currency": "/admin/delete/Currency",

    Country: "/admin/get/countries",
    "Add Country": "/admin/addcountry",
    "Update Country": "/admin/update/updatecountry",
    "Delete Country": "/admin/delete/Country",

    Status: "/admin/get/statuses",
    "Add Status": "/admin/addstatus",
    "Update Status": "/admin/update/updatestatus",

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
