import { LoadingOutlined } from '@ant-design/icons';
import { Skeleton, Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const Loading = () => (
  <Spin
    indicator={antIcon}
    size='large'
    style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%.50%)' }}
  />
);

export default Loading;
