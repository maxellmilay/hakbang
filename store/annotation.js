import { create } from 'zustand'
import api from '@/utils/axios'
import useAuthStore from './auth'

const useAnnotationStore = create((set) => ({
    sidebarAnnotations: [],
    getAccessibilityColor: (accessibilityScore) => {
        if (accessibilityScore === null) {
            return 0
        }
        accessibilityScore = parseFloat(accessibilityScore)
        if (accessibilityScore >= 0 && accessibilityScore < 0.0833) {
            return 12
        } else if (
            accessibilityScore >= 0.0833 &&
            accessibilityScore < 0.1667
        ) {
            return 11
        } else if (accessibilityScore >= 0.1667 && accessibilityScore < 0.25) {
            return 10
        } else if (accessibilityScore >= 0.25 && accessibilityScore < 0.3333) {
            return 9
        } else if (
            accessibilityScore >= 0.3333 &&
            accessibilityScore < 0.4167
        ) {
            return 8
        } else if (accessibilityScore >= 0.4167 && accessibilityScore < 0.5) {
            return 7
        } else if (accessibilityScore >= 0.5 && accessibilityScore < 0.5833) {
            return 6
        } else if (
            accessibilityScore >= 0.5833 &&
            accessibilityScore < 0.6667
        ) {
            return 5
        } else if (accessibilityScore >= 0.6667 && accessibilityScore < 0.75) {
            return 4
        } else if (accessibilityScore >= 0.75 && accessibilityScore < 0.8333) {
            return 3
        } else if (
            accessibilityScore >= 0.8333 &&
            accessibilityScore < 0.9167
        ) {
            return 2
        } else if (accessibilityScore >= 0.9167 && accessibilityScore <= 1) {
            return 1
        }
    },
    getAccessibilityLabel: (accessibilityScore) => {
        if (accessibilityScore === null) {
            return 'No Data'
        }
        accessibilityScore = parseFloat(accessibilityScore)
        if (accessibilityScore >= 0 && accessibilityScore < 0.0833) {
            return 'Extremely Poor'
        } else if (
            accessibilityScore >= 0.0833 &&
            accessibilityScore < 0.1667
        ) {
            return 'Very Poor'
        } else if (accessibilityScore >= 0.1667 && accessibilityScore < 0.25) {
            return 'Poor'
        } else if (accessibilityScore >= 0.25 && accessibilityScore < 0.3333) {
            return 'Very Below Average'
        } else if (
            accessibilityScore >= 0.3333 &&
            accessibilityScore < 0.4167
        ) {
            return 'Below Average'
        } else if (accessibilityScore >= 0.4167 && accessibilityScore < 0.5) {
            return 'Slightly Below Average'
        } else if (accessibilityScore >= 0.5 && accessibilityScore < 0.5833) {
            return 'Average'
        } else if (
            accessibilityScore >= 0.5833 &&
            accessibilityScore < 0.6667
        ) {
            return 'Slightly Above Average'
        } else if (accessibilityScore >= 0.6667 && accessibilityScore < 0.75) {
            return 'Above Average'
        } else if (accessibilityScore >= 0.75 && accessibilityScore < 0.8333) {
            return 'Good'
        } else if (
            accessibilityScore >= 0.8333 &&
            accessibilityScore < 0.9167
        ) {
            return 'Very Good'
        } else if (accessibilityScore >= 0.9167 && accessibilityScore <= 1) {
            return 'Exceptional'
        }
    },
    setSidebarAnnotations: async (newValue) => {
        set({ sidebarAnnotations: newValue })
    },
    getSidebarAnnotations: async () => {
        const userID = useAuthStore.getState().user?.id
        if (!userID) {
            console.error('User ID not found')
            return
        }
        const filters = { annotator_id: userID }
        try {
            const response = await api.get('side-panel-annotations/', {
                params: filters,
            })
            set({ sidebarAnnotations: response.data.objects })
        } catch (error) {
            throw error
        }
    },

    checkAnnotationNameAvailability: async (name) => {
        const filters = { name: name }
        try {
            const response = await api.get('annotation-name-checker/', {
                params: filters,
            })
            return response.data.total_count === 0
        } catch (error) {
            throw error.response.data
        }
    },

    getAnnotationForms: async (filters) => {
        try {
            const response = await api.get('annotation-forms/', {
                params: filters,
            })
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    getAnnotationForm: async (id) => {
        try {
            const response = await api.get(`annotation-forms/${id}/`)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    createAnnotationForm: async (data) => {
        try {
            const response = await api.post('annotation-forms/', data)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    updateAnnotationForm: async (id, data) => {
        try {
            const response = await api.put(`annotation-forms/${id}/`, data)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    deleteAnnotationForm: async (id) => {
        try {
            const response = await api.delete(`annotation-forms/${id}/`)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    getLocations: async (filters) => {
        // to maxell: size per request is 20, you might want to adjust this in the BE
        try {
            const response = await api.get('locations/', {
                params: filters,
            })
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    getLocationDetails: async (id) => {
        try {
            const response = await api.get(`locations/${id}/`)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    updateLocation: async (id, data) => {
        try {
            const response = await api.put(`locations/${id}/`, data)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    createLocation: async (data) => {
        try {
            const response = await api.post('locations/', data)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    deleteLocation: async (id) => {
        try {
            const response = await api.delete(`locations/${id}/`)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    getAnnotations: async (filters) => {
        try {
            const response = await api.get('annotations/', {
                params: filters,
            })
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    getAnnotationDetails: async (id) => {
        try {
            const response = await api.get(`annotations/${id}/`)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    createAnnotation: async (data) => {
        /*
        Required fields:
        - location_id
        - annotator_id
        - form_template_id
        - coordinates_id
        - name
        - form_data (json)
        */
        try {
            const response = await api.post('annotations/', data)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    updateAnnotation: async (id, data) => {
        try {
            const response = await api.put(`annotations/${id}/`, data)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    deleteAnnotation: async (id) => {
        try {
            const response = await api.delete(`annotations/${id}/`)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    createAnnotationImage: async (data) => {
        try {
            const response = await api.post('annotation-images/', data)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    deleteAnnotationImage: async (id) => {
        try {
            const response = await api.delete(`annotation-images/${id}/`)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    createFile: async (data) => {
        try {
            const response = await api.post('files/', data)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },

    deleteFile: async (id) => {
        try {
            const response = await api.delete(`files/${id}/`)
            return response.data
        } catch (error) {
            throw error.response.data
        }
    },
}))

export default useAnnotationStore
