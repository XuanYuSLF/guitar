import { useEffect, useRef, useState } from 'react';
import { useMetronomeStore } from '../store/metronome.store';

export const useMetronome = () => {
  const { bpm, beatsPerMeasure, noteValue, isPlaying, setIsPlaying } = useMetronomeStore();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerIdRef = useRef<number | null>(null);
  
  // --- 关键修复：使用 Ref 追踪最新状态 ---
  // 这是为了解决 React 闭包陷阱：确保定时器回调中能读到最新的 BPM 和 NoteValue，
  // 从而实现“调节速度时无需暂停，平滑过渡”。
  const bpmRef = useRef(bpm);
  const noteValueRef = useRef(noteValue);
  const beatsPerMeasureRef = useRef(beatsPerMeasure);

  // 同步 Store 到 Ref
  useEffect(() => {
    bpmRef.current = bpm;
    noteValueRef.current = noteValue;
    beatsPerMeasureRef.current = beatsPerMeasure;
  }, [bpm, noteValue, beatsPerMeasure]);
  // ------------------------------------

  // 调度变量
  const nextNoteTimeRef = useRef<number>(0.0);
  const currentBeatRef = useRef<number>(0);
  const SCHEDULE_AHEAD_TIME = 0.1; 
  const LOOKAHEAD_MS = 25; 
  
  const [activeBeat, setActiveBeat] = useState(-1);

  const playClick = (time: number, beat: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // 强拍逻辑：第1拍是高音
    if (beat === 0) {
      osc.frequency.value = 1000; 
    } else {
      osc.frequency.value = 800; 
    }

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.05);

    // UI 同步
    const timeUntilSound = (time - ctx.currentTime) * 1000;
    setTimeout(() => {
      // 这里的检查是为了防止停止后还有残留动画
      if (timerIdRef.current) {
        setActiveBeat(beat);
      }
    }, Math.max(0, timeUntilSound));
  };

  const nextNote = () => {
    // --- 核心修复逻辑 Start ---
    
    // 1. 计算标准四分音符的时长 (秒)
    const secondsPerQuarter = 60.0 / bpmRef.current;
    
    // 2. 根据分母调整当前点击的时长
    // 如果是 /4 (四分音符)，系数是 1 (4/4)
    // 如果是 /8 (八分音符)，系数是 0.5 (4/8)，速度加倍
    // 如果是 /2 (二分音符)，系数是 2 (4/2)，速度减半
    const secondsPerClick = secondsPerQuarter * (4 / noteValueRef.current);

    nextNoteTimeRef.current += secondsPerClick;
    // --- 核心修复逻辑 End ---
    
    currentBeatRef.current++;
    if (currentBeatRef.current >= beatsPerMeasureRef.current) {
      currentBeatRef.current = 0;
    }
  };

  const scheduler = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
      playClick(nextNoteTimeRef.current, currentBeatRef.current);
      nextNote();
    }
    
    timerIdRef.current = window.setTimeout(scheduler, LOOKAHEAD_MS);
  };

  useEffect(() => {
    if (isPlaying) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      audioContextRef.current.resume();

      currentBeatRef.current = 0;
      nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.05;
      
      scheduler();
    } else {
      if (timerIdRef.current) {
        window.clearTimeout(timerIdRef.current);
        timerIdRef.current = null; // 重要：清空 ref
      }
      setActiveBeat(-1);
    }

    return () => {
      if (timerIdRef.current) {
        window.clearTimeout(timerIdRef.current);
      }
    };
  }, [isPlaying]); // 这里只依赖 isPlaying，BPM 等变化通过 Ref 在内部处理

  const toggle = () => setIsPlaying(!isPlaying);

  return { activeBeat, toggle };
};