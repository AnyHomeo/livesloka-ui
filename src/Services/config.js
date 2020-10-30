exports.services = {
  
  prod: {
    main: "https://murmuring-river-06744.herokuapp.com",
    login: "/login",
    changePassword: "/ChangePassword",

    "Time Zone": "/admin/get/timezones",
    "Add Time Zone": "/admin/addtimezone",
    "Update Time Zone": "/admin/update/timeZone",
    "Delete Time Zone": "/admin/delete/timeZone",

    Class: "/admin/get/classes",
    "Add Class": "/admin/addclass",
    "Update Class": "/admin/update/classes",
    "Delete Class": "/admin/delete/classes",

    "Class Status": "/admin/get/ClassStatuses",
    "Add Class Status": "/admin/addclassstatus",
    "Update Class Status": "/admin/update/ClassStatuses",
    "Delete Class Status": "/admin/delete/classstatus",

    Currency: "/admin/get/currencies",
    "Add Currency": "/admin/addcurrency",
    "Update Currency": "/admin/update/Currency",
    "Delete Currency": "/admin/delete/Currency",

    Country: "/admin/get/countries",
    "Add Country": "/admin/addcountry",
    "Update Country": "/admin/update/Country",
    "Delete Country": "/admin/delete/Country",

    Status: "/admin/get/statuses",
    "Add Status": "/admin/addstatus",
    "Update Status": "/admin/update/status",

    Teacher: "/admin/get/Teachers",
    "Add Teacher": "/admin/addTeacher",
    "Update Teacher": "/admin/update/Teacher",
    "Delete Teacher": "/admin/delete/Teacher",

    Agent: "/admin/get/Agents",
    "Add Agent": "/admin/addAgent",
    "Update Agent": "/admin/update/Agent",
    "Delete Agent": "/admin/delete/Agent",

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
