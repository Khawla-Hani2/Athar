import { useTheme } from '@/contexts/ThemeContext';

export function useIsDarkMode(): boolean {
  const { theme } = useTheme();
  return theme === 'dark';
}
