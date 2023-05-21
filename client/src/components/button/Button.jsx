import React, {useState} from 'react';
import classNames from "classnames";

const Button = ({
  children,
  className,
  justify, scale, rounded,
  icon, color, textColor, textSize, onHoverColor, onHoverClickedColor, clickedColor,
  onClick, isActivated
}) => {

  const [onHover, setOnHover] = useState(false);

  const handleHover = flag => setOnHover(flag);

  const styles = {
    backgroundColor: isActivated ? clickedColor : color,
    color: textColor,
    fontSize: textSize
  };

  onHover && (styles.backgroundColor = isActivated ? onHoverClickedColor : onHoverColor);

  const classnames = classNames(
    'flex',
    justify? `justify-${justify}` : 'justify-between',
    rounded ? rounded : 'rounded-lg',
    'items-center gap-1 p-2 cursor-pointer transform',
    'transition duration-300',
    scale ? `hover:scale-${scale}` : 'hover:scale-110',
    className
  );

  return (
    <div
      style={styles}
      className={classnames}
      onClick={onClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {icon}
      {children}
    </div>
  );
};

export default Button;