import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const getStudentList = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/attendance/get-students-list`
    return await axios.post(url, data)
}

export const saveAttendance = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/attendance/save-attendance`
    return await axios.post(url, data)
}

export const editAttendance = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/attendance/edit-attendance`
    return await axios.post(url, data)
}

export const saveStudentLoginTime = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/attendance/save-student-login-time`
    return await axios.post(url, data)
}

export const saveStudentLogoutTime = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/attendance/save-student-logout-time`
    return await axios.post(url, data)
}