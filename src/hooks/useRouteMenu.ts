import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'history';
import { RouteMenu } from '@/types';
import { hashCode, parseJson } from '@/utils/common';
import { useAppSelector } from './useStoreApi';
import { selectIdaasScopes } from '@/store/scope';

/** 从一个路由地址，获取该地址的全部动态路由参数名。无动态路由返回空数组。 */
export const getParamArrayByRoutePath = (path: string) => {
  const paramArray: string[] = [];
  // 正则获取动态路由参数。（参数正则为非斜杠[^/]时）
  const iter = path.matchAll(/\/:([^/]+)/g);
  let result = iter.next();
  while (!result.done) {
    if (result.value) {
      const [, paramName] = result.value;
      paramArray.push(paramName);
    }
    result = iter.next();
  }
  return paramArray;
};

/**
 * 判断是否拥有某权限
 * @param ownedScopes 拥有的权限列表
 * @param scope 要判断的权限
 * @returns 是否有权限
 */
export const hasPermission = (ownedScopes: string[], scope: string) => {
  // 权限名匹配 或者
  // 拥有部分权限（如menu:carcenter:carlist:purpose-3和menu:carcenter:carlist） 或者
  // 拥有超类权限（如menu:cartool和menu:cartool:event）
  return ownedScopes.findIndex((v) => v === scope || v.startsWith(`${scope}:`) || scope.startsWith(`${v}:`)) !== -1;
};

/**
 * 先序遍历查找某一菜单项，直到菜单项path等于输入的path，并将它和它的所有父级们存入parentRoutes中
 */
const findRoutesByLocation = (route: RouteMenu, location: Location, parentRoutes: RouteMenu[]) => {
  // 外部链接不用参与匹配
  if (route.component === 'externalUrl') return false;
  let routePath = route.path;
  if (route.component === 'iframeView') {
    // iframe的url需要先转为内部path
    const hash = hashCode(route.path);
    routePath = `/iframeView/${hash}`;
  }
  // 拼成url，获取pathname和search，分别校验
  const { pathname, search } = new URL(`http://daemon.test${routePath}`);
  // 1. 校验pathname是否正则匹配（必要条件）
  const paramNames = getParamArrayByRoutePath(pathname);
  let regExp = `^${pathname}$`;
  // 将所有的动态路由参数替换为正则
  paramNames.forEach((name) => {
    regExp = regExp.replace(`:${name}`, '[^/]+');
  });
  const pathnameMatch = new RegExp(regExp).test(location.pathname);
  // 2. 检查search是否完全一致：如/lingjing?uid=cbiw3FJK9io1H63
  // 或者路由无search：如路由-/licar/photolist，和访问地址-/licar/photolist?jobId=7Y18hfgBV
  const searchMatch = search === location.search || !search;
  // TODO 目前只是简单匹配，合理的是要计算匹配度：pi = pi[pathname] * pi[search]
  // pi[pathname]：pathname完全相同记为1.0；pathname动态路由匹配成功记为0.5；否则为0
  // pi[search]：search完全相同记为1.0；location有search但路由无search，记为0.5；否则为0
  // 如果遇到匹配度1.0的，直接返回；否则遍历完成后取匹配度最高的作为匹配结果。
  if (pathnameMatch && searchMatch) {
    parentRoutes.push(route);
    return true;
  }
  if (route.routes?.length) {
    // 递归查找
    for (let i = 0; i < route.routes.length; i += 1) {
      if (findRoutesByLocation(route.routes[i], location, parentRoutes)) {
        parentRoutes.push(route);
        return true;
      }
    }
  }
  return false;
};

/**
 * 根据当前location，计算它和它的所有父级路由菜单列表
 * @param routes 树状路由菜单列表
 * @returns RouteMenu[] 当前location的父级
 */
export const useRoutesByLocation = (routes: RouteMenu[]) => {
  const location = useLocation();

  // location变更时，重新获取列表
  return useMemo(() => {
    const ps: RouteMenu[] = [];
    for (let i = 0; i < routes?.length; i += 1) {
      if (findRoutesByLocation(routes[i], location, ps)) break;
    }
    return ps.reverse();
  }, [location, routes]);
};

