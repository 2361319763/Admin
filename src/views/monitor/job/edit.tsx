import { DictOptionType, DictValueEnumObj } from '@/components/DictTag';
import {
  ProForm,
  ProFormCaptcha,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

/**
 * 定时任务调度 Edit Form
 *
 * @author whiteshader
 * @date 2023-02-07
 */

export type JobFormData = Record<string, unknown> & Partial<API.Monitor.Job>;

export type JobFormProps = {
  onCancel: (flag?: boolean, formVals?: JobFormData) => void;
  onSubmit: (values: JobFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.Monitor.Job>;
  jobGroupOptions: DictOptionType[];
  statusOptions: DictValueEnumObj;
};

const JobForm: React.FC<JobFormProps> = (props) => {
  const [form] = Form.useForm();
  const { jobGroupOptions, statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      jobId: props.values.jobId,
      jobName: props.values.jobName,
      jobGroup: props.values.jobGroup,
      invokeTarget: props.values.invokeTarget,
      cronExpression: props.values.cronExpression,
      misfirePolicy: props.values.misfirePolicy,
      concurrent: props.values.concurrent,
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
    form.resetFields();
  };
  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit(values as JobFormData);
  };

  return (
    <Modal
      width={640}
      title="编辑定时任务调度"
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
          name="jobId"
          label="任务编号"
          colProps={{ md: 24 }}
          placeholder="请输入任务编号"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: '请输入任务编号！',
            },
          ]}
        />
        <ProFormText
          name="jobName"
          label="任务名称"
          colProps={{ md: 24 }}
          placeholder="请输入任务名称"
          rules={[
            {
              required: false,
              message: '请输入任务名称！',
            },
          ]}
        />
        <ProFormSelect
          name="jobGroup"
          options={jobGroupOptions}
          label="任务组名"
          colProps={{ md: 24 }}
          placeholder="请输入任务组名"
          rules={[
            {
              required: false,
              message: '请输入任务组名！',
            },
          ]}
        />
        <ProFormTextArea
          name="invokeTarget"
          label="调用目标字符串"
          colProps={{ md: 24 }}
          placeholder="请输入调用目标字符串"
          rules={[
            {
              required: true,
              message: '请输入调用目标字符串！',
            },
          ]}
        />
        <ProFormCaptcha
          name="cronExpression"
          label="cron执行表达式"
          captchaTextRender={() => '生成表达式'}
          onGetCaptcha={() => {
            // form.setFieldValue('cronExpression', '0/20 * * * * ?');
            return new Promise((resolve, reject) => {
              reject();
            });
          }}
        />
        <ProFormRadio.Group
          name="misfirePolicy"
          label="计划执行错误策略"
          colProps={{ md: 24 }}
          placeholder="请输入计划执行错误策略"
          valueEnum={{
            0: '立即执行',
            1: '执行一次',
            3: '放弃执行',
          }}
          rules={[
            {
              required: false,
              message: '请输入计划执行错误策略！',
            },
          ]}
          fieldProps={{
            optionType: 'button',
            buttonStyle: 'solid',
          }}
        />
        <ProFormRadio.Group
          name="concurrent"
          label="是否并发执行"
          colProps={{ md: 24 }}
          placeholder="请输入是否并发执行"
          valueEnum={{
            0: '允许',
            1: '禁止',
          }}
          rules={[
            {
              required: false,
              message: '请输入是否并发执行！',
            },
          ]}
          fieldProps={{
            optionType: 'button',
            buttonStyle: 'solid',
          }}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label="状态"
          colProps={{ md: 24 }}
          placeholder="请输入状态"
          rules={[
            {
              required: false,
              message: '请输入状态！',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default JobForm;
