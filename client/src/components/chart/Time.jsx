import React from 'react';
import {BsRecord} from 'react-icons/bs';
import {BsRecord2} from 'react-icons/bs';
import classNames from "classnames";

const Time = ({time, start, className, setColor, outline}) => {

  let color = start ? '#FFE15A' : '#F4BE37';
  setColor && (color = setColor);

  const rootDivClasses = classNames(
    'flex gap-4 justify-between rounded-lg px-4 py-1',
    outline ? 'border-2 border-dark-28' : 'bg-dark-28',
    className
  );

  return (
    <div className={rootDivClasses}>
      <div className='flex gap-1 items-center'>
        {start ? <BsRecord color='#6E6E6E' size={24} /> : <BsRecord2 color='#6E6E6E' size={24} />}
        <p className='font-semibold text-gray-6e text-xl'>{start ? 'From' : 'To'}</p>
      </div>
      <p className={'text-lg'} style={{color}}>{time}</p>
    </div>
  );
};

export default Time;