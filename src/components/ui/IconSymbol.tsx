// Pure React Native IconSymbol component - simplified version
import { Text, type TextProps } from 'react-native';

interface IconSymbolProps extends TextProps {
  name: string;
  size?: number;
  weight?: 'light' | 'medium' | 'bold';
  color?: string;
}

const iconMap: Record<string, string> = {
  'chevron.right': '›',
  'chevron.left': '‹',
  'chevron.up': '^',
  'chevron.down': 'v',
  'home': '🏠',
  'camera': '📷',
  'info': 'ℹ️',
  'settings': '⚙️',
  'share': '📤',
  'close': '✕',
  'check': '✓',
  'plus': '+',
  'minus': '-',
  'edit': '✏️',
  'delete': '🗑️',
  'search': '🔍',
  'menu': '☰',
  'star': '⭐',
  'heart': '❤️',
  'bookmark': '🔖',
  'download': '⬇️',
  'upload': '⬆️',
  'refresh': '🔄',
  'play': '▶️',
  'pause': '⏸️',
  'stop': '⏹️',
  'next': '⏭️',
  'previous': '⏮️',
};

export function IconSymbol({ name, size = 16, weight = 'medium', color = '#000', style, ...props }: IconSymbolProps) {
  const icon = iconMap[name] || '?';
  
  return (
    <Text
      style={[
        {
          fontSize: size,
          color,
          fontWeight: weight === 'bold' ? 'bold' : weight === 'medium' ? '600' : '300',
        },
        style,
      ]}
      {...props}
    >
      {icon}
    </Text>
  );
}
