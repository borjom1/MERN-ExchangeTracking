import React from 'react';
import classNames from "classnames";

const InputField = ({className, setGmail, icon}) => {

  const inputStyles = classNames(
    'outline-0',
    'w-full bg-dark-28 py-1 pl-2 pr-4',
    'placeholder-gray-56',
    'text-almost-white'
  );

  const rootDivClasses = classNames(
    'border-2 rounded-lg border-gray-6e flex items-center w-full px-2',
    className
  );

  return (
    <div className={rootDivClasses}>
      <input
        className={inputStyles}
        placeholder='example@gmail.com'
        onChange={e => setGmail(e.target.value)}
      />
      {icon}
    </div>
  );
};

export default InputField;