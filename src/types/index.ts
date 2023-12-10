import React, { CSSProperties, ReactElement, ReactNode } from 'react';

export type User = {
  nickname: string;
  picture: string;
};

export type RouteMenu = {
  name: string; // 名称，展示到菜单、面包屑位置
  path: string; // 路径，可填入http(s)链接或相对路径，支持动态路由和url参数。
  component?: React.ComponentType | 'iframeView' | 'mircroAppView' | 'externalUrl' | string; // 组件/iframeView/mircroAppView/externalUrl
  icon?: ReactNode | string;
  routes?: RouteMenu[];
  hideInMenu?: boolean;
  meta?: SupportMetas; // 额外信息，用于组件附加的配置
  scope?: string; // 该路由需要权限
  redirect?: string; // 要重定向的path（仅component为空时有效）。访问到本路由时会重定向到该path；如果填入的是http(s)地址，则会使用iframe打开
};

export type SupportMetas = {
  homeContentTips?: React.ReactNode;
  homeContentTipsStyle?: CSSProperties;
  homeContentTopStyle?: CSSProperties;
  homeContentStyle?: CSSProperties;
  /** true-隐藏全部页面基础元素, object-隐藏部分基础元素, 默认false-什么都不隐藏 */
  pure?:
    | boolean
    | {
        /** 是否隐藏顶部导航条 */
        topBar?: boolean;
        /** 是否隐藏左侧菜单 */
        menuList?: boolean;
        /** 是否隐藏面包屑和历史记录tab */
        contentTop?: boolean;
      };
};
