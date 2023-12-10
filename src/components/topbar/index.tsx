import { Header } from 'antd/lib/layout/layout';
import { Link } from 'react-router-dom';
import Logomark from '@/assets/img/logomark.svg';

import './index.less';
import { useState } from 'react';

/** 网站顶部导航菜单栏 */

const menu = ['Home', 'Token', 'Nodes', 'About', 'Blog', 'Career'];
const TopBar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const onMenuChange = () => {
    setShowMenu(!showMenu);
  };
  return (
    <Header className='topbar-header'>
      <Link to='/' className='topbar-left'>
        <div className='logo' />
        <img src={Logomark} alt='Logomark' className='Logomark' />
      </Link>
      {/* <div className={`topbar-menu ${showMenu ? 'show' : ''}`} onClick={onMenuChange} />
      <div className={`topbar-right ${showMenu ? 'show' : ''}`}>
        {menu.map((d) => {
          return (
            <Link to='/' className={`item ${d === menu[0] ? 'activity' : ''}`} key={d}>
              {d}
            </Link>
          );
        })}
      </div> */}
    </Header>
  );
};

export default TopBar;
