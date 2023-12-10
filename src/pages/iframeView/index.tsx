import { useContext } from 'react';
import { RouteContext } from '@/components/routelist';
import { useRoutesByLocation } from '@/hooks/useRouteMenu';
import './index.less';

/** 专门用于iframe加载url路由的组件 */
const IframeView = () => {
  const { menus } = useContext(RouteContext);
  const rs = useRoutesByLocation(menus);
  const path = rs?.length > 0 ? rs[rs.length - 1].path : '';
  return (
    <div className='vc-iframe-common-wrap'>
      <iframe
        src={path}
        title='common-iframe'
        frameBorder={0}
        style={{ background: 'white' }}
        className='iframe-content'
        allow='fullscreen'
      />
    </div>
  );
};

export default IframeView;
