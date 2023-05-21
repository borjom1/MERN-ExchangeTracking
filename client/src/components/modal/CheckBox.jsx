import React from 'react';
import classNames from "classnames";

const CheckBox = ({className, label, color = '#1575b2', checked, handleChange}) => {

  const checkBoxStyle = {
    width: 16,
    accentColor: color
  };

  const divRootClasses = classNames(
    'flex gap-3 bg-dark-34 rounded-lg py-1 px-3',
    className
  );

  return (
    <div className={divRootClasses}>
        <input
          style={checkBoxStyle}
          type='checkbox'
          checked={checked}
          onChange={handleChange}
        />
        <p className='text-gray-b8'>{label}</p>
    </div>
  );
};

export default CheckBox;