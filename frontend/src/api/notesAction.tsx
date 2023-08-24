import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const getNotes = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circulars/list/notes`
    return await axios.post(url, data)
}

export const addNotes = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/notes/add`
    return await axios.post(url, data)
}

export const editNotes = async (data: object, notes_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/notes/edit/${notes_id}`
    return await axios.post(url, data)
}

export const removeNotes = async (notes_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/notes/remove/${notes_id}`
    return await axios.post(url)
}

export const detailNotes = async (notes_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/circulars/detail/${notes_id}`
    return await axios.post(url)
}