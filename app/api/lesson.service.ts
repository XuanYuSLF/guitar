import type { Lesson } from '../types';

// ✅ 核心修复：获取当前环境的基础路径
// 开发环境通常是 "/"
// 生产环境 (GitHub Pages) 是 "/你的仓库名/"
const BASE_URL = import.meta.env.BASE_URL;

/**
 * 路径拼接辅助函数
 * 自动处理路径前缀，防止部署到 GitHub Pages 后找不到文件
 * @param path 相对 public 目录的路径，例如 "audio/texas.mp3"
 */
const asset = (path: string) => {
  // 移除开头的斜杠，防止出现雙斜杠 (//)
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}${cleanPath}`;
};

const MOCK_LESSONS: Lesson[] = [
  {
    id: 1,
    title: "第 1 课：小调五声音阶",
    subtitle: "Minor Pentatonic Scale",
    description: "学习吉他布鲁斯的核心——五声音阶指型1，以及如何阅读六线谱。",
    tags: ["音阶", "基础", "指型1"],
    content: [
      {
        type: "text",
        text: "小调五声音阶几乎是所有布鲁斯和摇滚乐的基础。我们将从指型 1 开始，它是指板上最常用的形状。"
      },
      {
        type: "fretboard",
        title: "E 小调五声音阶 - 指型 1 (空弦)",
        notes: [
          { string: 6, fret: 0, root: true, label: 'E' }, { string: 6, fret: 3, root: false },
          { string: 5, fret: 0, root: false }, { string: 5, fret: 2, root: false },
          { string: 4, fret: 0, root: false }, { string: 4, fret: 2, root: true, label: 'E' },
          { string: 3, fret: 0, root: false }, { string: 3, fret: 2, root: false },
          { string: 2, fret: 0, root: false }, { string: 2, fret: 3, root: false },
          { string: 1, fret: 0, root: true, label: 'E' }, { string: 1, fret: 3, root: false },
        ]
      }
    ],
    etude: {
      title: "Texas Rock",
      tempo: 120,
      // ✅ 使用 asset 函数包裹路径
      audioSrc: asset("audio/texas_rock.mp3"),
      gpFile: asset("tabs/texas_rock.gpx")
    }
  },
  {
    id: 2,
    title: "第 2 课：可移动音阶与和弦",
    subtitle: "Movable Scales & 12 Bar Blues",
    description: "学习如何移动指型 1 来在任意调演奏，掌握“封闭和弦”以及经典的 12 小节布鲁斯进行。",
    tags: ["可移动指型", "12小节", "和弦进行", "A调"],
    content: [
      {
        type: "text",
        title: "可移动的音阶",
        text: "既然你已经学习了 E 小调五声音阶的指型 1，现在我们学习它的“可移动”类型。这里的“可移动”是指可以在指板上来回移动、不使用任何空弦音的指型。\n\n规则是：每个手指负责一个品格。例如，如果你用食指按第 3 品，那么中指按 4 品，无名指按 5 品，小指按 6 品。"
      },
      {
        type: "fretboard",
        title: "A 小调五声音阶 - 指型 1 (可移动)",
        notes: [
          { string: 6, fret: 5, root: true, label: 'A' }, { string: 6, fret: 8, root: false },
          { string: 5, fret: 5, root: false }, { string: 5, fret: 7, root: false },
          { string: 4, fret: 5, root: false }, { string: 4, fret: 7, root: true, label: 'A' },
          { string: 3, fret: 5, root: false }, { string: 3, fret: 7, root: false },
          { string: 2, fret: 5, root: false }, { string: 2, fret: 8, root: false },
          { string: 1, fret: 5, root: true, label: 'A' }, { string: 1, fret: 8, root: false },
        ]
      },
      {
        type: "text",
        title: "12 小节布鲁斯和弦进行",
        text: "这是布鲁斯音乐的基石。你需要掌握可移动的 I7、IV7 和 V7 和弦。在 A 调中，它们的位置关系如下：\n\n• I7 (A7): 根音在六弦 5 品\n• IV7 (D7): 根音在五弦 5 品\n• V7 (E7): 根音在五弦 7 品"
      }
    ],
    etude: {
      title: "Blues Rock Tune",
      tempo: 120,
      // ✅ 使用 asset 函数包裹路径
      audioSrc: asset("audio/texas_rock.mp3"), // 这里暂时复用同一个文件演示
      gpFile: asset("tabs/blues_rock_tune.gpx")
    }
  }
];

export const lessonService = {
  getAllLessons: async (): Promise<Lesson[]> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_LESSONS;
  },

  getLessonById: async (id: number): Promise<Lesson | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_LESSONS.find(l => l.id === id);
  }
};