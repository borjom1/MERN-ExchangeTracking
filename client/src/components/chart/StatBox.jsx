import React from 'react';
import classNames from "classnames";

const StatBox = ({className, outline, title, bgColor, value, valueColor, valueSize}) => {

  const valueClasses = classNames(
    'text-bold text-center mt-1',
    valueColor, valueSize
  );

  if (!bgColor) bgColor = 'dark-28';

  const rootDiv = classNames(
    'rounded-lg px-6 py-2',
    outline ? 'border-4 border-dark-34' : `bg-${bgColor}`,
    className
  );

  return (
    <div className={rootDiv}>
      <p className='text-sm text-gray-b8 mt-1'>{title}</p>
      <p className={valueClasses}>{value}</p>
    </div>
  );
};

export default StatBox;