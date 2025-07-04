import { SVGProps } from 'react';

// TODO: Replace with accurate heart-in-hand SVG once provided
export default function HeartHandIcon({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <path d="M12 21s-6-4.35-6-8a3 3 0 016-2 3 3 0 016 2c0 3.65-6 8-6 8z" fill="currentColor" />
      <path d="M3 14h6v2H3z" fill="currentColor" />
    </svg>
  );
} 