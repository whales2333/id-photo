import 'antd/dist/antd.less';
import '@/assets/css/app.less';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/dist/locale/zh-cn';
import App from './App';
import store from './store';

moment.locale('zh-cn');

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>,
  document.getElementById('mainapp-root'),
);
