import { useEffect, useRef, useCallback } from 'react';
import { AlphaTabApi, type Settings } from '@coderline/alphatab';
import { usePlayerStore } from '@/store/player.store';

// 保持 CDN，不做本地化修改
const ALPHATAB_CDN_BASE = 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/';

export const useAlphaTab = (fileUrl: string) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<AlphaTabApi | null>(null);

  const { zoom, setIsPlaying, setIsLoading } = usePlayerStore();

  useEffect(() => {
    if (!wrapperRef.current || !scrollContainerRef.current) return;

    if (apiRef.current) {
      apiRef.current.destroy();
    }

    setIsLoading(true);

    const settings = {
      core: {
        useWorkers: true,
        // 这里保持使用 CDN 或你自己的配置，不动它
        scriptFile: `${ALPHATAB_CDN_BASE}alphaTab.worker.min.mjs`,
        fontDirectory: `${ALPHATAB_CDN_BASE}font/`, 
      },
      display: {
        layoutMode: 'Page',
        staveProfile: 'ScoreTab',
        scale: zoom / 100,
      },
      player: {
        enablePlayer: true,
        enableCursor: true,
        enableUserInteraction: true,
        enableAudioWorklet: true,
        // 这里保持使用 CDN 或你自己的配置，不动它
        soundFont: `${ALPHATAB_CDN_BASE}soundfont/sonivox.sf2`,
        scrollElement: scrollContainerRef.current,
        scrollMode: 'OffScreen',
      },
    } as unknown as Settings;

    const api = new AlphaTabApi(wrapperRef.current!, settings);
    apiRef.current = api;

    api.scoreLoaded.on(() => setIsLoading(false));
    api.playerStateChanged.on((args) => setIsPlaying(args.state === 1));

    const loadData = async () => {
      try {
        // fileUrl 已经在 lesson.service.ts 里被处理过了，这里直接 fetch
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Fetch failed: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        api.load(buffer);
      } catch (err) {
        console.error("Error loading score:", err);
        setIsLoading(false);
      }
    };

    if (fileUrl) {
      loadData();
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.destroy();
        apiRef.current = null;
      }
    };
  }, [fileUrl, zoom, setIsLoading, setIsPlaying]);

  const togglePlay = useCallback(() => apiRef.current?.playPause(), []);
  const stopPlay = useCallback(() => apiRef.current?.stop(), []);

  return {
    refs: { wrapperRef, scrollContainerRef },
    actions: { togglePlay, stopPlay }
  };
};