import { DictValueEnumObj } from '@/components/DictTag';
import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTimePicker,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export type LogininforFormData = Record<string, unknown> &
  Partial<API.Monitor.Logininfor>;

export type LogininforFormProps = {
  onCancel: (flag?: boolean, formVals?: LogininforFormData) => void;
  onSubmit: (values: LogininforFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.Monitor.Logininfor>;
  statusOptions: DictValueEnumObj;
};

const LogininforForm: React.FC<LogininforFormProps> = (props) => {
  const [form] = Form.useForm();

  const { statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      infoId: props.values.infoId,
      userName: props.values.userName,
      ipaddr: props.values.ipaddr,
      loginLocation: props.values.loginLocation,
      browser: props.values.browser,
      os: props.values.os,
      status: props.values.status,
      msg: props.values.msg,
      loginTime: props.values.loginTime,
    });
  }, [form, props]);

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };
  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit(values as LogininforFormData);
  };

  return (
    <Modal
      width={640}
      title="编辑系统访问记录"
      open={props.open}
      destroyOnClose
      forceRender
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm
        form={form}
        grid={true}
        layout="horizontal"
        onFinish={handleFinish}
      >
        <ProFormDigit
          name="infoId"
          label="访问编号"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入访问编号"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: '请输入访问编号！',
            },
          ]}
        />
        <ProFormText
          name="userName"
          label="用户账号"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入用户账号"
          rules={[
            {
              required: false,
              message: '请输入用户账号！',
            },
          ]}
        />
        <ProFormText
          name="ipaddr"
          label="登录IP地址"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入登录IP地址"
          rules={[
            {
              required: false,
              message: '请输入登录IP地址！',
            },
          ]}
        />
        <ProFormText
          name="loginLocation"
          label="登录地点"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入登录地点"
          rules={[
            {
              required: false,
              message: '请输入登录地点！',
            },
          ]}
        />
        <ProFormText
          name="browser"
          label="浏览器类型"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入浏览器类型"
          rules={[
            {
              required: false,
              message: '请输入浏览器类型！',
            },
          ]}
        />
        <ProFormText
          name="os"
          label="操作系统"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入操作系统"
          rules={[
            {
              required: false,
              message: '请输入操作系统！',
            },
          ]}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label="登录状态"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入登录状态"
          rules={[
            {
              required: false,
              message: '请输入登录状态！',
            },
          ]}
        />
        <ProFormText
          name="msg"
          label="提示消息"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入提示消息"
          rules={[
            {
              required: false,
              message: '请输入提示消息！',
            },
          ]}
        />
        <ProFormTimePicker
          name="loginTime"
          label="访问时间"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入访问时间"
          rules={[
            {
              required: false,
              message: '请输入访问时间！',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default LogininforForm;
