import { SVGProps } from 'react';

export default function PlayButton({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="150"
      height="150"
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }} // Important for blur to not get clipped
      {...rest}
    >
      {/* 🔵 Radar waves behind the button */}
      <circle cx="75" cy="75" r="47" className="radar-pulse delay-0" />
      <circle cx="75" cy="75" r="47" className="radar-pulse delay-1" />
      <circle cx="75" cy="75" r="47" className="radar-pulse delay-2" />

      {/* 🔵 Static center button (your original rect) */}
      <rect x="28" y="28" width="94" height="94" rx="47" fill="#073563" />

      {/* ▶️ Play icon */}
      <path d="M93.4189 75L65.7906 90.9512L65.7906 59.0487L93.4189 75Z" fill="white" />
    </svg>
  );
}
