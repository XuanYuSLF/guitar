export interface Note {
  string: number;
  fret: number;
  root: boolean;
  label?: string;
}

export interface ContentBlock {
  type: "text" | "fretboard";
  text?: string;
  title?: string;
  notes?: Note[];
}

export interface Etude {
  title: string;
  tempo: number;
  audioSrc: string;
  gpFile: string;
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  content: ContentBlock[];
  etude?: Etude;
}
