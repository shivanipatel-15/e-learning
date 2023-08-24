import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const getCircular = async (): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circulars/list/circular`
    return await axios.post(url)
}

export const addCircular = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circular/add`
    return await axios.post(url, data)
}

export const editCircular = async (data: object, circular_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circular/edit/${circular_id}`
    return await axios.post(url, data)
}

export const removeCircular = async (circular_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circular/remove/${circular_id}`
    return await axios.post(url)
}

export const detailCircular = async (circular_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circulars/detail/${circular_id}`
    return await axios.post(url)
}