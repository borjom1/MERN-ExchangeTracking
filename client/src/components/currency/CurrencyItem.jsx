import React from 'react';
import classNames from "classnames";

const CurrencyItem = ({className, id, icon, name, price, change, onClick}) => {

  const rowStyle = ' flex items-center';
  const containerStyle = classNames(
    ' py-2.5 px-6',
    'border-2 border-gray-40 rounded-lg',
    'cursor-pointer',
    'hover:bg-gray-40 hover:ease-in duration-150',
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
    <div className={className + rowStyle + containerStyle} onClick={() => onClick(id)}>
      <div className={rowStyle + ' w-2/4 gap-8'}>
        <img className='w-14' src={icon} alt='icon'/>
        <p className='text-white text-xl'>{name}</p>
      </div>
      <p className='w-1/4 text-white text-lg'>{price}</p>
      <p className={'w-1/4 text-xl font-light text-end ' + textChangeColor}>{change}</p>
    </div>
  );
};

export default CurrencyItem;