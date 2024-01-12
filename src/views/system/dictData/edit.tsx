import { DictValueEnumObj } from '@/components/DictTag';
import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export type DataFormData = Record<string, unknown> &
  Partial<API.System.DictData>;

export type DataFormProps = {
  onCancel: (flag?: boolean, formVals?: DataFormData) => void;
  onSubmit: (values: DataFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.DictData>;
  statusOptions: DictValueEnumObj;
};

const DictDataForm: React.FC<DataFormProps> = (props) => {
  const [form] = Form.useForm();

  const { statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      dictCode: props.values.dictCode,
      dictSort: props.values.dictSort,
      dictLabel: props.values.dictLabel,
      dictValue: props.values.dictValue,
      dictType: props.values.dictType,
      cssClass: props.values.cssClass,
      listClass: props.values.listClass,
      isDefault: props.values.isDefault,
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
    props.onSubmit(values as DataFormData);
  };

  return (
    <Modal
      width={640}
      title="编辑字典数据"
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
          name="dictCode"
          label="字典编码"
          colProps={{ md: 24, xl: 24 }}
          placeholder="请输入字典编码"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: '请输入字典编码！',
            },
          ]}
        />
        <ProFormText
          name="dictType"
          label="字典类型"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入字典类型"
          disabled
          rules={[
            {
              required: false,
              message: '请输入字典类型！',
            },
          ]}
        />
        <ProFormText
          name="dictLabel"
          label="字典标签"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入字典标签"
          rules={[
            {
              required: false,
              message: '请输入字典标签！',
            },
          ]}
        />
        <ProFormText
          name="dictValue"
          label="字典键值"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入字典键值"
          rules={[
            {
              required: false,
              message: '请输入字典键值！',
            },
          ]}
        />
        <ProFormText
          name="cssClass"
          label="样式属性"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入样式属性"
          rules={[
            {
              required: false,
              message: '请输入样式属性！',
            },
          ]}
        />
        <ProFormSelect
          name="listClass"
          label="回显样式"
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入回显样式"
          valueEnum={{
            default: '默认',
            primary: '主要',
            success: '成功',
            info: '信息',
            warning: '警告',
            danger: '危险',
          }}
          rules={[
            {
              required: false,
              message: '请输入回显样式！',
            },
          ]}
        />
        <ProFormDigit
          name="dictSort"
          label="字典排序"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入字典排序"
          rules={[
            {
              required: false,
              message: '请输入字典排序！',
            },
          ]}
        />
        <ProFormRadio.Group
          name="isDefault"
          label="是否默认"
          valueEnum={{
            Y: '是',
            N: '否',
          }}
          initialValue={'N'}
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入是否默认"
          rules={[
            {
              required: false,
              message: '请输入是否默认！',
            },
          ]}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label="状态"
          initialValue={'0'}
          colProps={{ md: 12, xl: 24 }}
          placeholder="请输入状态"
          rules={[
            {
              required: false,
              message: '请输入状态！',
            },
          ]}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          colProps={{ md: 24, xl: 24 }}
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

export default DictDataForm;
