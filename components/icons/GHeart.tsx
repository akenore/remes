import { SVGProps } from 'react';

export default function GHeart({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="87"
      height="87"
      viewBox="0 0 87 87"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7101 41.7398C6.85994 29.7194 11.3595 15.9802 23.9791 11.9148C30.6173 9.77268 37.9443 11.0357 43.463 15.1872C48.6838 11.1505 56.2799 9.78703 62.9109 11.9148C75.5305 15.9802 80.0588 29.7194 76.2123 41.7398C70.22 60.793 43.463 75.4687 43.463 75.4687C43.463 75.4687 16.9033 61.0155 10.7101 41.7398Z"
        stroke="#EEDAB8"
        strokeWidth="4.36934"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M57.8162 24.1633C61.6555 25.4048 64.3682 28.8316 64.6947 32.8539"
        stroke="#EEDAB8"
        strokeWidth="4.36934"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
} 