import React from 'react';
import classNames from "classnames";

const columnTextStyles = 'text-gray-6e text-xl';
const bgStyle = 'bg-dark-28 rounded-lg';

const Columns = (
  {
    className,
    column1Text, icon1Column,
    column2Text, icon2Column,
    column3Text, icon3Column,
  }) => {

  const rootDivClasses = classNames(
    bgStyle,
    'px-10 py-3 px-16 flex justify-between options-center',
    className
  );

  return (
    <div className={rootDivClasses}>
      <div className='w-2/4 flex items-center gap-1'>
        {icon1Column}
        <p className={columnTextStyles}>{column1Text}</p>
      </div>

      <div className='w-2/4 flex justify-between'>
        <div className='w-1/4 flex items-center gap-1'>
          {icon2Column}
          <p className={columnTextStyles}>{column2Text}</p>
        </div>

        <div className='w-1/4 flex items-center gap-1'>
          {icon3Column}
          <p className={columnTextStyles}>{column3Text}</p>
        </div>
      </div>
    </div>
  );
};

export default Columns;