/* eslint-disable react/require-default-props */
import React, { FC } from 'react';
import './index.less';

export type BtnType = { label: React.ReactNode; key: React.Key; onClick?: () => void };

export type TipsBarProps = {
  title: React.ReactNode;
  leftBtns?: BtnType[];
  rightBtns?: BtnType[];
  className?: string;
  style?: React.CSSProperties;
  hidden?: boolean;
};

const TipsBar: FC<TipsBarProps> = ({
  title,
  leftBtns = [],
  rightBtns = [],
  className = '',
  style = undefined,
  hidden = false,
}) => {
  return (
    <div className={`tips-bar-comp ${className}`} hidden={hidden} style={style}>
      <span className='tips-bar-title'>{title}</span>
      <div className='tips-bar-addition'>
        {leftBtns.map((btn) => (
          <span className='tips-bar-btn' key={btn.key} onClick={btn.onClick} aria-hidden>
            {btn.label}
          </span>
        ))}
      </div>
      <div className='tips-bar-gap' />
      <div className='tips-bar-addition'>
        {rightBtns.map((btn) => (
          <span className='tips-bar-btn' key={btn.key} onClick={btn.onClick} aria-hidden>
            {btn.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TipsBar;
