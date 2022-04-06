import axios from "axios"
import {isAutheticated} from "../auth"
import {services} from "./config"
import Axios from "axios"
import moment from "moment"
const API = services["prod"]

export const login = (userId, password) => Axios.post(`${API.main}${API.login}`, {userId, password})

export const logout = (next) => {
	localStorage.removeItem("roleID")
	if (typeof window !== "undefined") {
		document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		next()
	}
}

export const getTodayMeetings = (userid) => {
	return axios.post(
		`${API}/room/${userid}`,
		{
			date: new Date(),
		},
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAutheticated().token}`,
			},
		}
	)
}

export const getAllStudents = () => {
	return axios.get(`${API}/students`, {
		headers: {
			"Content-Type": "application/json",
		},
	})
}

export const postMeeting = (teacher, student, startDate, endDate, startTime, endTime, day) => {
	return axios.post(
		`${API}/create/meeting`,
		{teacher, student, startDate, endDate, startTime, endTime, day},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
}

export const postStudent = (student, password, email) => {
	return axios.post(
		`${API}/create/student/${isAutheticated().data.userid}`,
		{student, password, email},
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAutheticated().token}`,
			},
		}
	)
}

export const postTeacher = (teacher, password, email) => {
	return axios.post(
		`${API}/create/teacher/${isAutheticated().data.userid}`,
		{teacher, password, email},
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${isAutheticated().token}`,
			},
		}
	)
}

export const updatePassword = (password, newPassword, confirmPassword, userId) => {
	return axios.post(
		`${API.main}${API.changePassword}`,
		{userId, password, newPassword, confirmPassword},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
}

export const getMeeting = (token, time) => {
	return axios.post(
		`${API.main}/meeting`,
		{token, time},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
}

export const getAllCustomerDetails = () => {
	return axios.get(`${API.main}${API.allCustomerDetails}`)
}

export const getData = (name) => {
	return Axios.get(`${API.main}${API[name]}`)
}

export const AddCustomer = (data) => {
	return Axios.post(`${API.main}${API.addCustomer}`, data)
}

export const editCustomer = (data) => {
	return Axios.post(`${API.main}${API["updateCustomer"]}`, data)
}

export const addInField = (name, data) => {
	return Axios.post(`${API.main}${API[name]}`, data)
}

export const editField = (name, data) => {
	return Axios.post(`${API.main}${API[name]}`, data)
}

export const deleteField = (name, id) => Axios.post(`${API.main}${API[name]}/${id}`)

// comments of customer CRUD
export const getComments = (customerId) =>
	axios.get(`${API.main}/admin/comments/customer/${customerId}`)
export const addComments = (formData) => axios.post(`${API.main}/admin/comments`, formData)
export const updateComment = (data) => axios.patch(`${API.main}/admin/comments/${data._id}`, data)
export const deleteComment = (data) => axios.delete(`${API.main}/admin/comments/${data._id}`, data)

export const getAllAdmins = () => axios.get(`${API.main}${API.getAllAdmins}`)
export const getAllTeachers = () => axios.get(`${API.main}${API.getAllTeachers}`)
export const addInvoice = (data) => axios.post(`${API.main}${API.addInvoice}`, data)
export const getInvoices = (data) => axios.post(`${API.main}${API.getInvoices}`, data)
export const deleteInvoice = (data) => axios.post(`${API.main}${API.deleteInvoice}`, data)
export const getUsers = () =>
	axios.get(`${API.main}/customer/data?params=userId,username,customerId`)
export const getUserAttendance = (id, date) =>
	axios.get(`${API.main}/admin/attendance/${id}?date=${date}`)
export const deleteUser = (id) => axios.get(`${API.main}${API.deleteCustomer}/${id}`)
export const getSettings = (id) => axios.get(`${API.main}/settings/${id}`)
export const updateSettings = (id, data) => axios.post(`${API.main}/settings/${id}`, data)
export const getOccupancy = () => axios.get(`${API.main}/teacher/occupancy`)
export const getAllSlots = (id) => axios.get(`${API.main}/teacher/all/slots/${id}`)
export const addAvailableTimeSlot = (id, slot) =>
	axios.post(`${API.main}/teacher/add/available/${id}`, {slot})
export const deleteAvailableTimeSlot = (id, slot) =>
	axios.post(`${API.main}/teacher/delete/slot/${id}`, {slot})
export const getFinancialStatistics = () => axios.get(`${API.main}/teacher/finance`)
export const getClasses = () => axios.get(`${API.main}/schedule/data/all?params=className`)
export const getAttendanceByScheduleId = (id) => axios.get(`${API.main}/attendance/all/${id}`)
export const getStudentList = (id) => axios.get(`${API.main}/schedule/${id}`)
export const getScheduleAndDateAttendance = (id, date) =>
	axios.get(`${API.main}/attendance/${id}?date=${date}`)
export const postStudentsAttendance = (data) => axios.post(`${API.main}/attendance`, data)
export const getAllSchedulesByZoomAccountId = (id) => axios.get(`${API.main}/schedule/zoom/${id}`)
export const getSchedulesByDayForZoomAccountDashboard = (day) =>
	axios.get(`${API.main}/schedule/zoom/all?day=${day}`)
export const updateScheduleDangerously = (id, data) =>
	axios.post(`${API.main}/schedule/dangerous/edit/${id}?message=Class Cancellation`, data)
export const getByUserSettings = (id) => axios.get(`${API.main}/customers/all/${id}`)
export const getAllLeaves = () => axios.get(`${API.main}/cancelclass`)
export const updateLeave = (data) => axios.put(`${API.main}/cancelclass`, data)
export const deleteALeave = (id) => axios.delete(`${API.main}/cancelclass/${id}`)
export const getAllCustomers = (select) =>
	axios.get(`${API.main}/admin/get/Customer?select=${select}`)
export const updateBoughtClasses = (data) => axios.put(`${API.main}/class-history`, data)
export const getEntireDayStatistics = (day) => axios.get(`${API.main}/customer/stats/${day}`)
export const getSummerCampStudents = () => axios.get(`${API.main}/summercamps/students`)
export const getDemoAndInclassStudents = () => axios.get(`${API.main}/all/demo-inclass`)
export const getCareersApplications = () => axios.get(`${API.main}/careers`)
export const getTodayLeaves = (date) =>
	axios.get(`${API.main}/cancelclass/123?noSchedule=true&date=${date}`)
export const getCustomerDatFromFilterName = (name) =>
	axios.get(`${API.main}/customer/filters?filter=${name}`)
export const getAllTeacherLeaves = () => axios.get(`${API.main}/teacher-leaves`)
export const updateTeacherLeave = (id, data) => axios.put(`${API.main}/teacher-leaves/${id}`, data)
export const deleteATeacherLeave = (id) => axios.delete(`${API.main}/teacher-leaves/${id}`)
export const getAdminsFromQuery = (queryBy, ids) =>
	axios.get(`${API.main}/messages/query/admins/${queryBy}?ids=${ids.join(",")}`)
export const getAllNotifications = () => axios.get(`${API.main}/messages`)
export const updateZoomLinkToNewOne = (id) => axios.put(`${API.main}/schedule/zoom/${id}`)
export const updateSchedulesOfAdminToday = (scheduleIds) =>
	axios.post(`${API.main}/allocate`, {scheduleIds, agentId: isAutheticated().agentId})
export const getAdminAssignedClasses = () =>
	axios.get(`${API.main}/allocate/${isAutheticated().agentId}`)
export const getSchedulesByMonthAndScheduleId = (scheduleId, date) =>
	axios.get(`${API.main}/schedule/salary/${scheduleId}/${date}`)
export const sendOtpsToAdmins = (month, year) =>
	axios.post(`${API.main}/agent/send-otps/salary-verification`, {month, year})
export const finalizeSalaries = (month, year, otps) =>
	axios.post(`${API.main}/finalize`, {month, year, otps})
export const getDemoCustomers = () =>
	Axios.get(`${API.main}/options/demo/students?select=firstName,teacherId`)
export const getTeacherSlotsForOptions = (id) =>
	Axios.get(`${API.main}/options/teacher/slots/${id}`)

export const postOptions = (formData) => Axios.post(`${API.main}/options`, formData)

export const getTimeZones = () => Axios.get(`${API.main}/admin/get/timeZone`)

export const createPaypalAndStripeProducts = (data) =>
	Axios.post(`${API.main}/subscriptions/create/product`, data)

export const getAllSubscriptionProducts = () => Axios.get(`${API.main}/products`)
export const addSubscriptionProduct = (data) => Axios.post(`${API.main}/products`, data)
export const deleteSubscriptionProduct = (id) => Axios.delete(`${API.main}/products/${id}`)
export const createPlans = (data) => Axios.post(`${API.main}/plans`, data)
export const getAllPlansOfTheProduct = (productId) =>
	Axios.get(`${API.main}/plans?productId=${productId}`)
export const deleteSubscriptionPlan = (planId) => Axios.delete(`${API.main}/plans/${planId}`)
export const createAChatGroupFromScheduleId = (scheduleId) =>
	Axios.post(`${API.main}/group/schedule/${scheduleId}`)
export const getAPlan = (planId) => Axios.get(`${API.main}/plans/${planId}`)
export const updatePlan = (formData, plan) => Axios.put(`${API.main}/plans/${plan}`, formData)
export const getPlansByCustomer = (customer) =>
	Axios.get(`${API.main}/plans?customerId=${customer}`)
export const getOptionsOfATeacher = (teacherId) =>
	Axios.get(`${API.main}/options/teacher/${teacherId}`)
export const getOptionsByCustomer = (customerId) =>
	Axios.get(`${API.main}/options/customer/${customerId}`)
export const updateOptions = (optionsId, updatedData) =>
	Axios.put(`${API.main}/options/${optionsId}`, updatedData)
export const getCustomerRewards = (user) => Axios.get(`${API.main}/rewards/user/${user}?redeems=1`)
export const getAllPermissionStrings = () => Axios.get(`${API.main}/roles/permissions`)
export const patchPermission = (roleId, permission) =>
	Axios.patch(`${API.main}/roles/${roleId}/permissions`, {permission})
export const createSchedule = (formData) => Axios.post(`${API.main}/schedule`, formData)
export const getOptions = () => Axios.get(`${API.main}/options`)
export const retryScheduleWithOptions = (id) => Axios.patch(`${API.main}/options/manual/${id}`)
export const deleteOptions = (id) => Axios.delete(`${API.main}/options/${id}`)
export const getSchedulesOfTeacher = (teacherId) =>
	Axios.get(`${API.main}/api/teachers/${teacherId}/schedules?web=noFormat`)
export const applyTeacherLeave = (data) => Axios.post(`${API.main}/teacher-leaves`, data)
export const getCommentsByCustomerIds = (customerIds) =>
	Axios.get(`${API.main}/admin/comments?customers=${customerIds.join(",")}`)
export const getWatiFeedbackMessages = () =>
	Axios.get(`${API.main}/api/wati?from=${moment().startOf("month")}&to=${moment().endOf("month")}`)
