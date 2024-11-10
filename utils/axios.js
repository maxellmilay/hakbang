import axios from 'axios'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/'

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

export const setAuthToken = (token, ctx = null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setCookie(ctx, 'access_token', token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        })
    } else {
        delete api.defaults.headers.common['Authorization']
        destroyCookie(ctx, 'access_token')
    }
}

api.interceptors.request.use((config) => {
    const cookies = parseCookies()
    const token = cookies.access_token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => {
        console.log('Response interceptor:', response.status)
        return response
    },
    async (error) => {
        const originalRequest = error.config

        // Check if the error status is 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            // Prevent infinite loop by checking if the request is to token/refresh/
            if (originalRequest.url.endsWith('token/refresh/')) {
                setAuthToken(null)
                return Promise.reject(error)
            }

            // Retry the original request only once
            if (!originalRequest._retry) {
                originalRequest._retry = true
                try {
                    const cookies = parseCookies()
                    const refreshToken = cookies.refresh_token
                    if (refreshToken) {
                        const response = await api.post('token/refresh/', {
                            refresh: refreshToken,
                        })
                        const { access } = response.data
                        setAuthToken(access)
                        originalRequest.headers['Authorization'] =
                            `Bearer ${access}`
                        return api(originalRequest)
                    }
                } catch (refreshError) {
                    setAuthToken(null)
                    return Promise.reject(refreshError)
                }
            }
        }
        return Promise.reject(error)
    }
)

export default api
