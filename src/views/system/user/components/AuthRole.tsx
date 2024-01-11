import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export type FormValueType = any & Partial<API.System.Dept>;

export type AuthRoleFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  open: boolean;
  roleIds: number[];
  roles: string[];
};

const AuthRoleForm: React.FC<AuthRoleFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldValue('roleIds', props.roleIds);
  },[form, props]);

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
  };
  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit(values as FormValueType);
  };

  return (
    <Modal
      width={640}
      title="分配角色"
      open={props.open}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm
        grid={true}
        form={form}
        layout="horizontal"
        onFinish={handleFinish}
        submitter={false}
        initialValues={{
          roleIds: [],
        }}
      >
        <ProFormSelect
          name="roleIds"
          mode="multiple"
          label="角色"
          options={props.roles}
          placeholder="请选择角色"
          rules={[{ required: true, message: '请选择角色!' }]}
        />
      </ProForm>
    </Modal>
  );
};

export default AuthRoleForm;
