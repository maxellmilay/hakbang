import { create } from 'zustand'

const useMapStore = create((set) => ({
    selectedSidewalkId: null,
    selectedSidewalk: null,
    setSelectedSidewalk: (sidewalkId: number) =>
        set({ selectedSidewalkId: sidewalkId }),
}))

export default useMapStore
