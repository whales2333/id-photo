import { useHistory } from 'react-router-dom';
import IC_OGO from '@/assets/img/logo.svg';
import './index.less';
import Header from './header';

export default () => {
  const navigate = useHistory();

  const navTo = () => {
    navigate.push(`/operation`); // hooks
  };
  return (
    <div className='home'>
      <Header />
      <div className='home-contet'>
        <div className='home-contet-bg' />
        <div className='home-contet-des'>
          <div>
            Get your US <br />
            Passport Photo!
          </div>
          <div>
            Enjoy the ease of capturing the perfect passport photo from the comfort of your home. Just one
            clickUpload Photo away.
          </div>
          <div className='btn' onClick={navTo}>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='25' viewBox='0 0 24 25' fill='none'>
              <g clip-path='url(#clip0_231_254)'>
                <path
                  d='M8.73221 18.7142H14.518C15.3135 18.7142 15.9644 18.0633 15.9644 17.2677V10.0355H18.2643C19.5516 10.0355 20.2025 8.47337 19.2912 7.56211L12.6521 0.922942C12.5182 0.788852 12.3593 0.68247 12.1843 0.609885C12.0093 0.5373 11.8218 0.499939 11.6323 0.499939C11.4429 0.499939 11.2553 0.5373 11.0803 0.609885C10.9053 0.68247 10.7464 0.788852 10.6126 0.922942L3.97342 7.56211C3.06216 8.47337 3.69859 10.0355 4.98592 10.0355H7.28577V17.2677C7.28577 18.0633 7.93666 18.7142 8.73221 18.7142ZM2.94644 21.6071H20.3037C21.0993 21.6071 21.7502 22.258 21.7502 23.0535C21.7502 23.849 21.0993 24.4999 20.3037 24.4999H2.94644C2.1509 24.4999 1.5 23.849 1.5 23.0535C1.5 22.258 2.1509 21.6071 2.94644 21.6071Z'
                  fill='white'
                />
              </g>
              <defs>
                <clipPath id='clip0_231_254'>
                  <rect width='24' height='24' fill='white' transform='translate(0 0.5)' />
                </clipPath>
              </defs>
            </svg>
            Upload Photo
          </div>
        </div>
        <div className='home-contet-path'>
          <div className='bg' />
          <div className='slite' />
        </div>
      </div>
      <footer>© Copyright 2023, All Rights Reserved</footer>
    </div>
  );
};
