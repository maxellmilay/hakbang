import axios from 'axios'

const API_URL = 'http://localhost:8000/api/'

const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}

// This function checks if it's running in a browser environment.
const isBrowser = () => typeof window !== 'undefined'

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}register/`, userData)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const login = async (credentials) => {
    try {
        console.log(API_URL, 'heree')
        const response = await axios.post(`${API_URL}login/`, credentials)
        const { access, refresh, user } = response.data

        if (isBrowser()) {
            localStorage.setItem('access_token', access)
            localStorage.setItem('refresh_token', refresh)
        }

        setAuthToken(access)
        return user
    } catch (error) {
        throw error.response.data
    }
}

export const logout = async () => {
    try {
        await axios.post(`${API_URL}logout/`)

        if (isBrowser()) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        }

        setAuthToken(null)
    } catch (error) {
        console.error('Logout error:', error)
    }
}

export const getUserProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}me/`)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                if (isBrowser()) {
                    const refreshToken = localStorage.getItem('refresh_token')
                    const response = await axios.post(
                        `${API_URL}token/refresh/`,
                        {
                            refresh: refreshToken,
                        }
                    )
                    const { access } = response.data

                    localStorage.setItem('access_token', access)
                    setAuthToken(access)
                    originalRequest.headers['Authorization'] =
                        `Bearer ${access}`
                }
                return axios(originalRequest)
            } catch (refreshError) {
                logout()
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

if (isBrowser()) {
    const token = localStorage.getItem('access_token')
    setAuthToken(token)
}
