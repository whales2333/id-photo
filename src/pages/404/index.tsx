import { Button, Result } from 'antd';

export default () => (
  <>
    <Result
      style={{ marginTop: 48 }}
      title='404'
      status='404'
      extra={
        <Button type='primary' href='/'>
          回到首页
        </Button>
      }
    />
  </>
);
