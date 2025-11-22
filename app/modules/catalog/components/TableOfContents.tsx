import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Paper, useTheme, alpha } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export interface TocItem {
  title: string;
  targetId: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  onLinkClick?: () => void;
}

export default function TableOfContents({ items, onLinkClick }: TableOfContentsProps) {
  const theme = useTheme();
  
  // 初始化默认选中
  const [activeId, setActiveId] = useState<string>(items.length > 0 ? items[0].targetId : "");

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // 预留顶部导航栏高度
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      // 1. 只负责触发滚动
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // ❌ 已删除：setActiveId(id); 
      // 原因：删除这行后，点击时不会强制高亮目标。
      // 而是让下面的 handleScroll 监听器随着页面滚动，自然地流转到目标章节，彻底解决“闪烁”问题。
      
      if (onLinkClick) {
        onLinkClick();
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      
      // 遍历所有章节
      for (const item of items) {
        const section = document.getElementById(item.targetId);
        // 这里的 180 是判定线。数值越大，滚动时高亮切换得越早。
        // 配合 handleClick 的 headerOffset=100，确保目标滚动到位后肯定能被选中
        if (section && window.scrollY >= (section.offsetTop - 180)) {
          current = item.targetId;
        }
      }

      // 如果计算出了 current，就设置
      if (current) {
        setActiveId(current);
      } else if (window.scrollY < 100 && items.length > 0) {
        // 页面回到顶部时，强制高亮第一个
        setActiveId(items[0].targetId);
      }
    };

    // 绑定滚动事件
    window.addEventListener("scroll", handleScroll);
    
    // 组件挂载后立即执行一次，确保初始高亮正确
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]); 

  if (items.length === 0) return null;

  return (
    <Box
      component="nav"
      sx={{
        width: 240,
        flexShrink: 0,
        position: 'sticky', // 固定定位
        top: 100,           // 距离视口顶部的距离
        maxHeight: 'calc(100vh - 120px)', 
        overflowY: 'auto',
        display: { xs: 'none', md: 'block' }, // 仅在电脑端显示
        // 隐藏滚动条
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none', 
      }}
    >
      <Typography 
        variant="subtitle2" 
        fontWeight="bold" 
        color="text.secondary"
        sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, px: 2 }}
      >
        <FormatListBulletedIcon fontSize="small" />
        本课大纲
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'transparent', 
          borderLeft: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 0
        }}
      >
        <List disablePadding>
          {items.map((item) => {
            const isActive = activeId === item.targetId;
            return (
              <ListItemButton
                key={item.targetId}
                onClick={() => handleClick(item.targetId)}
                sx={{
                  py: 1,
                  px: 2,
                  mb: 0.5,
                  borderRadius: '0 8px 8px 0',
                  borderLeft: '2px solid transparent',
                  borderLeftColor: isActive ? 'primary.main' : 'transparent',
                  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  marginLeft: '-2px',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.text.primary, 0.03),
                    color: 'primary.main'
                  }
                }}
              >
                <ListItemText 
                  primary={item.title}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    noWrap: true
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}