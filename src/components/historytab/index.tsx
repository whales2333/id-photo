import { Tabs } from 'antd';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location as HLocation } from 'history/index';
import './index.less';
import { CloseOutlined } from '@ant-design/icons';
import { RouteMenu } from '@/types';
import { useRoutesByLocation } from '@/hooks/useRouteMenu';

declare interface Location extends HLocation {
  name?: string;
}

/** 增加了关闭功能的tab */
const CloseableTab: FC<{ onClose: () => void; showClose: boolean; title: string }> = ({
  onClose,
  showClose,
  title,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className='closeable-tab' onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {title}
      <span
        onClick={(e) => {
          e.stopPropagation();
          return onClose();
        }}
        aria-hidden
        style={{ visibility: showClose && visible ? 'visible' : 'hidden' }}
      >
        <CloseOutlined className='icon' />
      </span>
    </div>
  );
};

/** 注意：location每次push都会生成一个新的key，所以不能通过key来判断是否是同路由，否则会陷入死循环。 */
const isLocationSame = (a: Location, b: Location) => {
  return a.pathname === b.pathname;
};

/** 匹配查找location是否在历史记录列表里（不能拿key匹配，因为key每次跳转都会变） */
const matchLocationInHistoryList = (location: Location, historyList: Location[]) => {
  return historyList.findIndex((v) => isLocationSame(v, location));
};

/** 菜单访问的历史记录tab（仅访问已配置的路由菜单项时，才会添加一条历史记录） */
const HistoryTab: FC<{ menus: RouteMenu[] }> = ({ menus }) => {
  const history = useHistory();
  const location = useLocation();
  const routes = useRoutesByLocation(menus);
  // 当前路由的包装对象，仅当路由已经配置在菜单中时才有，否则为null
  const wrappedLocation = useMemo(() => {
    // 如果存在key&它包含在路由菜单中，认为是有效的
    if (routes.length > 0) {
      return { ...location, name: routes[routes.length - 1].name, key: location.key || location.pathname } as Location;
    }
    return null;
  }, [location, routes]);

  // 历史记录列表
  const [historyList, setHistoryList] = useState<Location[]>(wrappedLocation ? [wrappedLocation] : []);
  // 激活的tab
  const [activeTab, setActiveTab] = useState(wrappedLocation?.key);

  // location变化后，重新计算历史记录列表和activeTab
  useEffect(() => {
    if (!wrappedLocation) return;
    const foundIdx = matchLocationInHistoryList(wrappedLocation, historyList);
    // console.log(`计算历史记录列表，设置activeTab=${wrappedLocation.key}，historyList有${historyList.length}个`);

    if (foundIdx === -1) {
      // location不在列表中，追加到末尾
      setHistoryList(historyList.concat(wrappedLocation));
    } else {
      // location已经在列表中，替换为新值
      const arr = [...historyList];
      arr.splice(foundIdx, 1, wrappedLocation);
      setHistoryList(arr);
    }
    // 选中该location
    setActiveTab(wrappedLocation.key);
  }, [wrappedLocation]);

  // activeTab变化后，判断是否需要跳转路由
  useEffect(() => {
    // console.log(`tab发生了变更，准备跳转，historyList有${historyList.length}个`);
    // 历史记录里查找activeTab
    const found = historyList.find((v) => v.key === activeTab);
    // location变更，才去push
    if (found && !isLocationSame(found, location)) {
      // console.log(`=====跳转`);
      history.push(found);
    }
  }, [activeTab]);

  /** 点击删除某一个tab */
  const clickRemove = useCallback(
    (key: string) => {
      setHistoryList((list) => {
        const foundIdx = list.findIndex((v) => v.key === key);
        if (foundIdx !== -1) {
          list.splice(foundIdx, 1);
        }
        // 如果关闭的正是激活的tab，重新指定激活最后一个tab
        if (activeTab === key && list.length > 0) {
          setActiveTab(list[list.length - 1].key);
        }
        return [...list];
      });
    },
    [activeTab],
  );

  return (
    <Tabs
      activeKey={activeTab}
      onChange={(key) => setActiveTab(key)}
      type='line'
      className='tabs-no-content'
      centered
      tabBarGutter={12}
      hideAdd
      size='small'
    >
      {historyList.map((v) => (
        <Tabs.TabPane
          key={v.key}
          tab={
            <CloseableTab
              onClose={() => v.key && clickRemove(v.key)}
              showClose={historyList.length > 1}
              title={v.name || ''}
            />
          }
        />
      ))}
    </Tabs>
  );
};

export default HistoryTab;
