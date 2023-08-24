import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const addUser = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/register_user`
    return await axios.post(url, data)
}

export const listUser = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/list`
    return await axios.post(url, data)
}

export const detailUser = async (user_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/detail/${user_id}`
    return await axios.post(url)
}

export const forgotPasswordRequestList = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/forgot-password-request-list`
    return await axios.post(url, data)
}

export const forgotPasswordRequestComplete = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/forgot-password-request-complete`
    return await axios.post(url, data)
}

export const editProfile = async (data: object, user_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/edit-profile/${user_id}`
    return await axios.post(url, data)
}

export const getAllTeachers = async (): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/get-all-teacher`
    return await axios.post(url)
}

export const assignSubjects = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/assign-subject`
    return await axios.post(url, data)
}

export const removeSubjects = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/remove-subject`
    return await axios.post(url, data)
}

export const importStudents = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/import/csv`
    return await axios.post(url, data)
}

export const importTeachers = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/import-teacher/csv`
    return await axios.post(url, data)
}

export const countUsers = async (): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/get-count`
    return await axios.get(url)
}

export const userChangeStatus = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/change-status`
    return await axios.post(url, data)
}

export const getAllStaffList = async (): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/get-all-staff`
    return await axios.post(url)
}

export const importTeachersSubject = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/users/import-teacher/subject-csv`
    return await axios.post(url, data)
}