export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface ElementResult {
  element: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  affinity: string; // e.g. "Chaos", "Order", "Neutral"
  hexColor: string;
}

export enum AppState {
  START = 'START',
  LOADING_QUIZ = 'LOADING_QUIZ',
  QUIZ = 'QUIZ',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface ElementTheme {
  name: string;
  color: string;
  icon: string; // Lucide icon name matching
}