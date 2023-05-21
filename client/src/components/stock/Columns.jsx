import React from 'react';
import {AiOutlinePaperClip} from "react-icons/ai";
import {RiStackFill, RiStackLine} from "react-icons/ri";
import {TbChartLine} from "react-icons/tb";

const Columns = ({className}) => {

  const columnTextStyle = 'text-gray-6e text-xl';
  const flexStyle = 'flex gap-1 items-center';

  return (
    <div className={'bg-dark-28 rounded-lg flex py-3 px-10 ' + className}>
      <div className={'w-2/5 ' + flexStyle}>
        <AiOutlinePaperClip color='#6E6E6E' size='24'/>
        <p className={columnTextStyle}>Stock</p>
      </div>

      <div className={'w-1/5 ' + flexStyle}>
        <RiStackLine color='#6E6E6E' size='22'/>
        <p className={columnTextStyle}>Start rate</p>
      </div>

      <div className={'w-1/5 ' + flexStyle}>
        <RiStackFill color='#6E6E6E' size='22'/>
        <p className={columnTextStyle}>End rate</p>
      </div>

      <div className={'w-1/5 ' + flexStyle}>
        <TbChartLine color='#6E6E6E' size='24'/>
        <p className={columnTextStyle}>Change (12h)</p>
      </div>
    </div>
  );
};

export default Columns;