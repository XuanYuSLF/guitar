import { 
  Container, Typography, Grid, Card, CardContent, CardActionArea, 
  Chip, Box, CircularProgress, Tooltip, Stack 
} from '@mui/material'; // ✅ 确保引入 Stack
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import TimerIcon from '@mui/icons-material/Timer';
import { Link } from 'react-router'; 
import { useQuery } from '@tanstack/react-query';
import { lessonService } from '@/api/lesson.service';

export default function CatalogHome() {
  const { data: lessons, isLoading, error } = useQuery({
    queryKey: ['lessons'],
    queryFn: lessonService.getAllLessons
  });

  if (isLoading) return <Box sx={{display:'flex', justifyContent:'center', mt: 10}}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{textAlign:'center', mt: 4}}>无法加载课程数据</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
      {/* 顶部 Header 区域：响应式布局修复 */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} // 📱手机竖排，💻电脑横排
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
        spacing={2}
        sx={{ mb: 5 }}
      >
        {/* 左侧：标题 */}
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Blues You Can Use
          </Typography>
          <Typography variant="body1" color="text.secondary">
            吉他布鲁斯全攻略 - 数字化练习伴侣
          </Typography>
        </Box>

        {/* 右侧：工具箱入口 (节拍器) */}
        <Box sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' } }}> {/* 📱手机上靠右对齐 */}
          <Tooltip title="打开节拍器工具">
            <Card 
              variant="outlined" 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.05)', 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                minWidth: 80
              }}
            >
              <CardActionArea 
                component={Link} 
                to="/tools/metronome" 
                sx={{ p: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <TimerIcon color="secondary" fontSize="medium" />
                <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 'bold', color: 'text.primary' }}>
                  节拍器
                </Typography>
              </CardActionArea>
            </Card>
          </Tooltip>
        </Box>
      </Stack>

      {/* 课程列表区域 */}
      <Grid container spacing={2}>
        {lessons?.map((lesson) => (
          <Grid item xs={12} key={lesson.id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardActionArea 
                component={Link} 
                to={`/lesson/${lesson.id}`} 
                sx={{ display: 'flex', justifyContent: 'flex-start', p: 1 }}
              >
                {/* 课程图标 - 添加 flexShrink 防止被压缩 */}
                <Box sx={{ 
                  width: 80, height: 80, 
                  bgcolor: 'primary.dark', 
                  borderRadius: 2, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  mr: 2, ml: 1,
                  flexShrink: 0 // ✅ 关键修复：防止在小屏上变扁
                }}>
                  <LibraryMusicIcon sx={{ color: 'primary.main', fontSize: 30 }} />
                </Box>
                
                <CardContent sx={{ flex: 1, py: 1, px: 1 }}> {/* 减少内边距 */}
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.3 }}>
                    {lesson.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1.5, fontSize: '0.85rem' }}>
                    {lesson.subtitle}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {lesson.tags.map(tag => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        variant="outlined" 
                        color="primary" 
                        sx={{ fontSize: '0.7rem', height: 24 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}