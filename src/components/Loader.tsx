import React from 'react';

type LoaderProps = {
  width: string | number;
  height: string | number;
  className?: string;
  color?: string;
  strokeWidth?: number;
};

const Loader = ({
  width = 40,
  height = 40,
  color = '#161616',
  strokeWidth = 5,
  className,
}: LoaderProps) => {
  const circleStyle = {
    width: width,
    height: height,
    border: `${strokeWidth}px solid ${color}`,
    borderRadius: '50%',
    borderTopColor: 'transparent',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div className='fixed inset-0 z-500 flex items-center justify-center bg-gray-200 opacity-60'>
      <div
        className={className}
        style={{
          display: 'inline-block',
          ...circleStyle,
        }}
      />
    </div>
  );
};

export default Loader;
