import axios, { AxiosResponse } from 'axios'
import { getAppBaseUrl } from './url'
const baseURL = getAppBaseUrl()

export const login = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/login`
    return await axios.post(url, data)
}

export const profile = async (): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/auth/profile`
    return await axios.post(url)
}

export const editProfile = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/auth/edit-profile`
    return await axios.post(url, data)
}

export const changePassword = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/auth/change-password`
    return await axios.post(url, data)
}

export const forgotPasswordRequest = async (data: object): Promise<AxiosResponse> => {
    const url = `${baseURL}/api/v1/forgot-password-request`
    return await axios.post(url, data)
}
