import React from 'react';
import {Link} from "react-router-dom";
import Button from "../button/Button";
import {IoIosRemoveCircleOutline} from "react-icons/io";
import StockItem from "./StockItem";

const StockList = ({className, stocks, isEditable,
                     onEditClick = item => {},
                     onItemClick = item => {}
}) => {

  const renderedStocks = stocks.map(e =>
    <div key={e.id} className='flex items-center gap-2'>
      <Link to='/stocks/chart' className='flex-1'>
        <StockItem
          onClick={onItemClick}
          key={e.id}
          id={e.id}
          icon={e.icon}
          stockTitle={e.name}
          startRate={e.startRate}
          endRate={e.endRate}
          change={e.change}
        />
      </Link>
      {isEditable &&
        <Button
          icon={<IoIosRemoveCircleOutline size='24' color='#FFFFFF'/>}
          color='#a21a40'
          onHoverColor='#DF4A65'
          onClick={() => onEditClick(e.id)}
        />
      }
    </div>
  );

  return (
    <div className={className + ' flex flex-col gap-3'}>
      {renderedStocks}
    </div>
  );
};

export default StockList;