import { useHistory } from 'react-router-dom';
import IC_OGO from '@/assets/img/logo.svg';
import './index.less';

export default () => {
  const navigate = useHistory();
  const goHome = () => {
    navigate.push(`/`); // hooks
  };
  return (
    <div className='home-top'>
      <img src={IC_OGO} alt='logo' onClick={goHome} />
    </div>
  );
};
