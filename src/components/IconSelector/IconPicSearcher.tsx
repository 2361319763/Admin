import * as AntdIcons from '@ant-design/icons';
import { Modal, Progress, Result, Spin, Tooltip, Upload } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import './style.module.less';

const allIcons: { [key: string]: any } = AntdIcons;

const { Dragger } = Upload;
interface AntdIconClassifier {
  load: () => void;
  predict: (imgEl: HTMLImageElement) => void;
}
declare global {
  interface Window {
    antdIconClassifier: AntdIconClassifier;
  }
}

interface PicSearcherState {
  loading: boolean;
  modalOpen: boolean;
  icons: iconObject[];
  fileList: any[];
  error: boolean;
  modelLoaded: boolean;
}

interface iconObject {
  type: string;
  score: number;
}

const PicSearcher: React.FC = () => {
  const [state, setState] = useState<PicSearcherState>({
    loading: false,
    modalOpen: false,
    icons: [],
    fileList: [],
    error: false,
    modelLoaded: false,
  });
  const predict = (imgEl: HTMLImageElement) => {
    try {
      let icons: any[] = window.antdIconClassifier.predict(imgEl);
      if (gtag && icons.length) {
        gtag('event', 'icon', {
          event_category: 'search-by-image',
          event_label: icons[0].className,
        });
      }
      icons = icons.map((i) => ({
        score: i.score,
        type: i.className.replace(/\s/g, '-'),
      }));
      setState((prev) => ({ ...prev, loading: false, error: false, icons }));
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: true }));
    }
  };
  // eslint-disable-next-line class-methods-use-this
  const toImage = (url: string) =>
    new Promise((resolve) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
      img.onload = () => {
        resolve(img);
      };
    });

  const uploadFile = useCallback((file: File) => {
    setState((prev) => ({ ...prev, loading: true }));
    const reader = new FileReader();
    reader.onload = () => {
      toImage(reader.result as string).then(predict);
      setState((prev) => ({
        ...prev,
        fileList: [
          { uid: 1, name: file.name, status: 'done', url: reader.result },
        ],
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const onPaste = useCallback((event: ClipboardEvent) => {
    const items = event.clipboardData && event.clipboardData.items;
    let file = null;
    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.includes('image')) {
          file = items[i].getAsFile();
          break;
        }
      }
    }
    if (file) {
      uploadFile(file);
    }
  }, []);
  const toggleModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      modalOpen: !prev.modalOpen,
      fileList: [],
      icons: [],
    }));
    if (!localStorage.getItem('disableIconTip')) {
      localStorage.setItem('disableIconTip', 'true');
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.onload = async () => {
      await window.antdIconClassifier.load();
      setState((prev) => ({ ...prev, modelLoaded: true }));
      document.addEventListener('paste', onPaste);
    };
    script.src =
      'https://cdn.jsdelivr.net/gh/lewis617/antd-icon-classifier@0.0/dist/main.js';
    document.head.appendChild(script);
    setState((prev) => ({
      ...prev,
    }));
    return () => {
      document.removeEventListener('paste', onPaste);
    };
  }, []);

  return (
    <div className="iconPicSearcher">
      <AntdIcons.CameraOutlined
        className="icon-pic-btn"
        onClick={toggleModal}
      />
      <Modal
        title="信息"
        open={state.modalOpen}
        onCancel={toggleModal}
        footer={null}
      >
        {state.modelLoaded || (
          <Spin spinning={!state.modelLoaded} tip="神经网络模型加载中...">
            <div style={{ height: 100 }} />
          </Spin>
        )}
        {state.modelLoaded && (
          <Dragger
            accept="image/jpeg, image/png"
            listType="picture"
            customRequest={(o) => uploadFile(o.file as File)}
            fileList={state.fileList}
            showUploadList={{ showPreviewIcon: false, showRemoveIcon: false }}
          >
            <p className="ant-upload-drag-icon">
              <AntdIcons.InboxOutlined />
            </p>
            <p className="ant-upload-text">点击/拖拽/粘贴上传图片</p>
            <p className="ant-upload-hint">
              我们会通过上传的图片进行匹配，得到最相似的图标
            </p>
          </Dragger>
        )}
        <Spin spinning={state.loading} tip="匹配中...">
          <div className="icon-pic-search-result">
            {state.icons.length > 0 && (
              <div className="result-tip">为您匹配到以下图标：</div>
            )}
            <table>
              {state.icons.length > 0 && (
                <thead>
                  <tr>
                    <th className="col-icon">图标</th>
                    <th>匹配度</th>
                  </tr>
                </thead>
              )}
              <tbody>
                {state.icons.map((icon) => {
                  const { type } = icon;
                  const iconName = `${type
                    .split('-')
                    .map((str) => `${str[0].toUpperCase()}${str.slice(1)}`)
                    .join('')}Outlined`;
                  return (
                    <tr key={iconName}>
                      <td className="col-icon">
                        <Tooltip title={icon.type} placement="right">
                          {React.createElement(allIcons[iconName])}
                        </Tooltip>
                      </td>
                      <td>
                        <Progress percent={Math.ceil(icon.score * 100)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {state.error && (
              <Result status="500" title="503" subTitle="识别服务暂不可用" />
            )}
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default PicSearcher;
