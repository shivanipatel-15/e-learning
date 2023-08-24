import { action, observable } from 'mobx'
import RootStore from './Root'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

interface JwtDecoded {
    exp: number,
    type: string
}

class AuthStore {
    public rootStore: RootStore
    @observable public authToken: string
    @observable public userRole: string
    @observable public isUserLoggedIn: boolean
    @observable public userLoginData: any
    @observable public redirectTo: string
    @observable public dataLoaded: boolean
   
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        this.authToken = ''
        this.userRole = ''
        this.isUserLoggedIn = false
        this.userLoginData = {}
        this.updateToken()
        this.redirectTo = ''
        this.dataLoaded = false
    }

    updateToken = async () => {
        await this.restoreToken()
    }

    setDataLoaded(status: boolean) {
        this.dataLoaded = status
    }

    logout(): void {
        this.setAuthToken('')
        this.setUserRole('')
        this.setUserProfileInfo({})
        this.isUserLoggedIn = false
    }

    setAuthToken(token: string): void {
        if (token) {
            this.authToken = token
            axios.defaults.headers.common['token'] = token
            localStorage.setItem('token', token)
            // Apply token token to every request if logged in
            this.isUserLoggedIn = true
        } else {
            // Delete auth header
            delete axios.defaults.headers.common['token']
            localStorage.removeItem('token')
            this.isUserLoggedIn = false
        }
    }

    setUserRole(role: string): void {
        this.userRole = role
        localStorage.setItem('userRole', role)
    }

    resetUserLoginData(): void {
        this.userLoginData = {}
    }

    @action
    async restoreToken() {
        const token = localStorage.getItem('token')
        if (token != null) {
            this.authToken = token
            axios.defaults.headers.common['token'] = token
            const decoded: JwtDecoded = jwt_decode(token)
            // Check for expired token
            const currentTime = Date.now() / 1000
            if (decoded.exp < currentTime) {
                this.logout()
            } else {
                this.setAuthToken(token)
                this.setUserRole(decoded.type)
                this.isUserLoggedIn = true
            }
        }
    }

    @action
    setUserProfileInfo(profile: any) {
        this.userLoginData = profile
        this.setDataLoaded(true)
    }

    setRedirectTo(url: string) {
        this.redirectTo = url
    }
}
export default AuthStore