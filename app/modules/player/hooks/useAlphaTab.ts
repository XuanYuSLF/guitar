import { useEffect, useRef, useCallback, useState } from 'react';
import { AlphaTabApi, Settings, StaveProfile, ScrollMode, LayoutMode } from '@coderline/alphatab';
import { usePlayerStore } from '@/store/player.store';
// ✅ 引入统一配置
import { PLAYER_THEME, alphaTabContainerStyle } from '@/config/player-theme';

const ALPHATAB_CDN_BASE = 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/';

interface UseAlphaTabOptions {
  fileUrl?: string;
  tex?: string;
  isStatic?: boolean;
}

export const useAlphaTab = ({ fileUrl, tex, isStatic = false }: UseAlphaTabOptions) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<AlphaTabApi | null>(null);
  
  const [isLooping, setIsLooping] = useState(false);
  
  const { zoom, setIsPlaying, setIsLoading } = usePlayerStore();

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (!isStatic && !scrollContainerRef.current) return;

    if (apiRef.current) apiRef.current.destroy();

    if (!isStatic) setIsLoading(true);

    const settings = {
      core: {
        useWorkers: true,
        engine: 'html5',
        scriptFile: `${ALPHATAB_CDN_BASE}alphaTab.worker.min.mjs`,
        fontDirectory: `${ALPHATAB_CDN_BASE}font/`,
      },
      display: {
        layoutMode: LayoutMode.Page,
        staveProfile: StaveProfile.ScoreTab,
        scale: isStatic ? 1.0 : zoom / 100,
        // ✅ 使用统一配置
        resources: {
          mainGlyphColor: PLAYER_THEME.score.mainGlyph,
          secondaryGlyphColor: PLAYER_THEME.score.secondaryGlyph,
          staffLineColor: PLAYER_THEME.score.staffLine,
          barLineColor: PLAYER_THEME.score.mainGlyph,
          repeatLineColor: PLAYER_THEME.score.mainGlyph,
          scoreTitleColor: PLAYER_THEME.score.mainGlyph,
          scoreSubTitleColor: PLAYER_THEME.score.secondaryGlyph,
          fretNumberColor: PLAYER_THEME.score.mainGlyph,
        }
      },
      player: {
        enablePlayer: !isStatic,
        enableCursor: !isStatic,
        enableUserInteraction: !isStatic,
        enableAudioWorklet: !isStatic,
        soundFont: `${ALPHATAB_CDN_BASE}soundfont/sonivox.sf2`,
        scrollElement: isStatic ? undefined : scrollContainerRef.current,
        scrollMode: isStatic ? ScrollMode.Off : ScrollMode.OffScreen,
      },
    } as unknown as Settings; 

    const api = new AlphaTabApi(wrapperRef.current!, settings);
    apiRef.current = api;

    api.scoreLoaded.on(() => {
      if (!isStatic) setIsLoading(false);
    });

    if (!isStatic) {
      api.playerStateChanged.on((args) => setIsPlaying(args.state === 1));
    }

    const loadData = async () => {
      try {
        if (tex) {
          api.tex(tex);
          if(!isStatic) setIsLoading(false);
        } else if (fileUrl) {
          const response = await fetch(fileUrl);
          if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
          const buffer = await response.arrayBuffer();
          api.load(buffer);
        }
      } catch (err) {
        console.error("Error loading score:", err);
        if (!isStatic) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      if (apiRef.current) {
        apiRef.current.destroy();
        apiRef.current = null;
      }
    };
  }, [fileUrl, tex, isStatic, zoom]);

  const togglePlay = useCallback(() => apiRef.current?.playPause(), []);
  const stopPlay = useCallback(() => apiRef.current?.stop(), []);
  
  const toggleLoop = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.isLooping = !apiRef.current.isLooping;
      setIsLooping(apiRef.current.isLooping);
    }
  }, []);

  return {
    refs: { wrapperRef, scrollContainerRef },
    actions: { togglePlay, stopPlay, toggleLoop },
    state: { isLooping },
    // ✅ 直接导出统一的样式，供组件使用
    containerStyle: alphaTabContainerStyle 
  };
};