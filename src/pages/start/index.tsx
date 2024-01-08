/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import { Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload/interface';

import { useHistory } from 'react-router-dom';

import './index.less';

import Header from '../home/header';

export default () => {
  const navigate = useHistory();

  const props: UploadProps = {
    beforeUpload: async (file) => {
      try {
        navigate.push(`/operation`, { file: file });
      } catch (error) {
        console.log(error);
      }

      return false;
    },
    fileList: [],
    showUploadList: false,
    capture: 'user',
    accept: 'image/*',
  };

  const navToUpload = () => {
    navigate.push(`/operation`); // hooks
  };

  return (
    <div className='start'>
      <Header />
      <div className='start-contet'>
        <div className='item'>
          <div className='upload'>
            <svg xmlns='http://www.w3.org/2000/svg' width='31' height='30' viewBox='0 0 31 30' fill='none'>
              <path
                d='M12.2322 21.2141H18.018C18.8135 21.2141 19.4644 20.5632 19.4644 19.7677V12.5355H21.7643C23.0516 12.5355 23.7025 10.9733 22.7912 10.062L16.1521 3.42288C16.0182 3.28879 15.8593 3.18241 15.6843 3.10982C15.5093 3.03724 15.3218 2.99988 15.1323 2.99988C14.9429 2.99988 14.7553 3.03724 14.5803 3.10982C14.4053 3.18241 14.2464 3.28879 14.1126 3.42288L7.47342 10.062C6.56216 10.9733 7.19859 12.5355 8.48592 12.5355H10.7858V19.7677C10.7858 20.5632 11.4367 21.2141 12.2322 21.2141ZM6.44644 24.107H23.8037C24.5993 24.107 25.2502 24.7579 25.2502 25.5534C25.2502 26.349 24.5993 26.9999 23.8037 26.9999H6.44644C5.6509 26.9999 5 26.349 5 25.5534C5 24.7579 5.6509 24.107 6.44644 24.107Z'
                fill='white'
              />
            </svg>
          </div>

          <div onClick={navToUpload}>Upload Photo</div>
        </div>
        <Upload {...props}>
          <div className='item'>
            <div>
              <svg xmlns='http://www.w3.org/2000/svg' width='61' height='60' viewBox='0 0 61 60' fill='none'>
                <path
                  d='M31.0001 42C35.9707 42 40.0001 37.9706 40.0001 33C40.0001 28.0294 35.9707 24 31.0001 24C26.0296 24 22.0001 28.0294 22.0001 33C22.0001 37.9706 26.0296 42 31.0001 42Z'
                  fill='#30313D'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M20.3418 9.31672L17.5001 15H13.0001C9.68641 15 7.00012 17.6863 7.00012 21V48C7.00012 51.3137 9.68641 54 13.0001 54H49.0001C52.3138 54 55.0001 51.3137 55.0001 48V21C55.0001 17.6863 52.3138 15 49.0001 15H44.5001L41.6585 9.31672C40.6421 7.28401 38.5646 6 36.2919 6H25.7083C23.4357 6 21.3581 7.28401 20.3418 9.31672ZM31.0001 48C22.7158 48 16.0001 41.2843 16.0001 33C16.0001 24.7157 22.7158 18 31.0001 18C39.2844 18 46.0001 24.7157 46.0001 33C46.0001 41.2843 39.2844 48 31.0001 48Z'
                  fill='#30313D'
                />
              </svg>
            </div>
            <div>Take Photo</div>
          </div>
        </Upload>
      </div>
    </div>
  );
};
