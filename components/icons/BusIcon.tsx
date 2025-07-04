import { SVGProps } from 'react';

// TODO: Replace with actual bus SVG once provided
export default function BusIcon({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <rect x="2" y="5" width="20" height="12" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="17" r="2" fill="currentColor" />
      <circle cx="17" cy="17" r="2" fill="currentColor" />
    </svg>
  );
} 