import { useRef } from "react";
import type { SyntheticEvent } from "react";
import { Box, Paper, IconButton, Stack, CircularProgress, Typography, Slider } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useAlphaTab } from "../hooks/useAlphaTab";
import { usePlayerStore } from "@/store/player.store";
import { PLAYER_THEME } from '@/config/player-theme';

interface PracticePlayerProps {
  fileUrl: string;
  title?: string;
}

export default function PracticePlayer({ fileUrl, title }: PracticePlayerProps) {
  const { refs, actions, containerStyle } = useAlphaTab({ 
    fileUrl, 
    isStatic: false 
  });

  const { zoom, isPlaying, isLoading, setZoom } = usePlayerStore();
  const debounceTimerRef = useRef<number | null>(null);

  const handleZoomChange = (_: Event | SyntheticEvent, newValue: number | number[]) => {
    const val = newValue as number;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => { setZoom(val); }, 300);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 4,
        bgcolor: PLAYER_THEME.background.paper, 
        color: "text.primary",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: PLAYER_THEME.background.toolbar,
        }}
      >
        <Typography variant="h6" color="text.primary" fontWeight="bold" noWrap sx={{ maxWidth: "30%" }}>
          {title || "练习曲谱"}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: 150 }}>
          {/* 🎨 Zoom Icon */}
          <ZoomInIcon sx={{ color: PLAYER_THEME.icons.base }} fontSize="small" />
          <Slider
            size="small"
            defaultValue={zoom}
            step={10}
            min={50}
            max={150}
            onChangeCommitted={handleZoomChange}
            aria-label="Zoom"
            // 🎨 Slider Color
            sx={{ color: PLAYER_THEME.icons.base }}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          {isLoading && <CircularProgress size={24} sx={{ mr: 2 }} />}
          
          {/* 🎨 Stop Button */}
          <IconButton 
            onClick={actions.stopPlay} 
            disabled={isLoading} 
            size="small"
            sx={{ color: PLAYER_THEME.icons.base }}
          >
            <StopIcon />
          </IconButton>
          
          {/* 🎨 Play Button */}
          <IconButton
            onClick={actions.togglePlay}
            sx={{
              bgcolor: PLAYER_THEME.icons.primary,
              color: "white",
              "&:hover": { bgcolor: PLAYER_THEME.icons.primaryHover },
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Stack>
      </Stack>

      <Box
        ref={refs.scrollContainerRef}
        sx={{
          height: "60vh",
          overflowY: "auto",
          scrollBehavior: "smooth",
          ...containerStyle
        }}
      >
        <div ref={refs.wrapperRef} />
      </Box>
    </Paper>
  );
}