import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const AddTimeTable = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/timetable/add`
    return await axios.post(url, data)
}

export const editTimeTable = async (data: object, timetable_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/timetable/edit/${timetable_id}`
    return await axios.post(url, data)
}

export const removeTimeTable = async (timetable_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/timetable/remove/${timetable_id}`
    return await axios.post(url)
}

export const listTimeTable = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circulars/list/timetable`
    return await axios.post(url, data)
}

export const detailTimeTable = async (timetable_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circulars/detail/${timetable_id}`
    return await axios.post(url)
}

export const getTodayClassesForAdmins = async (): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/timetable/get-all-class`
    return await axios.post(url)
}

export const getTodayClassesForTeacher = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/timetable/get-teacher-class`
    return await axios.post(url, data)
}

export const getTodayClassesForStudent = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/timetable/get-standard-class`
    return await axios.post(url, data)
}

export const getTimeTableList = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/timetable/get-timetable-list`
    return await axios.post(url, data)
}

export const removeTimetable = async (timetable_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/timetable/remove/${timetable_id}`
    return await axios.post(url)
}

export const editTimetable = async (timetable_id: string, data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/timetable/edit/${timetable_id}`
    return await axios.post(url, data)
}

export const detailTimetable = async (timetable_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/timetable/detail/${timetable_id}`
    return await axios.post(url)
}