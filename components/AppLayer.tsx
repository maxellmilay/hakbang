'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import AnnotationDetails from './AnnotationDetails'

import useAnnotationStore from '@/store/annotation'

const AppLayer = () => {
    const {
        selectedAnnotationId,
        getAnnotationDetails,
        selectedAnnotation,
        isAnnotationDetailModalOpen,
        setIsAnnotationDetailModalOpen,
    } = useAnnotationStore()

    useEffect(() => {
        if (selectedAnnotationId) {
            getAnnotationDetails(selectedAnnotationId)
        }
    }, [selectedAnnotationId, getAnnotationDetails])

    useEffect(() => {
        if (selectedAnnotation) {
            console.log('Selected Annotation', selectedAnnotation)
        }
    }, [selectedAnnotation])

    const closeAnnotationDetails = () => {
        setIsAnnotationDetailModalOpen(false)
    }

    const confirmSidewalk = () => {
        console.log('Confirm Sidewalk')
    }

    return (
        <div className="fixed left-0 top-0 z-[100]">
            <AnimatePresence>
                {isAnnotationDetailModalOpen && (
                    <motion.div
                        className="absolute inset-0 z-50 pointer-events-auto flex items-start justify-start"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AnnotationDetails
                            closeAnnotationDetails={closeAnnotationDetails}
                            confirmSidewalk={confirmSidewalk}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AppLayer
