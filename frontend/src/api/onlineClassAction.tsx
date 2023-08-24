import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const createClass = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/liveClass/create_class`
    return await axios.post(url, data)
}

export const joinClass = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/liveClass/join_class`
    return await axios.post(url, data)
}

export const leaveClass = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/liveClass/leave_class`
    return await axios.post(url, data)
}

export const liveClassList = async (): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/liveClass/list`
    return await axios.post(url)
}
