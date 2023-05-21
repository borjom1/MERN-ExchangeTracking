import React, {useState} from 'react';
import {CiCircleChevDown} from "react-icons/ci";
import {CiCircleChevLeft} from "react-icons/ci";
import classNames from "classnames";
import DropdownSearchBar from "./DropdownSearchBar";

const Dropdown = ({
                    selected, showSelected, onSelect, options, delOptions, small,
                    bg, className, isAbsolute, title, isFixedHeight, offSearchBar,
                    searchPlaceholder
                  }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');

  const onChangeSearchText = text => {
    setSearchText(text);
  };

  const style = classNames(
    'flex justify-between items-center px-4 cursor-pointer',
    small ? '' : 'py-1'
  );

  const optionStyle = classNames(style,
    'cursor-pointer font-light font-sm text-gray-b8'
  );

  // delete selected option from list
  selected?.id && (options = options.filter(opt => opt.id !== selected.id));

  delOptions && (options = options.filter(opt => !delOptions.includes(opt.id)));

  // delete non-matched elements by title
  searchText?.trim() && (options = options.filter(opt =>
    opt.title.toLowerCase().startsWith(searchText.trim().toLowerCase())
  ));

  const renderedOptions = options?.map(opt =>
    <div className={optionStyle + ' hover:bg-nav-bg-hover hover:ease-in duration-300'}
         key={opt.id}
         onClick={() => {
           setIsExpanded(false);
           setSearchText('');
           onSelect(opt);
         }}>
      <p className={small ? 'flex-1 text-center' : ''}>{opt.title}</p>
      {opt.icon && <img className='w-11 h-11' src={opt.icon} alt='icon'/>}
    </div>
  );

  const dropDownIcon = isExpanded ? <CiCircleChevLeft size='36'/> : <CiCircleChevDown size='36'/>;

  const selectedContent = selected && showSelected ?
    <div className={optionStyle}>
      <p className='text-center'>{selected.title}</p>
      {selected.icon && <img className='w-11 h-11' src={selected.icon} alt='icon'/>}
    </div>
    : <p className='text-center'>{title || 'Select currency ...'}</p>;

  const mainDivClasses = classNames(
    'w-80 text-white rounded-lg drop-shadow-lg',
    bg ? bg : 'bg-dark-28',
    className
  );

  const itemsListStyle = classNames(
    'w-full rounded max-h-48 overflow-y-auto',
    bg ? bg : 'bg-dark-28',
    isAbsolute && 'absolute',
    isExpanded && isFixedHeight && 'h-48'
  );

  return (
    <div className={mainDivClasses}>
      <div className={style + (small ? '' : ' py-1')}
           onClick={() => {
             setIsExpanded(!isExpanded);
             setSearchText('');
           }}
      >
        <div className='w-full'>
          {selectedContent}
        </div>
        {dropDownIcon}
      </div>
      <div className={itemsListStyle}>
        {isExpanded && <div>
          {!offSearchBar &&
            <DropdownSearchBar
              className='my-2 mx-4'
              onChange={onChangeSearchText}
              placeholder={searchPlaceholder}
            />
          }
          {renderedOptions}
        </div>}
      </div>
    </div>
  );
};

export default Dropdown;