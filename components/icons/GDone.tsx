import { SVGProps } from 'react';

export default function GDone({ className, ...rest }: SVGProps<SVGSVGElement>) {
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
        d="M43.3754 77.649C43.3754 77.649 70.904 69.3136 70.904 46.3349C70.904 23.3526 71.9015 21.5585 69.6947 19.3482C67.4844 17.1379 46.9852 9.99023 43.3754 9.99023C39.7657 9.99023 19.2665 17.1379 17.0597 19.3482C14.8494 21.5585 15.8469 23.3526 15.8469 46.3349C15.8469 69.3136 43.3754 77.649 43.3754 77.649Z"
        stroke="#EEDAB8"
        strokeWidth="4.36934"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34.0511 42.7309L40.84 49.5305L54.8267 35.5366"
        stroke="#EEDAB8"
        strokeWidth="4.36934"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
} 