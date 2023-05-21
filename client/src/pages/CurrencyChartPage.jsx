import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import useAppContext from "../hooks/useAppContext";
import {getAllCurrencies, getTimeSeries} from "../api/currencyApi";
import Dropdown from "../components/Dropdown";
import Button from "../components/button/Button";
import {TbArrowsExchange2} from 'react-icons/tb';
import {MdOutlineAttachEmail} from 'react-icons/md';
import {ImCancelCircle} from 'react-icons/im';
import Time from "../components/chart/Time";
import StatBox from "../components/chart/StatBox";
import CustomChart from "../components/CustomChart";
import SimplifiedButton from "../components/button/SimplifiedButton";
import ModalForm from "../components/modal/ModalForm";

const CurrencyChartPage = () => {
  const {selectedCurrency, clickedCurrency, periods} = useAppContext();
  const navigate = useNavigate();

  const [baseCurrency, setBaseCurrency] = useState(selectedCurrency);
  const [nativeCurrency, setNativeCurrency] = useState(clickedCurrency);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);

  const [options, setOptions] = useState([]);
  const [intervalInfo, setIntervalInfo] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);

  const [isModalActive, setModalActive] = useState(false);
  const [isCancellation, setCancellation] = useState(false);

  // initial pulling data from api
  useEffect(() => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    if (!baseCurrency || !nativeCurrency) { // if currencies is lost after reloading
      navigate('/currencies', {replace: true});
    }

    getAllCurrencies().then(retrievedOptions => {
      setOptions(retrievedOptions);
      setBaseCurrency(selectedCurrency ? selectedCurrency : retrievedOptions[0]);
      setNativeCurrency(clickedCurrency ? clickedCurrency : retrievedOptions[1]);
    });
  }, []);

  // each time we modify pair or period this function is called (update data)
  useEffect(() => {
    if (baseCurrency && nativeCurrency) {
      update(baseCurrency.id, nativeCurrency.id, selectedPeriod.id);
    }
  }, [selectedPeriod, baseCurrency, nativeCurrency]);

  const update = (base, native, period) => {
    getTimeSeries(base, native, period)
      .then(body => {

        const {change, from, to, open, low, high, timeSeries} = body;
        const currentRate = timeSeries[timeSeries.length - 1].rate;
        setIntervalInfo({change, from, to, open, low, high, currentRate});

        const ts = timeSeries.map(({timestamp, rate}) => {
          return {timestamp: timestamp.substring(11, 16), rate};
        });

        setTimeSeries(ts);
      });
  };

  const handleReverseClick = () => {
    setBaseCurrency(nativeCurrency);
    setNativeCurrency(baseCurrency);
  };

  const change = intervalInfo?.change;
  const growthValue = (change && change >= 0 ? `+${change}` : `${change}`) + '%';
  const growthColor = change && change >= 0 ? 'text-green' : 'text-red';

  const dropdownSectionStyle = 'flex flex-col gap-1';

  let pair;
  if (baseCurrency && nativeCurrency) {
    pair = {
      base: {name: baseCurrency.title, symbol: baseCurrency.id, icon: baseCurrency.icon},
      native: {name: nativeCurrency.title, symbol: nativeCurrency.id, icon: nativeCurrency.icon}
    };
  }

  return (
    <div>
      {isModalActive &&
        <ModalForm
          setActive={setModalActive}
          element={pair}
          isCancellation={isCancellation}
        />
      }
      <div className='pt-12'>
        <h1 className='text-center text-4xl text-white'>Live currency exchanges chart</h1>
        <p className='mt-2 text-center font-light text-base text-cyan'>
          Service spans history of all currency pairs giving exact timestamps<br/>
          for creating individual chart with specific time interval
        </p>

        <div className='mt-24 flex justify-end gap-4'>
          <SimplifiedButton
            className='w-1/5' title='Cancel tracking'
            onHoverColor='#a21a40'
            icon={<ImCancelCircle color='#C8C8C8' size='22'/>}
            onClick={() => {setCancellation(true); setModalActive(true);}}
          />
          <SimplifiedButton
            className='w-1/5' title='Track currency pair'
            icon={<MdOutlineAttachEmail color='#C8C8C8' size='22'/>}
            onClick={() => {setCancellation(false); setModalActive(true);}}
          />
        </div>

        <div className='bg-dark-28 rounded-lg mt-8 py-6 px-16 flex justify-between items-end'>
          <div className={dropdownSectionStyle}>
            <p className='text-gray-6e'>From</p>
            <Dropdown
              bg='bg-dark-34 w-96'
              className='relative z-20'
              isAbsolute
              options={options}
              selected={baseCurrency} showSelected
              delOptions={[nativeCurrency?.id]}
              onSelect={option => setBaseCurrency(option)}
              searchPlaceholder='type in currency name'
            />
          </div>

          <Button
            className='w-14 h-14 drop-shadow-lg'
            rounded='rounded-full'
            icon={<TbArrowsExchange2 color='#FFFFFF' size='26' className='mx-auto'/>}
            color='#343434'
            onHoverColor='#1575b2'
            onClick={handleReverseClick}
          />

          <div className={dropdownSectionStyle}>
            <p className='text-gray-6e'>To</p>
            <Dropdown
              bg='bg-dark-34 w-96'
              className='relative z-10'
              isAbsolute
              options={options}
              selected={nativeCurrency} showSelected
              delOptions={[baseCurrency?.id]}
              onSelect={option => setNativeCurrency(option)}
              searchPlaceholder='type in currency name'
            />
          </div>
        </div>

        <div className='mt-6 border-4 border-dark-28 rounded-lg px-16 py-8'>
          <p className='font-semibold text-2xl text-gray-c8'>{baseCurrency?.id} to {nativeCurrency?.id} Chart</p>
          <div className='h-20 mt-4 flex justify-between'>
            <div className='flex'>
              <Dropdown
                offSearchBar
                small
                className='relative z-10 w-28 h-9'
                isAbsolute
                options={periods}
                selected={selectedPeriod} showSelected
                onSelect={option => setSelectedPeriod(option)}
              />

              <div className='ml-4'>
                <Time time={intervalInfo?.from && new Date(intervalInfo.from).toUTCString()} start/>
                <Time time={intervalInfo?.to && new Date(intervalInfo.to).toUTCString()} className='mt-2'/>
              </div>
            </div>

            <div className='flex'>
              <StatBox
                className='h-full ml-4'
                title={`Growth (${selectedPeriod.title})`}
                value={growthValue}
                valueColor={growthColor}
                valueSize='text-2xl'
              />
              <StatBox
                className='h-full ml-4'
                title={`Current ${baseCurrency?.id}/${nativeCurrency?.id} rate`}
                value={intervalInfo?.currentRate}
                valueColor='text-cyan'
                valueSize='text-xl'
              />
            </div>
          </div>

          <div className='flex justify-between my-4'>
            <CustomChart
              className='w-[1000px] h-[500px] mt-12'
              baseCurrency={baseCurrency}
              nativeCurrency={nativeCurrency}
              timeSeries={timeSeries}
              color='#F4BE37'
              pointBorderWidth={5}
              borderWidth={4}
            />
            <div className='flex-col justify-center pt-14'>
              <StatBox
                className='ml-4'
                title='Open'
                outline
                value={intervalInfo?.open.toFixed(4)}
                valueColor='text-white'
                valueSize='text-xl'
              />
              <StatBox
                className='ml-4 mt-4'
                title='Low'
                outline
                value={intervalInfo?.low.toFixed(4)}
                valueColor='text-red'
                valueSize='text-xl'
              />
              <StatBox
                className='ml-4 mt-4'
                title='High'
                outline
                value={intervalInfo?.high.toFixed(4)}
                valueColor='text-green'
                valueSize='text-xl'
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CurrencyChartPage;