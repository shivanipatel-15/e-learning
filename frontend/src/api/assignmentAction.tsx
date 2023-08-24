import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const getAssignment = async (page: number, data?: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/assignment/list?page=${page}`
    return await axios.post(url, data)
}

export const addAssignment = (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/assignment/add`
    return axios.post(url, data)
}

export const getAssignmentDetail = async (assignment_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/assignment/detail/${assignment_id}`
    return await axios.post(url)
}

export const submitAssignment = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/assignment/submit`
    return await axios.post(url, data)
}

export const getSubmittedAssignment = async (assignment_id: string, data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/assignment/submissions/${assignment_id}`
    return await axios.post(url, data)
}

export const editAssignment = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/assignment/edit`
    return await axios.post(url, data)
}

export const removeAssignment = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/assignment/remove`
    return await axios.post(url, data)
}

export const completeAssignment = async (assignment_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/assignment/completed/${assignment_id}`
    return await axios.post(url)
}

export const getSubmittedAssignmentsForStudent = async (assignment_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/assignment/assignment-submission/${assignment_id}`
    return await axios.post(url)
}

export const updateSubmittedAssignmentStatus = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/assignment/assignment-update`
    return await axios.post(url, data)
}