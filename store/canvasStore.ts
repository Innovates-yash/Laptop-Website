import { create } from 'zustand'

interface CanvasStore {
  activeCanvases: number
  incrementCanvas: () => void
  decrementCanvas: () => void
  canRenderCanvas: () => boolean
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  activeCanvases: 0,
  incrementCanvas: () => set((state) => ({ activeCanvases: state.activeCanvases + 1 })),
  decrementCanvas: () => set((state) => ({ activeCanvases: Math.max(0, state.activeCanvases - 1) })),
  canRenderCanvas: () => get().activeCanvases < 4, // Reduced from 8 to 4
}))
