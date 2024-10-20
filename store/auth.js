import { create } from 'zustand'

const useAuthStore = create((set) => ({
    user: null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login: async (credentials, password) => {
        // login logic
        set({ user: { name: 'John Doe' } })
    },
    logout: async () => {
        // logout logic
        set({ user: null })
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    register: async (data) => {
        // register logic
        set({ user: { name: 'John Doe' } })
    },
    getUser: async () => {
        // get user logic
        set({ user: { name: 'John Doe' } })
    },
}))

export default useAuthStore
