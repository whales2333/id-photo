import { Breadcrumb } from 'antd';
import React from 'react';
import { RouteMenu } from '@/types';
import { useRoutesByLocation } from '@/hooks/useRouteMenu';
import { getMenuItem } from '../menulist';

/** 面包屑组件，与配置式路由菜单绑定 */
const Breadcrumbs: React.FC<{ menus: RouteMenu[] }> = ({ menus }) => {
  const parents = useRoutesByLocation(menus);

  return (
    <Breadcrumb style={{ padding: '8px 0' }}>
      {parents.map((v) => (
        <Breadcrumb.Item key={v.path}>{v.component ? getMenuItem(v) : <span>{v.name}</span>}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
