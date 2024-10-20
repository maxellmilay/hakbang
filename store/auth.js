import { create } from 'zustand'
import { login, logout, register, getUserProfile } from '@/utils/auth'

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
