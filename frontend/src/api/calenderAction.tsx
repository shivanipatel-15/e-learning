import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const getCalenderList = async (): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circulars/list/calender`
    return await axios.post(url)
}

export const addCalender = (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/calender/add`
    return axios.post(url, data)
}

export const editCalender = async (data: object, calender_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/calender/edit/${calender_id}`
    return await axios.post(url, data)
}

export const removeCalender = async (calender_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/calender/remove/${calender_id}`
    return await axios.post(url)
}

export const detailCalender = async (calender_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circulars/detail/${calender_id}`
    return await axios.post(url)
}
