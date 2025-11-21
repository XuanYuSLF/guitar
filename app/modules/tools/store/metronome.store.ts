import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MetronomeState {
  bpm: number;
  beatsPerMeasure: number; // 分子 (每小节几拍)
  noteValue: number;       // 分母 (以几分音符为一拍), 新增字段
  isPlaying: boolean;
  
  setBpm: (bpm: number) => void;
  setBeatsPerMeasure: (beats: number) => void;
  setNoteValue: (val: number) => void; // 新增 Action
  setIsPlaying: (isPlaying: boolean) => void;
  increaseBpm: (amount: number) => void;
  decreaseBpm: (amount: number) => void;
}

export const useMetronomeStore = create<MetronomeState>()(
  persist(
    (set) => ({
      bpm: 100,
      beatsPerMeasure: 4,
      noteValue: 4, // 默认为 4分音符
      isPlaying: false,

      setBpm: (bpm) => set({ bpm }),
      setBeatsPerMeasure: (beats) => set({ beatsPerMeasure: beats }),
      setNoteValue: (val) => set({ noteValue: val }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      
      increaseBpm: (amount) => set((state) => ({ bpm: Math.min(300, state.bpm + amount) })),
      decreaseBpm: (amount) => set((state) => ({ bpm: Math.max(30, state.bpm - amount) })),
    }),
    {
      name: 'blues-metronome-storage',
      storage: createJSONStorage(() => localStorage),
      // 持久化保存这三个参数
      partialize: (state) => ({ 
        bpm: state.bpm, 
        beatsPerMeasure: state.beatsPerMeasure,
        noteValue: state.noteValue 
      }),
    }
  )
);