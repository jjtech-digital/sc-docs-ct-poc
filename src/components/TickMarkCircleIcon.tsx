import React from "react";

interface TickMarkCircleIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
  strokeWidth?: number;
  viewBox?: string;
}

const TickMarkCircleIcon: React.FC<TickMarkCircleIconProps> = ({
  className,
  width,
  height,
  color,
  strokeWidth,
  viewBox = "0 0 24 24",
}) => (
  <svg
    width={width}
    height={height}
    fill="none"
    viewBox={viewBox}
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <path
      d="M8 12l3 3 5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default TickMarkCircleIcon;
