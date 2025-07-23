import React from "react";

interface TickMarkCircleIconProps {
  className?: string;
}

const TickMarkCircleIcon: React.FC<TickMarkCircleIconProps> = ({
  className,
}) => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
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
