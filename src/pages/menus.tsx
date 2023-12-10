import { BehanceSquareOutlined, HeartOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { RouteMenu } from '../types';

// 配置式路由菜单
export default [
  {
    name: 'home',
    path: '/',
    hideInMenu: true,
    icon: <HeartOutlined />,
    redirect: '/base',
  },
  {
    name: 'base info',
    path: '/base',
    icon: <BehanceSquareOutlined />,
    component: () => <div className='li-content-block'>base info</div>,
  },
] as RouteMenu[];
