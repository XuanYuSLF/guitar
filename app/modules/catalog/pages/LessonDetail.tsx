import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { 
  Container, 
  Typography, 
  Box, 
  IconButton, 
  Fab, 
  Breadcrumbs, 
  Link as MuiLink, 
  Snackbar, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import { lessonService } from '@/api/lesson.service';
import Fretboard from '../components/Fretboard';
import PracticePlayer from '@/modules/player/components/PracticePlayer';

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

  return (
    <Box sx={{ pb: 12 }}>
      {/* ✅ 直接使用数据中的本地路径 */}
      {lesson.etude?.audioSrc && (
        <audio 
          ref={audioRef} 
          src={lesson.etude.audioSrc} 
          preload="none" 
        />
      )}

      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
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

      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" color="primary.main" fontWeight="bold">{lesson.title}</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>{lesson.subtitle}</Typography>
          <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.8, color: 'text.primary' }}>
            {lesson.description}
          </Typography>
        </Box>

        {lesson.content.map((block, index) => {
          if (block.type === 'text') {
            return (
              <Box key={index} sx={{mb: 3}}>
                {block.title && <Typography variant="h6" color="white" gutterBottom>{block.title}</Typography>}
                <Typography paragraph sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                  {block.text}
                </Typography>
              </Box>
            );
          }
          if (block.type === 'fretboard' && block.notes) {
            return <Fretboard key={index} notes={block.notes} title={block.title} />;
          }
          return null;
        })}

        {lesson.etude && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" color="primary.main" gutterBottom>
              实战练习: {lesson.etude.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              点击播放按钮开始跟练。光标会自动跟随。
            </Typography>
            
            {/* ✅ 直接传递路径，无需任何处理 */}
            <PracticePlayer 
              fileUrl={lesson.etude.gpFile} 
              title={lesson.etude.title} 
            />
          </Box>
        )}
      </Container>

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