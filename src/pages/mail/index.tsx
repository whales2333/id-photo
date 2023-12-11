/* eslint-disable no-template-curly-in-string */
import { Form, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import Header from '../home/header';
import './index.less';

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export default () => {
  const [form] = Form.useForm();
  const navigate = useHistory();

  const onFinish = () => {
    form.validateFields().then((values) => {
      console.log('Received values of form: ', values);
    });
    navigate.push(`/success`); // hooks
  };

  const RederContent = () => {
    return (
      <div className='order-contet-mail'>
        <Form form={form} name='nest-messages' onFinish={onFinish} validateMessages={validateMessages}>
          <div className='title'>Email Address</div>
          <Form.Item name='email' label='Email' rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
          <div className='desc'>Your email will be used to receive photos and receipts</div>
          <div className='btn' onClick={onFinish}>
            Confirm
          </div>
        </Form>
      </div>
    );
  };
  return (
    <div className='order'>
      <Header />
      <div className='order-contet'>
        <RederContent />
      </div>
    </div>
  );
};
