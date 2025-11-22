import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { 
  Container, Typography, Box, IconButton, Fab, Breadcrumbs, 
  Link as MuiLink, Snackbar, Alert, CircularProgress, Stack 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import { lessonService } from '@/api/lesson.service';
import Fretboard from '../components/Fretboard';
import PracticePlayer from '@/modules/player/components/PracticePlayer';
// ✅ 引入目录组件
import TableOfContents, { type TocItem } from '../components/TableOfContents';

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonService.getLessonById(Number(id)),
    enabled: !!id
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);
  
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => {
        console.error("Audio play failed:", e);
        setAudioError(true);
      });
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlayingAudio(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [lesson]);

  if (isLoading) return <Box sx={{display:'flex', justifyContent:'center', mt: 10}}><CircularProgress /></Box>;
  if (!lesson) return <Typography sx={{p:4, color:'white'}}>未找到该课程</Typography>;

  // ✅ 1. 生成目录数据
  const tocItems: TocItem[] = [];
  lesson.content.forEach((block, index) => {
    if (block.title) {
      tocItems.push({ title: block.title, targetId: `section-${index}` });
    }
  });
  if (lesson.etude) {
    tocItems.push({ title: '实战练习', targetId: 'section-etude' });
  }

  return (
    <Box sx={{ pb: 12, minHeight: '100vh' }}>
      {lesson.etude?.audioSrc && (
        <audio ref={audioRef} src={lesson.etude.audioSrc} preload="none" />
      )}

      {/* 顶部导航 */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'rgba(18, 18, 18, 0.9)', // 增加一点背景色防止透明穿透
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <IconButton onClick={() => navigate('/')} edge="start" color="inherit">
          <ArrowBackIcon />
        </IconButton>
        <Breadcrumbs aria-label="breadcrumb" sx={{color: 'text.secondary'}}>
          <MuiLink underline="hover" color="inherit" onClick={() => navigate('/')} sx={{cursor:'pointer'}}>
            首页
          </MuiLink>
          <Typography color="text.primary">第 {lesson.id} 课</Typography>
        </Breadcrumbs>
      </Box>

      {/* ✅ 2. 使用 Container xl + Stack 实现左右布局 */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Stack direction="row" spacing={{ md: 6, lg: 8 }} alignItems="flex-start">
          
          {/* 左侧：目录 (只在桌面显示) */}
          <TableOfContents items={tocItems} />

          {/* 右侧：内容区域 (flex: 1 自适应) */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            
            {/* 标题区 */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">{lesson.title}</Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>{lesson.subtitle}</Typography>
              <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.8, color: 'text.primary' }}>
                {lesson.description}
              </Typography>
            </Box>

            {/* 内容循环 */}
            {lesson.content.map((block, index) => (
              <Box 
                key={index} 
                id={`section-${index}`} // ✅ 关键：添加锚点 ID
                sx={{ 
                  mb: 6, 
                  scrollMarginTop: '100px' // 这一行配合 window.scrollTo 计算，防止被 header 遮挡
                }}
              >
                {/* 渲染 Text */}
                {block.type === 'text' && (
                  <Box>
                    {block.title && <Typography variant="h6" color="white" gutterBottom>{block.title}</Typography>}
                    <Typography paragraph sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                      {block.text}
                    </Typography>
                  </Box>
                )}
                
                {/* 渲染 Fretboard */}
                {block.type === 'fretboard' && block.notes && (
                  <Box>
                     {block.title && <Typography variant="h6" color="white" gutterBottom>{block.title}</Typography>}
                     <Fretboard notes={block.notes} title={block.title} />
                  </Box>
                )}
              </Box>
            ))}

            {/* 实战练习 */}
            {lesson.etude && (
              <Box 
                id="section-etude" // ✅ 关键：实战练习锚点
                sx={{ mt: 8, pt: 4, borderTop: '1px dashed rgba(255,255,255,0.1)', scrollMarginTop: '100px' }}
              >
                <Typography variant="h5" color="primary.main" gutterBottom>
                  实战练习: {lesson.etude.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  点击播放按钮开始跟练。光标会自动跟随。
                </Typography>
                
                <PracticePlayer 
                  fileUrl={lesson.etude.gpFile} 
                  title={lesson.etude.title} 
                />
              </Box>
            )}
          </Box>
        </Stack>
      </Container>

      {/* 悬浮播放按钮 */}
      {lesson.etude?.audioSrc && (
        <Fab 
          color="primary" 
          variant="extended" 
          sx={{ 
            position: 'fixed', 
            bottom: 32, 
            right: 32,
            zIndex: 100,
            bgcolor: isPlayingAudio ? 'secondary.main' : 'primary.main',
            color: isPlayingAudio ? 'secondary.contrastText' : 'primary.contrastText'
          }}
          onClick={toggleAudio}
        >
          {isPlayingAudio ? <PauseIcon sx={{ mr: 1 }} /> : <PlayArrowIcon sx={{ mr: 1 }} />}
          {isPlayingAudio ? "暂停伴奏" : "播放伴奏"}
        </Fab>
      )}

      <Snackbar open={audioError} autoHideDuration={6000} onClose={() => setAudioError(false)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          无法播放伴奏音频，请检查文件是否存在。
        </Alert>
      </Snackbar>
    </Box>
  );
}