/**
 * 根据当前location，获取它对应的路有菜单对象
 * @returns 当前location对应的route对象
 */
export const useCurrentRoute = (routes: RouteMenu[]) => {
  const rs = useRoutesByLocation(routes);
  return useMemo(() => (rs.length > 0 ? rs[rs.length - 1] : null), [rs]);
};

/** 从route集合树中先序遍历，查找包含组件的路由存入visitableRoutes中 */
const findVisitableRoute = (route: RouteMenu, visitableRoutes: RouteMenu[], scopes: string[]) => {
  if (route.component || route.redirect || route.path.startsWith('http://') || route.path.startsWith('https://')) {
    // 该route不需要权限或者用户有该权限
    if (route.scope === undefined || route.scope === null || hasPermission(scopes, route.scope)) {
      visitableRoutes.push(route);
    }
  }
  if (route.routes?.length) {
    // 递归查找
    for (let i = 0; i < route.routes.length; i += 1) {
      findVisitableRoute(route.routes[i], visitableRoutes, scopes);
    }
  }
};

/**
 * 按序获取所有包含组件可以访问到的路由列表
 * @param routes 树状路由菜单列表
 * @returns RouteMenu[] 包含组件可以访问的路由
 */
export const useVisitableRoutes = (routes: RouteMenu[]) => {
  const scopes = useAppSelector(selectIdaasScopes);

  return useMemo(() => {
    // TODO scopes为空，暂定当做权限获取中（也有可能是真没权限）
    if (scopes.length === 0) return [];
    const visitableRoutes: RouteMenu[] = [];
    routes.forEach((v) => findVisitableRoute(v, visitableRoutes, scopes));
    // console.log('可访问的路由集', visitableRoutes);
    return visitableRoutes;
  }, [routes, scopes]);
};

/** 递归添加visibleChild */
const addMenuVisibleRoute = (route: VisibleRouteMenu, parent: VisibleRouteMenu[], scopes: string[]) => {
  if (route.routes?.length) {
    const arr: RouteMenu[] = [];
    for (let i = 0; i < route.routes.length; i += 1) {
      addMenuVisibleRoute(route.routes[i], arr, scopes);
    }
    if (arr.length > 0) route.visibleChild = arr;
  }
  // 非隐藏菜单 & 无需权限或已授权 & 可访问或叶子节点或有可见子节点的非叶子节点
  if (
    !route.hideInMenu &&
    (route.scope === undefined || route.scope === null || hasPermission(scopes, route.scope)) &&
    (route.component || !route.routes || route.visibleChild?.length)
  )
    parent.push(route);
};

export interface VisibleRouteMenu extends RouteMenu {
  visibleChild?: VisibleRouteMenu[];
}

/**
 * 将路由对象筛选出只剩下可见菜单的路由列表。
 * 这些菜单将被筛除：
 * 1. 隐藏的
 * 2. 无访问权限的
 * 3. 没有可见菜单的非叶子菜单
 * 4. 不可访问的叶子菜单
 * @param routes 原始的路由对象，该对象不会变更
 * @return 返回的路由列表，会在路由对象里增加visibleChild属性
 */
export const useMenuVisibleRoutes = (routes: RouteMenu[]) => {
  const scopes = useAppSelector(selectIdaasScopes);

  return useMemo(() => {
    const rs = routes;
    // TODO scopes为空，暂定当做权限获取中（也有可能是真没权限）
    if (scopes.length === 0) return [];
    const visibleRoutes: VisibleRouteMenu[] = [];
    rs.forEach((v) => addMenuVisibleRoute(v, visibleRoutes, scopes));
    // console.log('可见菜单集', visibleRoutes);
    return visibleRoutes;
  }, [routes, scopes]);
};

/** 预处理路由列表 */
export const preProcessRoutes = (routes: RouteMenu[]) => {
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    // 1. 先处理子菜单
    if (route.routes?.length) {
      // eslint-disable-next-line no-await-in-loop
      preProcessRoutes(route.routes);
    }
    // 2. 处理meta字段
    if (route.meta) {
      // 如果meta是字符串，转为对象
      if (typeof route.meta === 'string') route.meta = parseJson(route.meta);
    }
  }
};
