import { SVGProps } from 'react';

// TODO: Replace with actual bus SVG once provided
export default function BusIcon({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 53 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <path d="M9.30136 42.3515H13.8833V46.4923H18.0261V42.3515H34.985V46.4923H39.1278V42.3515H43.7097V41.0372L43.8601 9.6252H43.868V5.25879H9.30136V42.3515ZM30.6483 36.0414H22.3667V32.8863H30.6483V36.0414ZM40.117 36.0414H35.9742V32.8863H40.117V36.0414ZM13.2938 9.62124H39.7213V26.5762H13.2938V9.62124ZM12.9021 32.8863H17.0448V36.0414H12.9021V32.8863Z" fill="currentColor"/>
      <path d="M46.0324 17.5069V23.817H49.186V17.5069H46.0324Z" fill="currentColor"/>
      <path d="M3.83702 17.5069V17.7959L3.8291 17.8038V23.817H6.98268V17.5069H3.83702Z" fill="currentColor"/>
    </svg>
  );
} 
