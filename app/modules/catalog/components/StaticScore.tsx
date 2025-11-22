import { useRef } from 'react';
import type { SyntheticEvent } from 'react';
import { Box, IconButton, Stack, Slider, Typography, CircularProgress, Paper } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import LoopIcon from '@mui/icons-material/Loop';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { useAlphaTab } from '@/modules/player/hooks/useAlphaTab';
import { usePlayerStore } from '@/store/player.store';
import { PLAYER_THEME } from '@/config/player-theme';

interface StaticScoreProps {
  alphaTex: string;
  width?: string | number;
  title?: string;
}

export default function StaticScore({ alphaTex, width = '100%', title }: StaticScoreProps) {
  const { refs, actions, state, containerStyle } = useAlphaTab({ 
    tex: alphaTex, 
    isStatic: false 
  });

  const { zoom, isPlaying, isLoading, setZoom } = usePlayerStore();
  const debounceTimerRef = useRef<number | null>(null);

  const handleZoomChange = (_: Event | SyntheticEvent, newValue: number | number[]) => {
    const val = newValue as number;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      setZoom(val);
    }, 300);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: width, 
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: PLAYER_THEME.background.paper,
        color: "text.primary",
      }}
    >
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between" 
        sx={{ 
          p: 1.5, 
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: PLAYER_THEME.background.toolbar, 
        }}
      >
        <Typography variant="subtitle2" color="text.primary" fontWeight="bold" noWrap sx={{ maxWidth: '30%' }}>
          {title || "预览谱面"}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: 120 }}>
          {/* 🎨 修改：Zoom 图标颜色 */}
          <ZoomInIcon sx={{ color: PLAYER_THEME.icons.base, fontSize: 20 }} />
          <Slider
            size="small"
            defaultValue={zoom}
            step={10}
            min={50}
            max={150}
            onChangeCommitted={handleZoomChange}
            aria-label="Zoom"
            // 🎨 修改：Slider 轨道颜色
            sx={{ color: PLAYER_THEME.icons.base }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          {isLoading ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : (
            <>
              {/* 🎨 修改：Loop 按钮颜色 */}
              <IconButton 
                onClick={actions.toggleLoop} 
                size="small"
                title="Loop"
                sx={{ 
                  // 激活时用紫色，未激活时用深灰 (base)
                  color: state.isLooping ? PLAYER_THEME.icons.active : PLAYER_THEME.icons.base,
                  bgcolor: state.isLooping ? PLAYER_THEME.ui.loopActiveBg : 'transparent'
                }}
              >
                <LoopIcon fontSize="small" />
              </IconButton>

              {/* 🎨 修改：Stop 按钮颜色 */}
              <IconButton 
                onClick={actions.stopPlay} 
                size="small" 
                sx={{ color: PLAYER_THEME.icons.base }}
              >
                <StopIcon fontSize="small" />
              </IconButton>

              {/* 🎨 修改：Play 按钮背景色 */}
              <IconButton 
                onClick={actions.togglePlay} 
                size="small"
                sx={{ 
                  bgcolor: PLAYER_THEME.icons.primary, 
                  color: 'white',
                  '&:hover': { bgcolor: PLAYER_THEME.icons.primaryHover }
                }}
              >
                {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
              </IconButton>
            </>
          )}
        </Stack>
      </Stack>

      <Box
        ref={refs.scrollContainerRef}
        sx={{
          maxHeight: '500px', 
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          ...containerStyle 
        }}
      >
        <div ref={refs.wrapperRef} />
      </Box>
    </Paper>
  );
}