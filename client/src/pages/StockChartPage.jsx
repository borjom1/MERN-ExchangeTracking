import React, {useEffect, useState} from 'react';
import useAppContext from "../hooks/useAppContext";
import StockIcons from "../assets/icons/stocks/stock_icons";
import StatBox from "../components/chart/StatBox";
import Dropdown from "../components/Dropdown";
import CustomChart from "../components/CustomChart";
import {MdOutlineAttachEmail} from "react-icons/md";
import {ImCancelCircle} from "react-icons/im";
import SimplifiedButton from "../components/button/SimplifiedButton";
import Time from "../components/chart/Time";
import {getStockTimeSeries} from "../api/stockApi";
import ModalForm from "../components/modal/ModalForm";
import {useNavigate} from "react-router-dom";

const icons = StockIcons();

const StockChartPage = () => {
  const {clickedStock, exchangeOptions, periods, selectedExchange: savedExchange} = useAppContext();
  const navigate = useNavigate();

  const [selectedExchange, setSelectedExchange] = useState(savedExchange || exchangeOptions[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  const [stockInfo, setStockInfo] = useState({});
  const [rateTS, setRateTS] = useState([]);
  const [volumeTS, setVolumeTS] = useState([]);

  const [isModalActive, setModalActive] = useState(false);
  const [isCancellation, setCancellation] = useState(false);

  useEffect(() => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    if (!clickedStock) { // if stock is lost after reloading
      navigate('/stocks', {replace: true});
    }
  }, []);

  // regular update call
  useEffect(() => {
    console.log('useEffect: regular');
    getStockTimeSeries(selectedExchange.id, clickedStock || 'META', selectedPeriod.id)
      .then(onRetrievedBody);
  }, [selectedExchange, selectedPeriod]);

  const onRetrievedBody = body => {
    const {fullName, symbol} = body.meta;
    const {open, low, high, current, from, to, change, timeSeries} = body;
    setStockInfo({
      fullName, symbol, open, low, high,
      current, from, to, change, icon: icons[symbol]
    });

    // cut time from ts
    const mappedTS = timeSeries.map(({timestamp, ...rest}) => {
      return {timestamp: timestamp.substring(11, 16), ...rest}
    });

    // update volumes
    const volumes = mappedTS.map(({timestamp, volume}) => {
      return {timestamp, rate: volume};
    });
    setVolumeTS(volumes);

    // update rates
    const rates = mappedTS.map(({timestamp, rate}) => {
      return {timestamp, rate};
    });
    setRateTS(rates);
  };

  let growthColor = 'text-green';
  let change = stockInfo?.change;
  const isGrowing = change && change >= 0;
  if (change) {
    if (change >= 0) {
      growthColor = 'text-green';
      change = '+' + change;
    } else {
      growthColor = 'text-red';
    }
    change += '%';
  }

  const volumeChartGradient = [
    'rgba(133,53,129,0.56)',
    'rgba(155,30,151,0.25)',
    'rgba(155,30,151,0.09)'
  ];

  const rateGreenChartGradient = [
    'rgba(31,228,180,0.37)',
    'rgba(31,228,180,0.13)',
    'rgba(255,255,255,0)'
  ];

  const rateRedChartGradient = [
    'rgba(223,74,101,0.22)',
    'rgba(223,74,101,0.09)',
    'rgba(223,74,101,0.02)'
  ];

  return (
    <div>
      {isModalActive &&
        <ModalForm
          setActive={setModalActive}
          isStockTracking
          element={stockInfo.fullName && {
            name: stockInfo.fullName,
            symbol: stockInfo.symbol,
            icon: stockInfo.icon
          }}
          isCancellation={isCancellation}
        />
      }
      <div className='px-20'>
        <div className='flex justify-between gap-4'>
          <div className='w-[35%]'>
            <div className='w-full bg-dark-28 rounded-lg py-4 px-6'>
              <div className='flex gap-4 items-center bg-gray-40 rounded-xl py-3 px-6'>
                <img className='w-14 rounded-full' src={stockInfo.icon || icons.META} alt='icon'/>
                <p className='text-lg text-white'>{stockInfo.fullName || 'Meta Platforms, Inc.'}</p>
              </div>
              <div className='mt-6'>
                <div className='flex gap-6 h-20'>
                  <StatBox
                    className='h-full w-full'
                    title={`Current stock rate`}
                    value={stockInfo?.current + ' $'}
                    bgColor='dark-34'
                    valueColor='text-cyan' valueSize='text-xl'
                  />
                  <StatBox
                    className='h-full w-full'
                    title={`Growth (${selectedPeriod.title})`}
                    value={change}
                    bgColor='dark-34'
                    valueColor={growthColor} valueSize='text-2xl'
                  />
                </div>
              </div>
            </div>

            <Time
              className='mt-4 w-full'
              time={stockInfo?.from && new Date(stockInfo.from).toUTCString()}
              start outline
              setColor='#C8C8C8'
            />
            <Time
              className='mt-2 w-full'
              time={stockInfo?.to && new Date(stockInfo.to).toUTCString()}
              outline
              setColor='#47E8E8'
            />

            <div className='mt-8 flex gap-6'>
              <Dropdown
                className='relative z-10'
                isAbsolute
                offSearchBar
                options={exchangeOptions}
                selected={selectedExchange} showSelected
                onSelect={option => setSelectedExchange(option)}
              />
              <Dropdown
                className='relative z-10 py-2'
                isAbsolute
                offSearchBar
                options={periods}
                selected={selectedPeriod} showSelected
                onSelect={option => setSelectedPeriod(option)}
              />
            </div>
          </div>
          <div className='border-4 rounded-lg border-dark-28 p-2 w-[70%]'>
            <CustomChart
              className=' w-full'
              timeSeries={volumeTS}
              stockSymbol={stockInfo.symbol}
              color='#AD49A7FF'
              gColors={volumeChartGradient}
              pointBorderWidth={2}
              borderWidth={2}
              tension={0.2}
            />
          </div>
        </div>

        <div className='mt-12 flex gap-6'>
          <div className='w-[17%]'>
            <StatBox
              title='Open' outline
              value={stockInfo?.open + ' $'} valueColor='text-white' valueSize='text-xl'
            />
            <StatBox
              className='mt-4' title='Low' outline
              value={stockInfo?.low + ' $'} valueColor='text-red' valueSize='text-xl'
            />
            <StatBox
              className='mt-4' title='High' outline
              value={stockInfo?.high + ' $'} valueColor='text-green' valueSize='text-xl'
            />
            <SimplifiedButton
              className='mt-4' title='Track stock rates'
              icon={<MdOutlineAttachEmail color='#C8C8C8' size='22'/>}
              onClick={() => { setCancellation(false); setModalActive(true)}}
            />

            <SimplifiedButton
              className='mt-4' title='Cancel tracking'
              onHoverColor='#a21a40'
              icon={<ImCancelCircle color='#C8C8C8' size='22'/>}
              onClick={() => {setCancellation(true); setModalActive(true)}}
            />
          </div>
          <div className='w-[83%] border-4 rounded-lg border-dark-28 p-2'>
            <CustomChart
              timeSeries={rateTS}
              stockSymbol={stockInfo.symbol}
              color={isGrowing ? '#1FE4B4' : '#DF4A65'}
              gColors={isGrowing ? rateGreenChartGradient : rateRedChartGradient}
              pointBorderWidth={2}
              borderWidth={2}
              tension={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockChartPage;