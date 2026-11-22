export interface ThemeColors {
  canvas: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  line: string;
}

interface AppTheme {
  colors: ThemeColors;
  fontFamily: string;
}

export const theme: AppTheme = {
  colors: {
    canvas: '#15161d',
    surface: '#1d1f28',
    ink: '#f4f4f6',
    muted: '#a4a6b5',
    accent: '#a1eee2',
    line: '#30323e',
  },
  fontFamily:
    '"Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif',
};
