import '@emotion/react';
import type { ThemeColors } from './theme';

declare module '@emotion/react' {
  export interface Theme {
    colors: ThemeColors;
    fontFamily: string;
  }
}
