import React, { createContext, Suspense, useMemo } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from '@/components/loading';
import { RouteMenu } from '@/types';
import { useVisitableRoutes } from '@/hooks/useRouteMenu';
import { hashCode } from '@/utils/common';
/** 这是全部的pages下的页面组件。用于动态的组件加载（vite专用） */
const AllPageModules = import.meta.glob('../../pages/*/*.tsx');

const IframeView = React.lazy(() => import('@/pages/iframeView'));
const NotFound = React.lazy(() => import('@/pages/404/index'));

export const RouteContext = createContext({
  menus: [] as RouteMenu[],
});

/** 根据menu获取单个路由组件 */
const getRouteItem = (menu: RouteMenu) => {
  // 特殊组件，不需要生成route
  if (menu.component === 'externalUrl' || menu.component === 'iframeView' || menu.component === 'mircroAppView') {
    return null;
  }

  if (typeof menu.component === 'string') {
    // 如果是字符串的组件路径，将其转换为lazy组件
    // @ts-ignore
    const comp = React.lazy(AllPageModules[`../../pages/${menu.component}`]);
    return <Route exact path={menu.path} component={comp} key={menu.path} />;
  }

  if (menu.component) {
    // @ts-ignore
    return <Route exact path={menu.path} component={menu.component} key={menu.path} />;
  }

  // 如果有重定向
  if (menu.redirect) {
    const isUrl = menu.redirect.startsWith('http://') || menu.redirect.startsWith('https://');
    if (isUrl) {
      // 如果有url的重定向地址，则跳转到iframe页面中打开
      const hash = hashCode(menu.redirect);
      return <Redirect exact from={menu.path} key={menu.path} to={`/iframeView/${hash}`} />;
    }
    return <Redirect exact from={menu.path} key={menu.path} to={menu.redirect} />;
  }

  return null;
};

/** 路由列表组件，与配置式路由菜单绑定 */
const RouteList: React.FC<{ menus: RouteMenu[] }> = ({ menus }) => {
  // 这些都是可访问的
  const visitables = useVisitableRoutes(menus);
  // 生成route组件集合
  const routeEles = useMemo(() => {
    return visitables.map((r) => getRouteItem(r)).filter((r) => r !== null);
  }, [visitables]);
  return (
    <RouteContext.Provider value={{ menus }}>
      <Suspense fallback={<Loading />}>
        <Switch>
          {routeEles}
          <Route path='/iframeView/:hash' component={IframeView} key='/iframeRouteView' />
          <Route path='*' key='/404' component={NotFound} />
        </Switch>
      </Suspense>
    </RouteContext.Provider>
  );
};

export default RouteList;
