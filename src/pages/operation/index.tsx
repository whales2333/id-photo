/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import { message, Spin, Upload, Image, Modal, Space } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';

import { useLocalStorageState } from 'ahooks';
import { useHistory, useLocation } from 'react-router-dom';

import './index.less';
import { ExclamationCircleFilled } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';
import { getUuid, uploadImgToBase64 } from '@/utils/common';

import Header from '../home/header';

import ICON_ERROR from '@/assets/img/Frame 10789.png';
import ICON_PAIED from '@/assets/img/Frame 10804.png';

function saveBase64Image(base64String: string | undefined, fileName: string) {
  const link: any = document.createElement('a');
  link.href = base64String;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  // document?.bodyNaNpxoveChild(link);
}

const size = [420, 420];

const baseUrl = 'https://subscribe.network3.io';
// const baseUrl = '';

export default () => {
  const location: any = useLocation();

  console.log('::location', location);

  const searchParams = new URLSearchParams(window.location.search);
  const uid = searchParams.get('u');
  const [session, setsession] = useLocalStorageState<string | undefined>('use-local-storage-state-session', {
    defaultValue: '',
  });
  const [sessionLoading, setsessionLoading] = useState(false);
  const [paiedInfo, setpaiedInfo] = useState<any>(null);

  const navigate = useHistory();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [succesFalg, setSuccesFalg] = useState(false);
  const [failFalg, setFailFalg] = useState(false);
  const [errInfo, setErrInfo] = useState('');
  const [imgSrc, setImgSrc] = useLocalStorageState<string | undefined>('use-local-storage-state-img', {
    defaultValue: '',
  });
  const [uuid, setuuid] = useLocalStorageState<string | undefined>('use-local-storage-state-uid', {
    defaultValue: '',
  });
  const [fileType, setfileType] = useLocalStorageState<string | undefined>('use-local-storage-filetype', {
    defaultValue: '',
  });

  const isPayed = uid === uuid;

  const genateUid = () => {
    const id = getUuid();
    setuuid(id);
    return id;
  };

  const handleUpload = (result: string) => {
    const id = genateUid();
    console.log('----id', id);

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const paramsStr = result.split(',')[1];
    const paramsImgType: any = result.split(',')[0];
    if (paramsImgType) {
      const fileType = paramsImgType.match(/^data:(.*);/)[1].split('/')[1];
      console.log('::fileType', fileType);
      setfileType(fileType);
    }

    const raw: any = {
      imgStr: paramsStr,
      height: size[1],
      width: size[0],
      beauty: true,
    };

    const requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        params: raw,
        id,
        fileType: paramsImgType,
      }),
      redirect: 'follow',
    };
    setUploading(true);
    // You can use any AJAX library you like
    // fetch('/photo/upload', requestOptions)
    fetch(`${baseUrl}/photo/upload`, requestOptions)
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

  const beforeUpload = async (file:any) => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1500,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };
    try {
      const compressedFile = await imageCompression(file, options);
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
      const { result }: any = await uploadImgToBase64(compressedFile);

      handleUpload(result);
      // setImgSrc(result);
      setFileList([file]);
    } catch (error) {
      console.log(error);
    }

    return false;
  };

  const props: UploadProps = {
    onRemove: () => {
      setFileList([]);
      setImgSrc('');
    },
    beforeUpload,
    fileList,
    showUploadList: false,
    accept: 'image/*',
  };

  const handlerOnOrder = () => {
    if (isPayed) {
      saveBase64Image(imgSrc, `${Date.now()}.${fileType}`);
      return false;
    }
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const requestOptions: any = {
      headers: myHeaders,
      method: 'POST',
      body: JSON.stringify({
        id: uuid,
        reUrl: window.location.href,
      }),
      redirect: 'follow',
    };
    // fetch('/photo/create-checkout-session', requestOptions)
    fetch(`${baseUrl}/photo/create-checkout-session`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { code, data, message } = res;
        console.log(':res', res);
        if (code === 0) {
          setsession(data.id);
          window.location.href = data.url;
        } else {
          message.error('handlerOnOrder failed.2');
        }
      })
      .catch(() => {
        message.error('handlerOnOrder failed.');
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (session && isPayed) {
      getPaiedInfo();
    }
  }, [session, isPayed]);

  const getPaiedInfo = () => {
    setsessionLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const requestOptions: any = {
      headers: myHeaders,
      method: 'POST',
      body: JSON.stringify({
        session,
      }),
    };
    fetch(`${baseUrl}/photo/get-checkout-session`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { code, data, message } = res;
        setpaiedInfo(res.data);
        console.log(':getPaiedInfo res', res);
      })
      .catch(() => {
        message.error('getPaiedInfo failed.');
      })
      .finally(() => {
        setsessionLoading(false);
      });
  };

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

  const clear = () => {
    setImgSrc('');
    setSuccesFalg(false);
    setFailFalg(false);
    setuuid('');
    setpaiedInfo(null);
    setsession('');
  };

  useEffect(() => {
    if (location.state?.file) {
      clear();
      beforeUpload(location.state?.file);
    }
  }, [location.state]);

  const reUpdate = () => {
    Modal.confirm({
      title: ' Re-upload?',
      icon: <ExclamationCircleFilled />,
      cancelText: 'cancel',
      okText: 'ok',
      onOk: () => {
        clear();
        navigate.replace(`/operation`); // hooks
      },
    });
  };
  if (uploading) {
    return (
      <div className='operation'>
        <Header />
        <div className={`operation-contet  loading`}>
          <div className='icon'>
            <div></div>
            <div>Processing...</div>
          </div>
        </div>
      </div>
    );
  }

  const Ctags = () => {
    return (
      <>
        <div>
          Photo Dimension: 2 inch x 2 inch
          <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M3.97308 9.90981L0.21967 6.19095C-0.0732233 5.89561 -0.0732233 5.41677 0.21967 5.12143C0.512563 4.82608 0.987437 4.82608 1.28033 5.12143L4.50051 8.2901L10.7167 2.09651C11.0095 1.80116 11.4844 1.80116 11.7773 2.09651C12.0702 2.39185 12.0702 2.87069 11.7773 3.16603L5.02456 9.90635C4.73368 10.1965 4.26583 10.1981 3.97308 9.90981Z'
              fill='#006908'
            />
          </svg>
        </div>
        <div>
          File Format: PNG
          <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M3.97308 9.90981L0.21967 6.19095C-0.0732233 5.89561 -0.0732233 5.41677 0.21967 5.12143C0.512563 4.82608 0.987437 4.82608 1.28033 5.12143L4.50051 8.2901L10.7167 2.09651C11.0095 1.80116 11.4844 1.80116 11.7773 2.09651C12.0702 2.39185 12.0702 2.87069 11.7773 3.16603L5.02456 9.90635C4.73368 10.1965 4.26583 10.1981 3.97308 9.90981Z'
              fill='#006908'
            />
          </svg>
        </div>
        <div>
          Head Proportion: 1.6 inch{' '}
          <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M3.97308 9.90981L0.21967 6.19095C-0.0732233 5.89561 -0.0732233 5.41677 0.21967 5.12143C0.512563 4.82608 0.987437 4.82608 1.28033 5.12143L4.50051 8.2901L10.7167 2.09651C11.0095 1.80116 11.4844 1.80116 11.7773 2.09651C12.0702 2.39185 12.0702 2.87069 11.7773 3.16603L5.02456 9.90635C4.73368 10.1965 4.26583 10.1981 3.97308 9.90981Z'
              fill='#006908'
            />
          </svg>
        </div>{' '}
        <div>
          Photo Size: 240 KB{' '}
          <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M3.97308 9.90981L0.21967 6.19095C-0.0732233 5.89561 -0.0732233 5.41677 0.21967 5.12143C0.512563 4.82608 0.987437 4.82608 1.28033 5.12143L4.50051 8.2901L10.7167 2.09651C11.0095 1.80116 11.4844 1.80116 11.7773 2.09651C12.0702 2.39185 12.0702 2.87069 11.7773 3.16603L5.02456 9.90635C4.73368 10.1965 4.26583 10.1981 3.97308 9.90981Z'
              fill='#006908'
            />
          </svg>
        </div>{' '}
        <div>
          File Resolution: 300 DPI
          <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M3.97308 9.90981L0.21967 6.19095C-0.0732233 5.89561 -0.0732233 5.41677 0.21967 5.12143C0.512563 4.82608 0.987437 4.82608 1.28033 5.12143L4.50051 8.2901L10.7167 2.09651C11.0095 1.80116 11.4844 1.80116 11.7773 2.09651C12.0702 2.39185 12.0702 2.87069 11.7773 3.16603L5.02456 9.90635C4.73368 10.1965 4.26583 10.1981 3.97308 9.90981Z'
              fill='#006908'
            />
          </svg>
        </div>{' '}
        <div>
          Background: Pure White
          <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M3.97308 9.90981L0.21967 6.19095C-0.0732233 5.89561 -0.0732233 5.41677 0.21967 5.12143C0.512563 4.82608 0.987437 4.82608 1.28033 5.12143L4.50051 8.2901L10.7167 2.09651C11.0095 1.80116 11.4844 1.80116 11.7773 2.09651C12.0702 2.39185 12.0702 2.87069 11.7773 3.16603L5.02456 9.90635C4.73368 10.1965 4.26583 10.1981 3.97308 9.90981Z'
              fill='#006908'
            />
          </svg>
        </div>
      </>
    );
  };
  const RenderTasg = () => {
    return (
      <div className='operation-contet-panel-info'>
        <Ctags></Ctags>
      </div>
    );
  };
  const RenderTasgWidthPhone = () => {
    return (
      <div className='operation-contet-panel-infoSM'>
        <Ctags></Ctags>
      </div>
    );
  };

  if (failFalg) {
    return (
      <div className='operation'>
        <Header />
        <div className={`operation-contet-error`}>
          <div className={`operation-contet-error-wrap`}>
            <div>{errInfo}</div>
            <img src={ICON_ERROR} alt='paied' sizes='' />
            <div className='redownload' onClick={reUpdate}>
              Re-upload
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='operation'>
      <Header />
      {/* 邮箱信息 */}

      <div className={`operation-contet  ${imgSrc ? 'operation-contet-col' : ''}`}>
        {imgSrc ? (
          <>
            <div className='operation-contet-preview'>
              <div className={`img ${isPayed ? '' : 'mask'}`}>
                <Image onClick={reUpdate} width={420} height={420} preview={false} src={imgSrc} />
              </div>
              {isPayed && (
                <div className='operation-contet-preview-btn'>
                  <div className='download' onClick={handlerOnOrder}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                      <path
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                        d='M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM9 9.58579V4C9 3.44772 8.55229 3 8 3C7.44772 3 7 3.44772 7 4V9.58579L4.70711 7.29289C4.31658 6.90237 3.68342 6.90237 3.29289 7.29289C2.90237 7.68342 2.90237 8.31658 3.29289 8.70711L7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L12.7071 8.70711C13.0976 8.31658 13.0976 7.68342 12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L9 9.58579Z'
                        fill='white'
                      />
                    </svg>
                    Download
                  </div>
                  <div className='redownload' onClick={reUpdate}>
                    Re-upload
                  </div>
                </div>
              )}
            </div>

            {isPayed ? (
              <div className='operation-contet-panel'>
                <div className='operation-contet-panel-paied'>
                  <p>
                    The photo has been sent to your email at
                    <br />
                    <span>{paiedInfo?.customer_details?.email}</span> for safekeeping.
                  </p>
                  <img src={ICON_PAIED} alt='paied' sizes='' />
                </div>
              </div>
            ) : (
              <div className='operation-contet-panel'>
                <RenderTasg></RenderTasg>
                <div className='operation-contet-panel-btn'>
                  <div className='download' onClick={handlerOnOrder}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
                      <path
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                        d='M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM9 9.58579V4C9 3.44772 8.55229 3 8 3C7.44772 3 7 3.44772 7 4V9.58579L4.70711 7.29289C4.31658 6.90237 3.68342 6.90237 3.29289 7.29289C2.90237 7.68342 2.90237 8.31658 3.29289 8.70711L7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L12.7071 8.70711C13.0976 8.31658 13.0976 7.68342 12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L9 9.58579Z'
                        fill='white'
                      />
                    </svg>
                    {!isPayed ? 'Download without watermark' : 'Download'}
                  </div>
                  <div className='redownload' onClick={reUpdate}>
                    Re-upload
                  </div>
                </div>
                <RenderTasgWidthPhone></RenderTasgWidthPhone>
              </div>
            )}
          </>
        ) : (
          <>
            <Upload {...props}>
              <RenderSatus />
            </Upload>

            <div className='operation-contet-split' />
            <div className='operation-contet-info'>
              {!failFalg && (
                <>
                  <div className='item'>
                    <div className='top'>
                      <div className='top-l'>
                        <div className='avator self1' />
                        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'>
                          <circle cx='11' cy='11' r='11' fill='#DF1B41' />
                          <line
                            x1='6.64276'
                            y1='6.54047'
                            x2='15.3932'
                            y2='15.2909'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                          />
                          <line
                            x1='6.50568'
                            y1='15.2909'
                            x2='15.2561'
                            y2='6.54043'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                          />
                        </svg>
                      </div>
                      <div className='top-r'>
                        <div className='avator self' />
                        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'>
                          <circle cx='11' cy='11' r='11' fill='#00A600' />
                          <path
                            d='M5.3512 11.4955L9.92391 16.0682L16.6485 7.72974'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='bottom'>Neutral facial expression</div>
                  </div>
                  <div className='item'>
                    <div className='top'>
                      <div className='top-l'>
                        <div className='avator self2' />
                        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'>
                          <circle cx='11' cy='11' r='11' fill='#DF1B41' />
                          <line
                            x1='6.64276'
                            y1='6.54047'
                            x2='15.3932'
                            y2='15.2909'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                          />
                          <line
                            x1='6.50568'
                            y1='15.2909'
                            x2='15.2561'
                            y2='6.54043'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                          />
                        </svg>
                      </div>
                      <div className='top-r'>
                        <div className='avator self' />
                        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'>
                          <circle cx='11' cy='11' r='11' fill='#00A600' />
                          <path
                            d='M5.3512 11.4955L9.92391 16.0682L16.6485 7.72974'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='bottom'>Use Frontal Photo</div>
                  </div>
                  <div className='item'>
                    <div className='top'>
                      <div className='top-l'>
                        <div className='avator self3' />
                        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'>
                          <circle cx='11' cy='11' r='11' fill='#DF1B41' />
                          <line
                            x1='6.64276'
                            y1='6.54047'
                            x2='15.3932'
                            y2='15.2909'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                          />
                          <line
                            x1='6.50568'
                            y1='15.2909'
                            x2='15.2561'
                            y2='6.54043'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                          />
                        </svg>
                      </div>
                      <div className='top-r'>
                        <div className='avator self' />
                        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'>
                          <circle cx='11' cy='11' r='11' fill='#00A600' />
                          <path
                            d='M5.3512 11.4955L9.92391 16.0682L16.6485 7.72974'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='bottom'>Only one person is allowed</div>
                  </div>
                  <div className='item'>
                    <div className='top'>
                      <div className='top-l'>
                        <div className='avator self4' />
                        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'>
                          <circle cx='11' cy='11' r='11' fill='#DF1B41' />
                          <line
                            x1='6.64276'
                            y1='6.54047'
                            x2='15.3932'
                            y2='15.2909'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                          />
                          <line
                            x1='6.50568'
                            y1='15.2909'
                            x2='15.2561'
                            y2='6.54043'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                          />
                        </svg>
                      </div>
                      <div className='top-r'>
                        <div className='avator self' />
                        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='none'>
                          <circle cx='11' cy='11' r='11' fill='#00A600' />
                          <path
                            d='M5.3512 11.4955L9.92391 16.0682L16.6485 7.72974'
                            stroke='white'
                            stroke-width='1.82655'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='bottom'>
                      Avoid facial decorations such as eyeglasses or hats (unless for religious reasons)
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
