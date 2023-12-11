/* eslint-disable no-template-curly-in-string */
import { useEffect, useState } from 'react';
import { useInterval } from 'ahooks';
import { useHistory } from 'react-router-dom';

import Header from '../home/header';

import './index.less';

export default () => {
  const navigate = useHistory();

  const [count, setCount] = useState(5);

  useInterval(() => {
    setCount((v) => (v > 0 ? v - 1 : 0));
  }, 1000);

  useEffect(() => {
    if (count === 0) {
      navigate.push(`/`); // hooks
    }
  }, [count, navigate]);

  const onGoHome = () => {
    navigate.push(`/`); // hooks
  };
  const RederContent = () => {
    return (
      <div className='order-contet-info'>
        <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120' fill='none'>
          <path
            d='M60 7.5C73.9239 7.5 87.2774 13.0312 97.1231 22.8769C106.969 32.7226 112.5 46.0761 112.5 60C112.5 73.9239 106.969 87.2774 97.1231 97.1231C87.2774 106.969 73.9239 112.5 60 112.5C46.0761 112.5 32.7226 106.969 22.8769 97.1231C13.0312 87.2774 7.5 73.9239 7.5 60C7.5 46.0761 13.0312 32.7226 22.8769 22.8769C32.7226 13.0312 46.0761 7.5 60 7.5ZM53.46 70.3575L41.7975 58.6875C41.3794 58.2694 40.8831 57.9378 40.3368 57.7115C39.7905 57.4852 39.205 57.3687 38.6138 57.3687C38.0225 57.3687 37.437 57.4852 36.8907 57.7115C36.3444 57.9378 35.8481 58.2694 35.43 58.6875C34.5856 59.5319 34.1112 60.6771 34.1112 61.8713C34.1112 63.0654 34.5856 64.2106 35.43 65.055L50.28 79.905C50.6969 80.3252 51.1929 80.6587 51.7393 80.8863C52.2857 81.1139 52.8718 81.231 53.4637 81.231C54.0557 81.231 54.6418 81.1139 55.1882 80.8863C55.7346 80.6587 56.2306 80.3252 56.6475 79.905L87.3975 49.1475C87.8212 48.7311 88.1582 48.235 88.3892 47.6877C88.6202 47.1405 88.7405 46.5529 88.7433 45.9588C88.7461 45.3648 88.6312 44.7761 88.4053 44.2267C88.1794 43.6773 87.847 43.1781 87.4272 42.7578C87.0074 42.3375 86.5086 42.0045 85.9594 41.778C85.4103 41.5515 84.8218 41.4359 84.2277 41.4379C83.6337 41.44 83.046 41.5597 82.4984 41.79C81.9509 42.0203 81.4544 42.3568 81.0375 42.78L53.46 70.3575Z'
            fill='#008EFF'
          />
        </svg>
        <div>
          Thank you for your purchase! Check your email for <br />
          photos and receipts.
        </div>
        <div onClick={onGoHome}>Back to Homepage (00:0{count}) </div>
      </div>
    );
  };
  return (
    <div className='order'>
      <Header />
      <div className='order-contet'>
        <RederContent />
      </div>
    </div>
  );
};
