import React from 'react';
import CurrencyItem from "./CurrencyItem";
import Button from "../button/Button";
import {IoIosRemoveCircleOutline} from 'react-icons/io';
import {Link} from "react-router-dom";

const CurrencyList = ({currencies, isEditable, onEditClick, onItemClick}) => {

  const renderedCurrencies = currencies.map(e =>
    <div key={e.id} className='flex items-center gap-2'>
      <Link to='/currencies/chart' className='flex-1'>
        <CurrencyItem
          onClick={onItemClick}
          key={e.id}
          id={e.id}
          icon={e.icon}
          name={e.name}
          price={e.price}
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
    <div className='flex flex-col gap-3'>
      {renderedCurrencies}
    </div>
  );
};

export default CurrencyList;