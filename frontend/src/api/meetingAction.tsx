import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const createMeeting = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/meeting/create_meeting`
    return await axios.post(url, data)
}

export const joinMeeting = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/meeting/join_meeting`
    return await axios.post(url, data)
}

export const meetingList = async (): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/meeting/list`
    return await axios.post(url)
}

export const meetingLeave = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/meeting/leave`
    return await axios.post(url, data)
}
