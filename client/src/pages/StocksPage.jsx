import React, {useEffect, useState} from 'react';
import Dropdown from "../components/Dropdown";
import StockList from "../components/stock/StockList";
import {MdModeEdit} from "react-icons/md";
import Button from "../components/button/Button";
import Columns from "../components/stock/Columns";
import {getAllStocks, getRecentStockInfo} from "../api/stockApi";
import useAppContext from "../hooks/useAppContext";

const UPDATE_INTERVAL = +process.env.REACT_APP_UPDATE_INTERVAL_MS;

const StocksPage = () => {
  const {exchangeOptions, setClickedStock, setSelectedExchange: saveSelectedExchange} = useAppContext();
  const {addedStockSymbols, setAddedStockSymbols} = useAppContext();

  const [stockOptions, setStockOptions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(exchangeOptions[0]);
  const [isEditBtnEnabled, setEditBtnEnabled] = useState(false);

  // init call
  useEffect(() => {
    console.log('useEffect(): init');

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    saveSelectedExchange(selectedExchange);
    getAllStocks().then(result => {
      setStockOptions(result);
    });
  }, []);

  useEffect(() => {
    console.log('useEffect(): simple update');
    update();
  }, [addedStockSymbols, selectedExchange]);

  // regular updates
  useEffect(() => {
    console.log('useEffect(): interval');
    const interval = setInterval(() => {
      console.log('[regular update]');
      update();
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [addedStockSymbols, selectedExchange]);

  const update = () => {
    const body = {
      exchange: selectedExchange.id,
      symbols: addedStockSymbols
    };
    getRecentStockInfo(body).then(result => setStocks(result));
  };

  const handleStockClick = id => {
    console.log('clicked on ' + id);
    setClickedStock(id);
  };

  const handleEditList = id => {
    console.log('DELETE ' + id)
    setAddedStockSymbols(addedStockSymbols.filter(e => e !== id)); // this triggers hook
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  const handleAddToList = option => {
    console.log('ADD ' + option.id)
    setAddedStockSymbols([...addedStockSymbols, option.id]); // this triggers hook
  };

  return (
    <div className='pt-16'>
      <h1 className='text-center text-4xl text-white'>Live stock exchanges</h1>
      <p className='mt-1 text-center font-light text-base text-cyan'>
        Check live stock rates using our service
      </p>

      <div className='mt-20 flex justify-start gap-4 items-center'>
        <Dropdown
          className='relative z-10'
          isAbsolute
          offSearchBar
          options={exchangeOptions}
          selected={selectedExchange} showSelected
          onSelect={option => {
            saveSelectedExchange(option);
            setSelectedExchange(option);
          }}
        />
        <Button
          className='w-[60px] h-[60px] shadow-lg'
          icon={<MdModeEdit className='w-full' color='#FFFFFF' size='26'/>}
          color='#282828'
          onHoverColor='#343434'
          onHoverClickedColor='#1f8cd3'
          isActivated={isEditBtnEnabled}
          clickedColor='#1575b2'
          onClick={() => setEditBtnEnabled(!isEditBtnEnabled)}
        />
      </div>

      <Columns className='mt-12'/>

      <StockList
        className='mt-4'
        stocks={stocks}
        onItemClick={handleStockClick}
        onEditClick={handleEditList}
        isEditable={isEditBtnEnabled}
      />

      <div className='mt-3 border-2 border-gray-40 rounded-lg'>
        <Dropdown
          className='w-full bg-dark-34'
          title='Add stock ...'
          isFixedHeight
          options={stockOptions}
          delOptions={addedStockSymbols}
          onSelect={handleAddToList}
          searchPlaceholder='type in stock name'
        />
      </div>

    </div>
  );
};

export default StocksPage;