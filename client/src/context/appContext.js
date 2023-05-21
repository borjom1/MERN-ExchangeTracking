import React, {useState} from 'react';
import {createContext} from "react";
import StockIcons from "../assets/icons/stocks/stock_icons";

const AppContext = createContext({});

const {NASDAQ, NYSE} = StockIcons();

const AppProvider = ({children}) => {
  const [options, setOptions] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [clickedCurrency, setClickedCurrency] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [clickedStock, setClickedStock] = useState(null);
  const [addedCurrenciesSymbols, setAddedCurrenciesSymbols] = useState(['MXN', 'UAH', 'CNY', 'PLN']);
  const [addedStockSymbols, setAddedStockSymbols] = useState(['META', 'PYPL', 'U', 'TTWO', 'JNJ', 'CSCO']);

  const periods = [{id: '12h', title: '12h'}, {id: '1d', title: '1d'}];

  const exchangeOptions = [
    {id: 'nasdaq', icon: NASDAQ, title: 'Nasdaq'},
    {id: 'nyse', icon: NYSE, title: 'NYSE'}
  ];

  const shared = {
    periods,
    exchangeOptions,
    selectedCurrency, setSelectedCurrency,
    clickedCurrency, setClickedCurrency,
    addedCurrenciesSymbols, setAddedCurrenciesSymbols,
    addedStockSymbols, setAddedStockSymbols,
    selectedExchange, setSelectedExchange,
    clickedStock, setClickedStock,
    options, setOptions
  };

  return (
    <AppContext.Provider value={shared}>
      {children}
    </AppContext.Provider>
  );
};

export {AppProvider};

export default AppContext;