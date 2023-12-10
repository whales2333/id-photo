import { CaretDownFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useStoreApi';
import { selectUserInfo, setUser } from '@/store/user';
import './index.less';

export default () => {
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const login = () => {
    // history.push('/login');
  };
  const logout = () => {};

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key='exit'>
            <div onClick={logout} aria-hidden='true'>
              退出登录
            </div>
          </Menu.Item>
        </Menu>
      }
      disabled={!userInfo}
      placement='bottomLeft'
    >
      <div className='userinfo-zone' onClick={userInfo ? undefined : login} aria-hidden>
        <Avatar
          shape='circle'
          size='default'
          icon={userInfo?.picture ? <img src={userInfo.picture} alt='avatar' /> : <UserOutlined />}
        />
        <span className='username'>{userInfo ? `${userInfo.nickname}` : '点此登录'}</span>
        {userInfo ? <CaretDownFilled style={{ color: 'white' }} /> : undefined}
      </div>
    </Dropdown>
  );
};
