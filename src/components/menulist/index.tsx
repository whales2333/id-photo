/* eslint-disable react/require-default-props */
import { Menu, MenuTheme } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as icons from '@ant-design/icons';
import { RouteMenu } from '@/types';
import { useMenuVisibleRoutes, useRoutesByLocation, VisibleRouteMenu } from '@/hooks/useRouteMenu';
import './index.less';
import { hashCode } from '@/utils/common';

const { SubMenu } = Menu;

/** 根据menu生成单个菜单项jsx */
export const getMenuItem = (menu: RouteMenu) => {
  const isUrl = menu.path.startsWith('http://') || menu.path.startsWith('https://');
  let menuChild;
  // http url菜单
  if (isUrl) {
    if (menu.component === 'iframeView') {
      // iframe路由，跳转iframe组件打开
      const hash = hashCode(menu.path);
      menuChild = <Link to={`/iframeView/${hash}`}>{menu.name}</Link>;
    } else if (menu.component === 'externalUrl') {
      // a标签打开
      menuChild = (
        <a href={menu.path} target='_blank' rel='noreferrer'>
          {menu.name}
        </a>
      );
    } else {
      // a标签打开
      menuChild = <a href={menu.path}>{menu.name}</a>;
    }
  } else {
    // 组件路由菜单
    menuChild = <Link to={menu.path}>{menu.name}</Link>;
  }
  return menuChild;
};
/** 将menu.icon转换为组件 */
const transformStringIconToComp = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return <img src={path} alt='' style={{ width: '1em', height: '1em' }} className='anticon' />;
  }

  try {
    // @ts-ignore
    const IconComp = icons[path];
    if (IconComp) return <IconComp />;
    return <div>{path}</div>;
  } catch (e) {
    return <div>{path}</div>;
  }
};

/** 递归生成菜单列表jsx */
const getMenuItemList = (menus: VisibleRouteMenu[]) =>
  menus.map((menu) => {
    const iconComp = typeof menu.icon === 'string' ? transformStringIconToComp(menu.icon) : menu.icon;

    return menu.visibleChild?.length ? (
      <SubMenu key={menu.path} title={menu.name} icon={iconComp}>
        {getMenuItemList(menu.visibleChild)}
      </SubMenu>
    ) : (
      // route的path作为menu的key
      <Menu.Item key={menu.path} icon={iconComp}>
        {getMenuItem(menu)}
      </Menu.Item>
    );
  });

/** 遍历获取全部非叶子菜单的路径 */
const getAllNonLeafMenuPath = (menus: VisibleRouteMenu[], paths: string[]) => {
  menus.forEach((v) => {
    if (v.visibleChild?.length) {
      paths.push(v.path);
      getAllNonLeafMenuPath(v.visibleChild, paths);
    }
  });
};

export type Props = {
  menus: RouteMenu[];
  theme: MenuTheme;
  /** 导航菜单处于展开或收缩状态 */
  collapse: boolean;
  /** 是否默认打开全部菜单项（非控属性）。若为false，将自动根据location打开它的父级菜单项 */
  defaultOpenAll?: boolean;
};

/** 菜单列表组件，与配置式路由菜单绑定 */
const MenuList: React.FC<Props> = ({ menus, theme, collapse, defaultOpenAll = false }) => {
  // 当前location对应的route及其父级
  const parentRoutes = useRoutesByLocation(menus);
  // 仅渲染可见的菜单项
  const visibleRoutes = useMenuVisibleRoutes(menus);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // // 调试openKeys专用
  // const [openKeys, setOpenKeys2] = useState([] as string[]);
  // const setOpenKeys = (k: string[]) => {
  //   console.log('设置openKeys', k);
  //   setOpenKeys2(k);
  // };

  // 默认打开全部菜单项
  useEffect(() => {
    // 导航处于收缩状态时，Menu自己会处理子菜单展示，不需要我们设置openKey
    if (!collapse && defaultOpenAll) {
      const paths: string[] = [];
      // 获取非叶子菜单路径，设为openKeys
      getAllNonLeafMenuPath(visibleRoutes, paths);
      setOpenKeys(paths);
    }
  }, [visibleRoutes, collapse]);

  // 根据location自动设置哪些菜单需要打开
  useEffect(() => {
    // 导航处于收缩状态时，Menu自己会处理子菜单展示，不需要我们设置openKey
    // defaultOpenAll为true时，不用自动处理
    if (!collapse && !defaultOpenAll) {
      // 默认打开所有父级
      let parents = parentRoutes.slice(0, parentRoutes.length - 1);
      // 查找第一个隐藏菜单项
      const firstHideMenu = parentRoutes.findIndex((v) => v.hideInMenu);
      // 如果有隐藏菜单，隐藏菜单的所有父级应被打开
      if (firstHideMenu !== -1 && firstHideMenu > 0) {
        parents = parentRoutes.slice(0, firstHideMenu - 1);
      }
      setOpenKeys(parents.map((v) => v.path));
    }
  }, [parentRoutes, collapse]);

  // const location = useLocation();
  // 选中最后一个route的path
  let selectPath = parentRoutes.length > 0 ? parentRoutes[parentRoutes.length - 1].path : '';
  // 查找第一个隐藏菜单项
  const firstHideMenu = parentRoutes.findIndex((v) => v.hideInMenu);
  // 如果有隐藏菜单，隐藏菜单的前一个父级应该被选中
  if (firstHideMenu !== -1 && firstHideMenu > 0) {
    selectPath = parentRoutes[firstHideMenu - 1].path;
  }
  // console.log(`当前路径为${location.pathname}, 需选中的路径为${selectPath}`);

  return (
    <Menu
      mode='inline'
      className='menulist-with-text'
      theme={theme}
      selectedKeys={[selectPath]}
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
      style={{ borderRightColor: 'transparent' }}
      // style={{ height: '100%', borderRight: 0, overflow: 'auto' }}
    >
      {getMenuItemList(visibleRoutes)}
    </Menu>
  );
};
export default MenuList;
