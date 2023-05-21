import React from 'react';
import classNames from "classnames";

const StockItem = ({icon, stockTitle, startRate, endRate, change, id, onClick}) => {

  const rowStyle = ' flex items-center';
  const containerStyle = classNames(
    ' py-2.5 px-10',
    'border-2 border-gray-40 rounded-lg',
    'cursor-pointer',
    'hover:bg-dark-28 hover:ease-in duration-150',
  );

  let textChangeColor;
  if (change > 0) {
    textChangeColor = 'text-green';
    change = '+' + change;
  } else {
    textChangeColor = 'text-red';
  }
  change += '%';

  return (
    <div className={containerStyle + rowStyle} onClick={() => onClick(id)}>
      <div className={rowStyle + ' gap-8 w-2/5'}>
        <img className='w-11 rounded-full' src={icon} alt='icon'/>
        <p className='text-white text-xl'>{stockTitle}</p>
      </div>
      <p className='w-1/5 text-gray-c8 text-lg'>{`${startRate} $`}</p>
      <p className='w-1/5 text-white text-lg'>{`${endRate} $`}</p>
      <p className={'w-1/5 text-xl font-light ' + textChangeColor}>{change}</p>
    </div>
  );
};

export default StockItem;