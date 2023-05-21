import React, {useEffect, useState} from 'react';
import useAppContext from "../hooks/useAppContext";
import Dropdown from "../components/Dropdown";
import Columns from "../components/stock/Columns";
import StockList from "../components/stock/StockList";
import {getTopStocks} from "../api/stockApi";

const UPDATE_INTERVAL = 60 * 1000; // 1s = 1000ms, 60 * 1s = 1min

const GainersPage = () => {
  const {exchangeOptions, setClickedStock} = useAppContext();
  const [selectedExchange, setSelectedExchange] = useState(exchangeOptions[0]);
  const [stocks, setStocks] = useState([]);

  console.log('GainersPage render')

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, []);

  // init
  useEffect(() => {
    getTopStocks(selectedExchange.id).then(result => setStocks([...result]));
  }, [selectedExchange]);

  // setup regular updates
  useEffect(() => {
    console.log('useEffect(): interval');
    const interval = setInterval(() => {
      console.log('[regular update]');
      getTopStocks(selectedExchange.id).then(result => setStocks([...result]));
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedExchange]);

  return (
    <div>
      <h1 className='text-center text-4xl text-white'>Top stock-gainers</h1>
      <p className='mt-1 text-center font-light text-base text-cyan'>
        The list of ten stocks that raised the most in price up the last day
      </p>

      <Dropdown
        className='relative z-10 mt-14 mx-16'
        isAbsolute
        offSearchBar
        options={exchangeOptions}
        selected={selectedExchange} showSelected
        onSelect={option => setSelectedExchange(option)}
      />

      <div className='mt-12 mx-16 py-4 px-4 bg-nav-bg rounded-lg'>
        <Columns/>
        <StockList
          className='mt-4'
          stocks={stocks}
          onItemClick={id => setClickedStock(id)}
        />
      </div>

    </div>
  );
};

export default GainersPage;