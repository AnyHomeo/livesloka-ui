exports.services = {
  prod: {
    main: process.env.REACT_APP_API_KEY,
    login: "/login",
    changePassword: "/ChangePassword",

    "Time Zone": "/admin/get/timeZone",
    "Add Time Zone": "/admin/add/timeZone",
    "Update Time Zone": "/admin/update/timeZone",
    "Delete Time Zone": "/admin/delete/timeZone",

    Class: "/admin/get/classes",
    "Add Class": "/admin/add/classes",
    "Update Class": "/admin/update/classes",
    "Delete Class": "/admin/delete/classes",

    Subject: "/admin/get/Subject",
    "Add Subject": "/admin/add/Subject",
    "Update Subject": "/admin/update/Subject",
    "Delete Subject": "/admin/delete/Subject",

    "Zoom Account": "/admin/get/ZoomAccount",
    "Add Zoom Account": "/admin/add/ZoomAccount",
    "Update Zoom Account": "/admin/update/ZoomAccount",
    "Delete Zoom Account": "/admin/delete/ZoomAccount",

    Category: "/admin/get/Category",
    "Add Category": "/admin/add/Category",
    "Update Category": "/admin/update/Category",
    "Delete Category": "/admin/delete/category",

    "Class Status": "/admin/get/ClassStatuses",
    "Add Class Status": "/admin/add/ClassStatuses",
    "Update Class Status": "/admin/update/ClassStatuses",
    "Delete Class Status": "/admin/delete/classstatus",

    Currency: "/admin/get/Currency",
    "Add Currency": "/admin/add/Currency",
    "Update Currency": "/admin/update/Currency",
    "Delete Currency": "/admin/delete/Currency",

    Country: "/admin/get/Country",
    "Add Country": "/admin/add/Country",
    "Update Country": "/admin/update/Country",
    "Delete Country": "/admin/delete/Country",

    Status: "/admin/get/Status",
    "Add Status": "/admin/add/Status",
    "Update Status": "/admin/update/status",

    Teacher:
    "/teacher?params=id,TeacherDesc,TeacherName,TeacherStatus,-_id,category,teacherMail,Salary_tillNow,Commission_Amount_One,Commission_Amount_Many,Bank_account,Phone_number,Bank_full_name,isDemoIncludedInSalaries,leaveDifferenceHours,teacherImageLink",
    "Add Teacher": "/admin/add/Teacher",
    "Update Teacher": "/admin/update/Teacher",
    "Delete Teacher": "/admin/delete/Teacher",

    Agent: "/admin/get/Agent",
    "Add Agent": "/admin/add/Agent",
    "Update Agent": "/admin/update/Agent",
    "Delete Agent": "/admin/delete/Agent",

    allCustomerDetails: "/customer/details",
    addCustomer: "/customer/registerCustomer",
    updateCustomer: "/customer/updateCustomer",
    deleteCustomer: "/customer/delete",

    getComment: "/admin/comments",
    addComment: "/admin/addcomment",
    updateComment: "/admin/updatecomment",
    deleteComment: "/admin/deletecomment",
    getAllAdmins: "/employee/admins",
    getAllTeachers: "/employee/teachers",

    addInvoice: "/admin/addinvoice",
    getInvoices: "/admin/getinvoices",
    deleteInvoice: "/admin/deleteinvoice",
  },
};
