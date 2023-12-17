/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import { message, Spin, Upload, Image } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import Header from '../home/header';

import './index.less';
import { getUuid, uploadImgToBase64 } from '@/utils/common';

const size = [384, 384];
export default () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [succesFalg, setSuccesFalg] = useState(false);
  const [failFalg, setFailFalg] = useState(false);
  const [errInfo, setErrInfo] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [uuid, setuuid] = useState('');

  const genateUid = () => {
    const id = getUuid();
    setuuid(id);
    return id;
  };

  const goOrder = () => {
    const requestOptions = {
      method: 'POST',
    };
    setUploading(true);
    // You can use any AJAX library you like
    // fetch('https://1306602019-2aqc0ebwde-use.scf.tencentcs.com', requestOptions)
    fetch(`http://localhost:4242/create-checkout-session?id=${uuid}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };
  const handleUpload = (result: string) => {
    const id = genateUid();
    console.log('----id', id);

    const myHeaders = new Headers();
    myHeaders.append('Authentication', 'hhyx-id-photo-create');
    myHeaders.append('Content-Type', 'application/json');

    const paramsStr = result.split(',')[1];
    const paramsImgType = result.split(',')[0];

    const raw = JSON.stringify({
      imgStr: paramsStr,
      height: size[1],
      width: size[0],
      beauty: true,
    });

    const requestOptions:any = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    setUploading(true);
    // You can use any AJAX library you like
    // fetch('https://1306602019-2aqc0ebwde-use.scf.tencentcs.com', requestOptions)
    fetch('/upload', requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { code, data, message } = res;

        if (code !== 0) {
          setFailFalg(true);
          setErrInfo(message);
          setSuccesFalg(false);
          return;
        }
        setSuccesFalg(true);
        setErrInfo('');
        const { img, img_common } = data;
        setImgSrc(`${paramsImgType},${img_common}`);
        // message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props: UploadProps = {
    onRemove: (file) => {
      setFileList([]);
      setImgSrc('');
    },
    beforeUpload: async (file) => {
      const { result }: any = await uploadImgToBase64(file);

      handleUpload(result);
      // setImgSrc(result);
      setFileList([file]);
      return false;
    },
    fileList,
    showUploadList: false,
  };

  const handlerOnOrder = () => {};

  const RenderSatus = () => {
    if (uploading) {
      return (
        <Spin spinning={uploading} tip='Uploading'>
          <div className={`operation-contet-upload ${failFalg ? 'fail' : ''}`} />
        </Spin>
      );
    }

    if (failFalg) {
      return (
        <Spin spinning={uploading} tip='Uploading'>
          <div className='operation-contet-upload'>
            <svg xmlns='http://www.w3.org/2000/svg' width='61' height='60' viewBox='0 0 61 60' fill='none'>
              <path
                d='M30.5 4C44.8585 4 56.5 15.6415 56.5 30C56.5 44.3585 44.8585 56 30.5 56C16.1415 56 4.5 44.3585 4.5 30C4.5 15.6415 16.1415 4 30.5 4ZM23.2178 19.7755C23.0245 19.5823 22.795 19.4291 22.5424 19.3246C22.2899 19.2201 22.0192 19.1663 21.7459 19.1664C21.4726 19.1665 21.202 19.2205 20.9495 19.3252C20.697 19.4299 20.4676 19.5832 20.2744 19.7766C20.0812 19.9699 19.928 20.1994 19.8235 20.452C19.719 20.7045 19.6653 20.9752 19.6654 21.2485C19.6655 21.5218 19.7194 21.7925 19.8241 22.0449C19.9288 22.2974 20.0822 22.5268 20.2755 22.72L27.5598 30L20.2755 37.2843C20.0823 37.4775 19.9291 37.7069 19.8245 37.9593C19.7199 38.2117 19.6661 38.4823 19.6661 38.7555C19.6661 39.0287 19.7199 39.2993 19.8245 39.5517C19.9291 39.8041 20.0823 40.0335 20.2755 40.2267C20.4687 40.4199 20.6981 40.5731 20.9505 40.6777C21.2029 40.7822 21.4734 40.836 21.7467 40.836C22.0199 40.836 22.2904 40.7822 22.5429 40.6777C22.7953 40.5731 23.0246 40.4199 23.2178 40.2267L30.5 32.9402L37.7822 40.2245C37.9754 40.4177 38.2047 40.5709 38.4571 40.6755C38.7096 40.7801 38.9801 40.8339 39.2533 40.8339C39.5266 40.8339 39.7971 40.7801 40.0495 40.6755C40.3019 40.5709 40.5313 40.4177 40.7245 40.2245C40.9177 40.0313 41.0709 39.8019 41.1755 39.5495C41.2801 39.2971 41.3339 39.0266 41.3339 38.7533C41.3339 38.4801 41.2801 38.2096 41.1755 37.9571C41.0709 37.7047 40.9177 37.4754 40.7245 37.2822L33.4445 30L40.7245 22.7178C40.9177 22.5246 41.0709 22.2953 41.1755 22.0429C41.2801 21.7904 41.3339 21.5199 41.3339 21.2467C41.3339 20.9734 41.2801 20.7029 41.1755 20.4505C41.0709 20.1981 40.9177 19.9687 40.7245 19.7755C40.5313 19.5823 40.3019 19.4291 40.0495 19.3245C39.7971 19.2199 39.5266 19.1661 39.2533 19.1661C38.9801 19.1661 38.7096 19.2199 38.4571 19.3245C38.2047 19.4291 37.9754 19.5823 37.7822 19.7755L30.5022 27.0555L23.2178 19.7755Z'
                fill='#EB5757'
              />
            </svg>
            <div className='err'>{errInfo}</div>
          </div>
        </Spin>
      );
    }

    if (succesFalg) {
      return (
        <Spin spinning={uploading} tip='Uploading'>
          <div className='operation-contet-upload'>
            <svg xmlns='http://www.w3.org/2000/svg' width='61' height='60' viewBox='0 0 61 60' fill='none'>
              <path
                d='M30.5 3.75C37.4619 3.75 44.1387 6.51562 49.0616 11.4384C53.9844 16.3613 56.75 23.0381 56.75 30C56.75 36.9619 53.9844 43.6387 49.0616 48.5616C44.1387 53.4844 37.4619 56.25 30.5 56.25C23.5381 56.25 16.8613 53.4844 11.9384 48.5616C7.01562 43.6387 4.25 36.9619 4.25 30C4.25 23.0381 7.01562 16.3613 11.9384 11.4384C16.8613 6.51562 23.5381 3.75 30.5 3.75ZM27.23 35.1787L21.3988 29.3438C21.1897 29.1347 20.9415 28.9689 20.6684 28.8557C20.3953 28.7426 20.1025 28.6844 19.8069 28.6844C19.5112 28.6844 19.2185 28.7426 18.9454 28.8557C18.6722 28.9689 18.424 29.1347 18.215 29.3438C17.7928 29.7659 17.5556 30.3386 17.5556 30.9356C17.5556 31.5327 17.7928 32.1053 18.215 32.5275L25.64 39.9525C25.8485 40.1626 26.0964 40.3293 26.3697 40.4431C26.6429 40.5569 26.9359 40.6155 27.2319 40.6155C27.5278 40.6155 27.8209 40.5569 28.0941 40.4431C28.3673 40.3293 28.6153 40.1626 28.8237 39.9525L44.1987 24.5737C44.4106 24.3656 44.5791 24.1175 44.6946 23.8439C44.8101 23.5702 44.8703 23.2764 44.8717 22.9794C44.873 22.6824 44.8156 22.3881 44.7027 22.1134C44.5897 21.8387 44.4235 21.5891 44.2136 21.3789C44.0037 21.1688 43.7543 21.0023 43.4797 20.889C43.2052 20.7757 42.9109 20.7179 42.6139 20.719C42.3169 20.72 42.023 20.7798 41.7492 20.895C41.4754 21.0102 41.2272 21.1784 41.0188 21.39L27.23 35.1787Z'
                fill='#008EFF'
              />
            </svg>
            <div>Successful</div>
          </div>
        </Spin>
      );
    }

    return (
      <div className='operation-contet-upload'>
        <svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60' fill='none'>
          <path
            d='M31.875 50.625V39.375H39.375L30 28.125L20.625 39.375H28.125V50.625H18.75V50.5312C18.435 50.55 18.135 50.625 17.8125 50.625C14.0829 50.625 10.506 49.1434 7.86881 46.5062C5.23158 43.869 3.75 40.2921 3.75 36.5625C3.75 29.3475 9.20625 23.4675 16.2075 22.6613C16.8213 19.4523 18.5342 16.5576 21.0514 14.475C23.5686 12.3924 26.7329 11.252 30 11.25C33.2675 11.2518 36.4323 12.3921 38.9502 14.4747C41.4681 16.5573 43.1816 19.452 43.7963 22.6613C50.7975 23.4675 56.2463 29.3475 56.2463 36.5625C56.2463 40.2921 54.7647 43.869 52.1274 46.5062C49.4902 49.1434 45.9134 50.625 42.1838 50.625C41.8688 50.625 41.565 50.55 41.2463 50.5312V50.625H31.875Z'
            fill='black'
          />
        </svg>
        <div>Drag and drop here</div>
        <div>or</div>
        <div className='btn'>Select File</div>
      </div>
    );
  };
  return (
    <div className='operation'>
      <Header />
      <div className={`operation-contet  ${imgSrc ? 'operation-contet-col' : ''}`}>
        {imgSrc ? (
          <>
            <div className='operation-contet-preview'>
              <div className='img'>
                <Image width={384} height={384} preview={false} src={imgSrc} />;
                <div className='g1'>
                  <span>2 inch</span>
                  <svg xmlns='http://www.w3.org/2000/svg' width='386' height='8' viewBox='0 0 386 8' fill='none'>
                    <path
                      d='M0.646447 3.64648C0.451184 3.84174 0.451184 4.15832 0.646447 4.35358L3.82843 7.53556C4.02369 7.73083 4.34027 7.73083 4.53553 7.53556C4.7308 7.3403 4.7308 7.02372 4.53553 6.82846L1.70711 4.00003L4.53553 1.1716C4.7308 0.976341 4.7308 0.659758 4.53553 0.464496C4.34027 0.269234 4.02369 0.269234 3.82843 0.464496L0.646447 3.64648ZM385.354 4.35355C385.549 4.15829 385.549 3.84171 385.354 3.64644L382.172 0.464463C381.976 0.269201 381.66 0.269201 381.464 0.464463C381.269 0.659726 381.269 0.976308 381.464 1.17157L384.293 4L381.464 6.82842C381.269 7.02369 381.269 7.34027 381.464 7.53553C381.66 7.73079 381.976 7.73079 382.172 7.53553L385.354 4.35355ZM1 4.50003L385 4.5L385 3.5L1 3.50003L1 4.50003Z'
                      fill='black'
                    />
                  </svg>
                </div>
                <div className='g2'></div>
                <div className='g3'></div>
                <div className='l1'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='8' height='386' viewBox='0 0 8 386' fill='none'>
                    <path
                      d='M4.35355 0.646447C4.15829 0.451184 3.84171 0.451184 3.64645 0.646447L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646447ZM3.64643 385.354C3.84169 385.549 4.15827 385.549 4.35354 385.354L7.53552 382.172C7.73078 381.976 7.73078 381.66 7.53552 381.464C7.34026 381.269 7.02367 381.269 6.82841 381.464L3.99998 384.293L1.17156 381.464C0.976294 381.269 0.659712 381.269 0.464449 381.464C0.269187 381.66 0.269187 381.976 0.464449 382.172L3.64643 385.354ZM3.5 1L3.49998 385L4.49998 385L4.5 1L3.5 1Z'
                      fill='black'
                    />
                  </svg>
                  <span>2 inch</span>
                </div>
                <div className='l2'>
                  <span>1.6 inch</span>
                  <svg xmlns='http://www.w3.org/2000/svg' width='8' height='249' viewBox='0 0 8 249' fill='none'>
                    <path
                      d='M4.35355 0.646447C4.15829 0.451184 3.84171 0.451184 3.64645 0.646447L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646447ZM3.64646 248.354C3.84172 248.549 4.1583 248.549 4.35356 248.354L7.53554 245.172C7.73081 244.976 7.73081 244.66 7.53554 244.464C7.34028 244.269 7.0237 244.269 6.82844 244.464L4.00001 247.293L1.17158 244.464C0.976321 244.269 0.659739 244.269 0.464477 244.464C0.269215 244.66 0.269215 244.976 0.464477 245.172L3.64646 248.354ZM3.5 1L3.50001 248L4.50001 248L4.5 1L3.5 1Z'
                      fill='#333333'
                    />
                  </svg>
                </div>
              </div>

              <div className='btn' onClick={goOrder}>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M13.7149 4.99944L10.2864 4.99944C9.81494 4.99944 9.42923 5.38516 9.42923 5.85659L9.42923 10.1423L8.06637 10.1423C7.30351 10.1423 6.9178 11.068 7.4578 11.608L11.3921 15.5423C11.4714 15.6218 11.5656 15.6848 11.6693 15.7278C11.773 15.7708 11.8841 15.793 11.9964 15.793C12.1086 15.793 12.2198 15.7708 12.3235 15.7278C12.4272 15.6848 12.5214 15.6218 12.6007 15.5423L16.5349 11.608C17.0749 11.068 16.6978 10.1423 15.9349 10.1423L14.5721 10.1423L14.5721 5.85659C14.5721 5.38516 14.1864 4.99944 13.7149 4.99944Z'
                    fill='white'
                  />
                  <path
                    d='M6.85714 18.5078L17.1429 18.5078C17.6143 18.5078 18 18.1221 18 17.6507C18 17.1792 17.6143 16.7935 17.1429 16.7935L6.85714 16.7935C6.38571 16.7935 6 17.1792 6 17.6507C6 18.1221 6.38571 18.5078 6.85714 18.5078Z'
                    fill='white'
                  />
                </svg>
                Download without watermark
              </div>
            </div>

            <div className='operation-contet-info'>
              <div>
                Photo Dimension: 2 inch x 2 inch{' '}
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z'
                    fill='#6FCF97'
                  />
                </svg>
              </div>
              <div>
                Head Proportion: 1.6 inch{' '}
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z'
                    fill='#6FCF97'
                  />
                </svg>
              </div>
              <div>
                Clear Background: pure white
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z'
                    fill='#6FCF97'
                  />
                </svg>
              </div>
              <div>
                High Resolution: 300 DPI{' '}
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z'
                    fill='#6FCF97'
                  />
                </svg>
              </div>
              <div>
                Photo Size: 240 KB{' '}
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z'
                    fill='#6FCF97'
                  />
                </svg>
              </div>
              <div>
                File Format: PNG{' '}
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z'
                    fill='#6FCF97'
                  />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <>
            <Upload {...props}>
              <RenderSatus />
            </Upload>

            <div className='operation-contet-info'>
              {failFalg ? (
                <div className='fail'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M12 2C17.5225 2 22 6.4775 22 12C22 17.5225 17.5225 22 12 22C6.4775 22 2 17.5225 2 12C2 6.4775 6.4775 2 12 2ZM9.19917 8.0675C9.12481 7.99319 9.03654 7.93426 8.9394 7.89407C8.84226 7.85387 8.73816 7.83321 8.63304 7.83325C8.52792 7.83328 8.42383 7.85403 8.32672 7.89429C8.22961 7.93456 8.14139 7.99356 8.06708 8.06792C7.99278 8.14228 7.93384 8.23055 7.89365 8.32768C7.85346 8.42482 7.83279 8.52892 7.83283 8.63404C7.83287 8.73917 7.85361 8.84326 7.89388 8.94036C7.93414 9.03747 7.99314 9.12569 8.0675 9.2L10.8692 12L8.0675 14.8017C7.99319 14.876 7.93425 14.9642 7.89404 15.0613C7.85382 15.1584 7.83312 15.2624 7.83312 15.3675C7.83312 15.4726 7.85382 15.5766 7.89404 15.6737C7.93425 15.7708 7.99319 15.859 8.0675 15.9333C8.14181 16.0076 8.23002 16.0666 8.32711 16.1068C8.42419 16.147 8.52825 16.1677 8.63333 16.1677C8.73842 16.1677 8.84247 16.147 8.93956 16.1068C9.03665 16.0666 9.12486 16.0076 9.19917 15.9333L12 13.1308L14.8008 15.9325C14.8751 16.0068 14.9634 16.0657 15.0604 16.106C15.1575 16.1462 15.2616 16.1669 15.3667 16.1669C15.4718 16.1669 15.5758 16.1462 15.6729 16.106C15.77 16.0657 15.8582 16.0068 15.9325 15.9325C16.0068 15.8582 16.0657 15.77 16.106 15.6729C16.1462 15.5758 16.1669 15.4718 16.1669 15.3667C16.1669 15.2616 16.1462 15.1575 16.106 15.0604C16.0657 14.9634 16.0068 14.8751 15.9325 14.8008L13.1325 12L15.9325 9.19917C16.0068 9.12486 16.0657 9.03665 16.106 8.93956C16.1462 8.84247 16.1669 8.73842 16.1669 8.63333C16.1669 8.52825 16.1462 8.42419 16.106 8.32711C16.0657 8.23002 16.0068 8.14181 15.9325 8.0675C15.8582 7.99319 15.77 7.93425 15.6729 7.89404C15.5758 7.85382 15.4718 7.83312 15.3667 7.83312C15.2616 7.83312 15.1575 7.85382 15.0604 7.89404C14.9634 7.93425 14.8751 7.99319 14.8008 8.0675L12.0008 10.8675L9.19917 8.0675Z'
                      fill='#EB5757'
                    />
                  </svg>
                  {errInfo}
                </div>
              ) : (
                <>
                  <div>Neutral facial expression.</div>
                  <div>Frontal Photo.</div>
                  <div>No Eyeglasses.</div>
                  <div>No hats or headgear (unless it's for religious reasons)</div>
                  <div>Everyday clothing.</div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
