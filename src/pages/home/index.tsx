import { useHistory } from 'react-router-dom';
import './index.less';
import Header from './header';

export default () => {
  const navigate = useHistory();

  const navTo = () => {
    navigate.push(`/start`); // hooks
  };
  return (
    <div className='home'>
      <Header />
      <div className='home-contet'>
        <div className='home-contet-bg' />
        <div className='home-contet-des'>
          <div>Get your US Passport Photo!</div>
          <div>
            Enjoy the ease of capturing the perfect passport photo from the comfort of your home. Just one click away.
          </div>
          <div className='btn' onClick={navTo}>
            Get Started!
          </div>
        </div>
        <div className='home-contet-path'>
          <div className='bg' />
        </div>
      </div>
      <footer>© Copyright {new Date().getFullYear()}, All Rights Reserved</footer>
    </div>
  );
};
