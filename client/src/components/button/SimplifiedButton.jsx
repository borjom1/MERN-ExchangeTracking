import React from 'react';
import Button from "./Button";
import classNames from "classnames";

const SimplifiedButton = ({
                            className, title, icon, onClick,
                            color = '#343434',
                            onHoverColor = '#1575b2',
                            textColor='#C8C8C8'
                          }) => {

  const rootDivClasses = classNames(
    'h-12 px-6',
    className
  );

  return (
    <Button
      className={rootDivClasses}
      onClick={onClick}
      justify='center' scale='0'
      icon={icon}
      color={color}
      onHoverColor={onHoverColor}
      textColor={textColor}
      textSize='16px'>
      {title}
    </Button>
  );
};

export default SimplifiedButton;