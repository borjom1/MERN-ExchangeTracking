import React from 'react';
import classNames from "classnames";

const StepSection = ({className, children}) => {

  const rootDivClasses = classNames(
    'h-min flex gap-8 items-start py-3 px-4',
    'rounded-lg',
    className
  );

  return (
    <div style={{borderColor: '#343434', borderWidth: 2}} className={rootDivClasses}>
      {children}
    </div>
  );
};

export default StepSection;