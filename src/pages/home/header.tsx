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
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='34'
        height='18'
        viewBox='0 0 34 18'
        fill='none'
        style={{ marginRight: 12 }}
      >
        <rect x='17' y='1' width='16' height='16' rx='8' stroke='#635BFF' stroke-width='2' />
        <circle cx='25' cy='9' r='3' fill='#333333' />
        <rect x='2' y='2' width='14' height='14' rx='7' stroke='#635BFF' stroke-width='4' />
      </svg>
      <img src={IC_OGO} alt='logo' onClick={goHome} />
    </div>
  );
};
