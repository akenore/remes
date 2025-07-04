import { ComponentProps } from 'react';
import * as Icons from '@/components/icons';

export type IconName = keyof typeof Icons;

interface IconProps extends ComponentProps<'svg'> {
  name: IconName;
  sizeClass?: string;
  className?: string;
  label?: string;
}

export default function Icon({ name, sizeClass = 'w-6 h-6', className = '', label, ...rest }: IconProps) {
  const Svg = Icons[name];

  if (!Svg) return null;

  return (
    <Svg
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      className={`${sizeClass} ${className}`.trim()}
      {...rest}
    />
  );
} 