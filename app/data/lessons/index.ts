import type { Lesson } from '@/types';
import { asset } from '@/utils/path';

// 使用 Vite 的 glob 功能自动导入所有 lesson-*.json
const lessonModules = import.meta.glob('./lesson-*.json', { eager: true });

// 处理资源路径
const processLesson = (lesson: any): Lesson => ({
  ...lesson,
  etude: lesson.etude ? {
    ...lesson.etude,
    audioSrc: asset(lesson.etude.audioSrc),
    gpFile: asset(lesson.etude.gpFile),
  } : undefined,
});

export const lessons: Lesson[] = Object.values(lessonModules)
  .map((mod: any) => processLesson(mod.default))
  .sort((a, b) => a.id - b.id);

export const getLessonById = (id: number): Lesson | undefined => {
  return lessons.find(l => l.id === id);
};
