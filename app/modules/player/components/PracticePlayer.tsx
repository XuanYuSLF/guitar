import { useRef } from "react";
import type { SyntheticEvent } from "react";
import {
  Box,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
  Typography,
  Slider,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useAlphaTab } from "../hooks/useAlphaTab";
import { usePlayerStore } from "@/store/player.store";

interface PracticePlayerProps {
  fileUrl: string;
  title?: string;
}

export default function PracticePlayer({
  fileUrl,
  title,
}: PracticePlayerProps) {
  const { refs, actions } = useAlphaTab(fileUrl);

  // 直接连接 Global Store
  const { zoom, isPlaying, isLoading, setZoom } = usePlayerStore();

  const debounceTimerRef = useRef<number | null>(null);

  // 处理 Slider 变化 (带防抖)
  const handleZoomChange = (
    _: Event | SyntheticEvent,
    newValue: number | number[],
  ) => {
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
        mt: 4,
        bgcolor: "#FFFFFF",
        color: "#000",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Control Bar */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "#f5f5f5",
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight="bold"
          noWrap
          sx={{ maxWidth: "30%" }}
        >
          {title || "练习曲谱"}
        </Typography>

        {/* Zoom Controls */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ width: 150 }}
        >
          <ZoomInIcon color="action" fontSize="small" />
          <Slider
            size="small"
            defaultValue={zoom} // 使用 defaultValue 避免受控组件频繁重绘导致的卡顿
            step={10}
            min={50}
            max={150}
            onChangeCommitted={handleZoomChange} // 仅在松手后更新 Store，避免频繁 destroy AlphaTab
            aria-label="Zoom"
          />
        </Stack>

        {/* Playback Controls */}
        <Stack direction="row" spacing={1}>
          {isLoading && <CircularProgress size={24} sx={{ mr: 2 }} />}
          <IconButton
            onClick={actions.stopPlay}
            disabled={isLoading}
            size="small"
          >
            <StopIcon />
          </IconButton>
          <IconButton
            onClick={actions.togglePlay}
            color="primary"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Stack>
      </Stack>

      {/* Canvas Container */}
      <Box
        ref={refs.scrollContainerRef}
        sx={{
          height: "60vh",
          overflowY: "auto",
          scrollBehavior: "smooth",
          position: "relative",
          bgcolor: "#fff",
        }}
      >
        <Box
          ref={refs.wrapperRef}
          sx={{
            minHeight: "300px",
            "& .at-cursor-bar": {
              bgcolor: "rgba(208, 188, 255, 0.3) !important",
            },
          }}
        />
      </Box>
    </Paper>
  );
}
