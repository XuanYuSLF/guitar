import { Box } from '@mui/material';
import { useAlphaTab } from '@/modules/player/hooks/useAlphaTab';

interface StaticScoreProps {
  alphaTex: string;
  width?: string | number;
}

export default function StaticScore({ alphaTex, width = '100%' }: StaticScoreProps) {
  const { refs } = useAlphaTab({ 
    tex: alphaTex, 
    isStatic: true 
  });

  return (
    <Box 
      sx={{ 
        width: width, 
        position: 'relative',
        // 🔥 1. 背景色改为纯白，与 PracticePlayer 保持一致
        bgcolor: '#FFFFFF',
        
        // 🔥 2. 样式覆盖：完全复用 PracticePlayer 的配色方案
        '& .at-cursor-bar': { 
          // PracticePlayer 同款浅紫色光标
          bgcolor: 'rgba(208, 188, 255, 0.3) !important' 
        },
        '& .at-selection': { 
          // 搭配的选中颜色
          bgcolor: 'rgba(64, 196, 255, 0.2) !important' 
        },
        '& canvas': { display: 'block' }
      }}
    >
      <div ref={refs.wrapperRef} />
    </Box>
  );
}