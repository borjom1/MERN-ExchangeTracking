import React, {useState} from 'react';
import InputField from "./InputField";
import {MdOutlineCancel, MdOutlineEmail} from "react-icons/md";
import StepSection from "./StepSection";
import CheckBox from "./CheckBox";
import SimplifiedButton from "../button/SimplifiedButton";
import {subscribeOnCurrency, unsubscribeFromCurrency} from "../../api/currencyApi";
import {subscribeOnStock, unsubscribeFromStock} from "../../api/stockApi";

const gmailRegex = '^[a-z0-9]+(?!.*(?:\\+{2,}|\\-{2,}|\\.{2,}))(?:[\\.+\\-]{0,1}[a-z0-9])*@gmail\\.com$';

const ModalForm = ({setActive, isStockTracking, isCancellation, element}) => {
  const [gmail, setGmail] = useState('');
  const [isDailyChecked, setDailyChecked] = useState(false);

  const [isWeeklyChecked, setWeeklyChecked] = useState(false);

  const processEnteredData = (performStockAction, performCurrencyAction) => {
    if (!gmail.length || !gmail.match(gmailRegex)) {
      alert('Not valid gmail address');
      return;
    }
    const intervals = [];
    if (isDailyChecked) intervals.push('DAILY');
    if (isWeeklyChecked) intervals.push('WEEKLY');

    if (!intervals.length) {
      alert('You did not select any interval');
      return;
    }

    if (isStockTracking && element) {
      performStockAction(gmail, element.symbol, intervals);
    } else {
      const {base, native} = element;
      performCurrencyAction(gmail, `${base.symbol}/${native.symbol}`, intervals);
    }
  };

  const track = () => processEnteredData(subscribeOnStock, subscribeOnCurrency);

  const cancel = () => processEnteredData(unsubscribeFromStock, unsubscribeFromCurrency);

  const exchangeValue = (title, icon) => {
    return (
      <div className='bg-nav-bg-hover py-2 px-8 rounded-lg flex gap-3 items-center'>
        <img className={`w-8 ${isStockTracking ? 'rounded-full' : ''}`} src={icon} alt='icon'/>
        <p className='text-lg text-gray-b8'>{title}</p>
      </div>
    );
  };

  let selectedExchange;
  if (isStockTracking && element) {
    selectedExchange = (
      <div className='flex gap-4 mt-2'>
        {exchangeValue(element.name, element.icon)}
      </div>
    );
  } else if (element?.base && element?.native) { // if currency pair present
    const {base, native} = element;
    selectedExchange = (
      <div className='flex gap-4 mt-2'>
        {exchangeValue(base.name, base.icon)}
        {exchangeValue(native.name, native.icon)}
      </div>
    );
  }

  let title;
  let handleGoClick = track;
  let goButton = {color: '#1575b2', onHover: '#205a8a'};

  if (isCancellation) {
    title = 'Tracking cancellation'
    handleGoClick = cancel;
    goButton.color = '#DF4A65';
    goButton.onHover = '#a21a40';
  } else {
    title = isStockTracking ? 'Tracking stock' : 'Tracking currency pair';
  }
  const bgColor = {backgroundColor: 'rgba(0, 0, 0, 0.6)'};

  const stepDescStyle = 'text-lg text-gray-6e';

  const circle = number => (
    <div className='bg-gray-40 w-[40px] h-[40px] rounded-full drop-shadow-lg'>
      <p className='text-center mt-1.5 text-lg text-gray-b8'>{number}</p>
    </div>
  );

  return (
    <div
      className='w-full h-full fixed top-0 left-0 z-30 flex justify-center items-center sc'
      style={bgColor}
      onClick={() => setActive(false)}>
      <div
        className='w-[60%] h-[90%] rounded-xl bg-dark-28 py-8 px-10'
        onClick={e => e.stopPropagation()}>
        <p className='text-3xl font-semibold text-almost-white'>{title}</p>

        <div className='mt-8'>
          <StepSection>
            {circle(1)}
            <div className='h-full'>
              <p className={stepDescStyle + ' mt-1.5'}>Enter your gmail address</p>
              <InputField
                className='mt-3'
                setGmail={setGmail}
                icon={<MdOutlineEmail size={35} color='#6E6E6E' className='mr-1'/>}
              />
            </div>
          </StepSection>

          <StepSection className='mt-8'>
            {circle(2)}
            <div className='h-full mt-1.5'>
              <p className={stepDescStyle}>{`Check selected ${isStockTracking ? 'stock' : 'currency pair'}`}</p>
              {selectedExchange}
            </div>
          </StepSection>

          <StepSection className='mt-8'>
            {circle(3)}
            <div className='h-full mt-1.5'>
              <p className={stepDescStyle}>Select notification interval</p>
              <CheckBox
                className='mt-2'
                color={isCancellation ? '#DF4A65' : '#1575b2'}
                checked={isDailyChecked}
                label='Every day'
                handleChange={() => setDailyChecked(!isDailyChecked)}
              />
              <CheckBox
                className='mt-1'
                color={isCancellation ? '#DF4A65' : '#1575b2'}
                checked={isWeeklyChecked}
                label='Every week'
                handleChange={() => setWeeklyChecked(!isWeeklyChecked)}
              />
            </div>
          </StepSection>

          <StepSection className='mt-8 items-center'>
            {circle(4)}
            <SimplifiedButton
              className='h-9 w-32'
              title='Go'
              color={goButton.color}
              textColor='#ffffff'
              onHoverColor={goButton.onHover}
              onClick={handleGoClick}
            />
            <SimplifiedButton
              className='h-9 w-32'
              icon={<MdOutlineCancel color='#C8C8C8' size='22'/>}
              onHoverColor='#3a3a3a'
              onClick={() => {
                setActive(false)
              }}
            />
          </StepSection>

        </div>
      </div>
    </div>
  );
};

export default ModalForm;