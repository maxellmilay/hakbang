import { create } from 'zustand'
import api, { setAuthToken } from '@/utils/axios'
import { setCookie, destroyCookie } from 'nookies'

const register = async (userData) => {
    try {
        const response = await api.post('register/', userData)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

const login = async (credentials) => {
    try {
        const response = await api.post('login/', credentials)
        const { access, refresh, user } = response.data

        setAuthToken(access)
        setCookie(null, 'refresh_token', refresh, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        })

        return user
    } catch (error) {
        console.error('Login error:', error)
        throw error.response.data
    }
}

const logout = async () => {
    try {
        await api.post('logout/')
        setAuthToken(null)
        destroyCookie(null, 'refresh_token')
    } catch (error) {
        console.error('Logout error:', error)
    }
}

const getUserProfile = async () => {
    try {
        const response = await api.get('me/')
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

const useAuthStore = create((set) => ({
    user: null,
    login: async (username, password) => {
        const credentials = { username, password }
        const user = await login(credentials)
        set({ user: user })
    },
    logout: async () => {
        set({ user: null })
        await logout()
    },
    register: async (data) => {
        const user = await register(data)
        set({ user: user })
    },
    getUser: async () => {
        const user = await getUserProfile()
        set({ user: user })
    },
}))

export default useAuthStore
