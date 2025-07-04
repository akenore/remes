import { SVGProps } from 'react';

export default function BuildingsGroupIcon({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 53 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <path d="M36.1842 27.6721H16.8387V49.3727H36.1842V27.6721Z" fill="currentColor" />
      <path d="M3.08349 49.3727H13.3968V27.6721H3.08349V49.3727Z" fill="currentColor" />
      <path d="M39.6221 49.3727H49.9353V27.6721H39.6221V49.3727Z" fill="currentColor" />
      <path d="M48.7534 10.4833H36.8226V2.37848H16.1055V4.72496C16.058 5.24687 16.071 5.84643 16.1055 6.47187V10.479H3.0791V24.23H49.9353V10.479H48.7534V10.4833ZM32.2289 10.4833H20.7079V7.04555H32.2289V10.4833Z" fill="currentColor" />
    </svg>
  );
} 