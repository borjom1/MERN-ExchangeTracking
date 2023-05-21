import React, {useEffect, useState} from 'react';
import Dropdown from "../components/Dropdown";
import CurrencyList from "../components/currency/CurrencyList";
import Button from "../components/button/Button";
import Switch from 'react-switch';
import Columns from "../components/currency/Columns";
import {HiDatabase} from "react-icons/hi";
import {MdOutlineSsidChart} from "react-icons/md";
import {MdModeEdit} from "react-icons/md";
import {getRecentPairsInfo, getAllCurrencies, getRecentPairInfo} from "../api/currencyApi";
import useAppContext from "../hooks/useAppContext";

const UPDATE_INTERVAL = +process.env.REACT_APP_UPDATE_INTERVAL_MS;

const CurrenciesPage = () => {
  const {selectedCurrency, setSelectedCurrency} = useAppContext();
  const {addedCurrenciesSymbols, setAddedCurrenciesSymbols} = useAppContext();
  const {setClickedCurrency, setOptions: saveOptions} = useAppContext();

  const [options, setOptions] = useState([{id: '???', title: 'loading...', icon: null}]);
  const [isInversed, setIsInversed] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [isEditBtnEnabled, setEditBtnEnabled] = useState(false);

  console.count('render')

  useEffect(() => {
    console.log('useEffect(): init');

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    getAllCurrencies().then(retrievedOptions => {
      setOptions(retrievedOptions);
      saveOptions(retrievedOptions);
      // get first option from context or set by default
      setSelectedCurrency(selectedCurrency ? selectedCurrency : retrievedOptions[0]);
    });
  }, []);

  useEffect(() => {
    console.log('useEffect(): selectedCurrency');
    if (selectedCurrency) {
      getRecentPairsInfo(selectedCurrency.id, addedCurrenciesSymbols, isInversed)
        .then(recentInfo => setCurrencies(recentInfo));
    }
  }, [selectedCurrency]);

  // setup interval for updating currency list every minute
  // selectedCurrency is present in deps because we need to restart interval after changing currency
  useEffect(() => {
    console.log('useEffect(): interval');

    const interval = setInterval(async () => {
      const result = await getRecentPairsInfo(selectedCurrency.id, addedCurrenciesSymbols, isInversed);
      setCurrencies(result);
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedCurrency, addedCurrenciesSymbols, isInversed]);

  console.log('selectedCurrency: ' + selectedCurrency?.id)
  console.log('isInversed: '+ isInversed)
  console.log('added curs: ' + addedCurrenciesSymbols)

  const handleEditList = id => {
    console.log('DELETE ' + id)
    setAddedCurrenciesSymbols(addedCurrenciesSymbols.filter(e => e !== id));
    setCurrencies(currencies.filter(currency => currency.id !== id));
  };

  const handleAddToList = option => {
    console.log('ADD ' + option.id)
    setAddedCurrenciesSymbols([...addedCurrenciesSymbols, option.id])
    getRecentPairInfo(selectedCurrency.id, option.id, isInversed)
      .then(info => setCurrencies([...currencies, info]));
  };

  const handleSwitch = () => {
    getRecentPairsInfo(selectedCurrency.id, addedCurrenciesSymbols, !isInversed)
      .then(recentInfo => setCurrencies(recentInfo));
    setIsInversed(!isInversed);
  };

  const handleCurrencyClick = id => {
    console.log(id);
    setClickedCurrency(options.find(opt => opt.id === id));
  };

  const bgStyle = 'bg-dark-28 rounded-lg';

  return (
    <div className='pt-16'>
      <h1 className='text-center text-4xl text-white'>Live currency exchanges</h1>
      <p className='mt-1 text-center font-light text-base text-cyan'>
        Check live foreign currency rates using our service
      </p>

      <div className='flex justify-between items-center mt-24'>
        <Dropdown
          className='relative z-10'
          isAbsolute
          options={options}
          selected={selectedCurrency} showSelected
          delOptions={addedCurrenciesSymbols}
          onSelect={option => setSelectedCurrency(option)}
          searchPlaceholder='type in currency name'
        />

        <div className={bgStyle + ' w-80 px-5 py-2 flex options-center justify-between gap-10 items-center drop-shadow-lg'}>
          <div className='flex items-center'>
            <Switch
              className='mr-4'
              checked={isInversed}
              onChange={handleSwitch}
              checkedIcon={false}
              uncheckedIcon={false}
              height={18} width={50}
              onColor='#47E8E8'
            />
            <p className='text-gray-c8 text-xl'>Inverse</p>
          </div>
          <Button
            icon={<MdModeEdit color='#FFFFFF' size='26'/>}
            color='#1C1C1C'
            onHoverColor='#1f1f1f'
            onHoverClickedColor='#1f8cd3'
            isActivated={isEditBtnEnabled}
            clickedColor='#1575b2'
            onClick={() => setEditBtnEnabled(!isEditBtnEnabled)}
          />
        </div>
      </div>

      <Columns className='mt-8'
               column1Text='Currency' icon1Column={<HiDatabase color='#6E6E6E' size='24'/>}
               column2Text='Price' icon2Column={<HiDatabase color='#6E6E6E' size='24'/>}
               column3Text='Change (24h)' icon3Column={<MdOutlineSsidChart color='#6E6E6E' size='24'/>}
      />

      <div className={bgStyle + ' mt-4 px-10 py-4'}>
        <CurrencyList
          currencies={currencies}
          isEditable={isEditBtnEnabled}
          onEditClick={handleEditList}
          onItemClick={handleCurrencyClick}
        />
        <div className='mt-3 border-2 border-gray-40 rounded-lg'>
          <Dropdown
            className='w-full bg-dark-34'
            title='Add currency ...'
            isFixedHeight
            options={options}
            selected={selectedCurrency}
            delOptions={addedCurrenciesSymbols}
            onSelect={handleAddToList}
            searchPlaceholder='type in currency name'
          />
        </div>
      </div>

    </div>
  );
};

export default CurrenciesPage;