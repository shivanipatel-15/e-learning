import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const getExam = async (page: number, data?: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/exam/list?page=${page}`
    return await axios.post(url, data)
}

export const addExam = (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/exam/add`
    return axios.post(url, data)
}

export const getExamDetail = (exam_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/exam/detail/${exam_id}`
    return axios.post(url)
}

export const submitExamAnswers = (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/exam/submit-answer-sheet`
    return axios.post(url, data)
}

export const getSubmittedExam = async (exam_id: string): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/exam/submissions/${exam_id}`
    return await axios.post(url)
}


export const editExam = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/exam/edit`
    return await axios.post(url, data)
}

export const removeExam = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/exam/remove`
    return await axios.post(url, data)
}