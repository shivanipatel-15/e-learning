import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const getSyllabus = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circulars/list/syllabus`
    return await axios.post(url, data)
}

export const addSyllabus = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circular/add`
    return await axios.post(url, data)
}

export const editSyllabus = async (data: object, _id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circular/edit/${_id}`
    return await axios.post(url, data)
}

export const removeSyllabus = async (_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circular/remove/${_id}`
    return await axios.post(url)
}

export const detailSyllabus = async (_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circulars/detail/${_id}`
    return await axios.post(url)
}