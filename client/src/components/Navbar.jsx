import React from 'react';
import {NavLink} from "react-router-dom";
import classNames from "classnames";
import {TbMoneybag} from "react-icons/tb";
import {RiStockLine} from "react-icons/ri";
import {MdKeyboardDoubleArrowUp} from "react-icons/md";
import {MdKeyboardDoubleArrowDown} from "react-icons/md";

const Navbar = () => {
  const navLinkStyle = classNames(
    'flex justify-between items-center gap-2',
    'text-white py-3 px-6 hover:bg-nav-bg-hover'
  );

  const iconStyles = {color: '#FFFFFF', size: '20'}

  return (
    <nav className='inset-x-20 top-0 fixed z-30 bg-nav-bg flex justify-center gap-12 rounded-lg'>
      <NavLink className={navLinkStyle} to='/currencies'>
        <TbMoneybag {...iconStyles}/>
        Currencies
      </NavLink>
      <NavLink className={navLinkStyle} to='/stocks'>
        <RiStockLine {...iconStyles}/>
        Stocks
      </NavLink>
      <NavLink className={navLinkStyle} to='/gainers'>
        <MdKeyboardDoubleArrowUp {...iconStyles}/>
        Gainers
      </NavLink>
      <NavLink className={navLinkStyle} to='/losers'>
        <MdKeyboardDoubleArrowDown {...iconStyles}/>
        Losers
      </NavLink>
    </nav>
  );
};

export default Navbar;