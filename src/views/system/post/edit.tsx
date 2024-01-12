import { DictValueEnumObj } from '@/components/DictTag';
import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export type PostFormData = Record<string, unknown> & Partial<API.System.Post>;

export type PostFormProps = {
  onCancel: (flag?: boolean, formVals?: PostFormData) => void;
  onSubmit: (values: PostFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.Post>;
  statusOptions: DictValueEnumObj;
};

const PostForm: React.FC<PostFormProps> = (props) => {
  const [form] = Form.useForm();

  const { statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      postId: props.values.postId,
      postCode: props.values.postCode,
      postName: props.values.postName,
      postSort: props.values.postSort,
      status: props.values.status,
      createBy: props.values.createBy,
      createTime: props.values.createTime,
      updateBy: props.values.updateBy,
      updateTime: props.values.updateTime,
      remark: props.values.remark,
    });
  }, [form, props]);

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
  };
  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit(values as PostFormData);
  };

  return (
    <Modal
      width={640}
      title="编辑岗位信息"
      open={props.open}
      forceRender
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm
        form={form}
        grid={true}
        submitter={false}
        layout="horizontal"
        onFinish={handleFinish}
      >
        <ProFormDigit
          name="postId"
          label="岗位编号"
          placeholder="请输入岗位编号"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: '请输入岗位编号！',
            },
          ]}
        />
        <ProFormText
          name="postName"
          label="岗位名称"
          placeholder="请输入岗位名称"
          rules={[
            {
              required: true,
              message: '请输入岗位名称！',
            },
          ]}
        />
        <ProFormText
          name="postCode"
          label="岗位编码"
          placeholder="请输入岗位编码"
          rules={[
            {
              required: true,
              message: '请输入岗位编码！',
            },
          ]}
        />
        <ProFormDigit
          name="postSort"
          label="显示顺序"
          placeholder="请输入显示顺序"
          rules={[
            {
              required: true,
              message: '请输入显示顺序！',
            },
          ]}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label="状态"
          placeholder="请输入状态"
          rules={[
            {
              required: true,
              message: '请输入状态！',
            },
          ]}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          placeholder="请输入备注"
          rules={[
            {
              required: false,
              message: '请输入备注！',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default PostForm;
