import React from 'react';
import classNames from "classnames";
import {FiSearch} from "react-icons/fi";


const DropdownSearchBar = ({className, onChange, placeholder}) => {

  const handleChange = event => {
    onChange(event.target.value);
  };

  const styles = classNames(
    'w-full outline-none py-2 px-4',
    'bg-nav-bg-hover rounded-lg',
    'text-gray-c8 focus'
  );

  return (
    <div className={className + ' flex items-center justify-between'}>
      <input autoFocus className={styles} type='text' maxLength={26} placeholder={placeholder} onChange={handleChange}/>
      <FiSearch className='ml-4' size={20} color='#B8B8B8'/>
    </div>
  );
};

export default DropdownSearchBar;