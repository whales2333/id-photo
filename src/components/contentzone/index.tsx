/* eslint-disable no-nested-ternary */
import { FC } from 'react';
import { RouteMenu } from '@/types';
import { useAppSelector } from '@/hooks/useStoreApi';
import { selectIdaasScopes } from '@/store/scope';
import RouteList from '../routelist';
import { hasPermission, useCurrentRoute } from '@/hooks/useRouteMenu';
import Forbidden from '@/pages/403';
import Loading from '../loading';

const ContentZone: FC<{ menus: RouteMenu[] }> = ({ menus }) => {
  const scopes = useAppSelector(selectIdaasScopes);
  const route = useCurrentRoute(menus);

  // 不需要权限控制或者权限校验通过
  const isAuthed = route?.scope === undefined || route?.scope === null || hasPermission(scopes, route.scope);
  // 当前为已注册的微应用路由
  const isMicroAppView = route && route.component === 'mircroAppView';

  return (
    <>
      {scopes.length === 0 ? ( // 未获取到权限时，显示loading
        <Loading />
      ) : !isAuthed ? ( // 没有页面权限时，显示403
        <Forbidden />
      ) : (
        // 非已注册的微应用地址，交给RouteList处理
        <>{!isMicroAppView ? <RouteList menus={menus} /> : null}</>
      )}
      {/* 微应用容器必须保持始终可访问 */}
      <div id='micro-app-content-root' hidden={!isAuthed || !isMicroAppView} />
    </>
  );
};

export default ContentZone;
