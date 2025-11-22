import {type SxProps,type Theme } from '@mui/material';

/**
 * 🎵 播放器统一配色方案
 */
export const PLAYER_THEME = {
  // 布局背景
  background: {
    paper: '#FFFFFF',   
    toolbar: '#f5f5f5', 
    divider: '#e0e0e0', 
  },
  
  // AlphaTab 乐谱渲染颜色
  score: {
    mainGlyph: '#000000', 
    secondaryGlyph: '#444444', 
    staffLine: '#888888', 
  },

  // 交互元素颜色
  ui: {
    cursor: 'rgba(208, 188, 255, 0.3)',    
    selection: 'rgba(64, 196, 255, 0.2)',  
    loopActiveBg: 'rgba(156, 39, 176, 0.1)', 
  },

  // 🎨 新增：图标专用颜色 (高对比度)
  icons: {
    base: '#333333',       // 深灰色：用于 Zoom, Stop, 未激活的 Loop
    active: '#7b1fa2',     // 深紫色：用于激活的 Loop
    primary: '#1565c0',    // 深蓝色：用于 Play/Pause 按钮背景
    primaryHover: '#0d47a1' // 更深的蓝色：用于 Play/Pause Hover
  }
};

export const alphaTabContainerStyle: SxProps<Theme> = {
  width: '100%',
  bgcolor: PLAYER_THEME.background.paper,
  position: 'relative',
  '& .at-cursor-bar': { 
    bgcolor: `${PLAYER_THEME.ui.cursor} !important`,
  },
  '& .at-selection': { 
    bgcolor: `${PLAYER_THEME.ui.selection} !important` 
  },
  '& canvas': { display: 'block' }
};