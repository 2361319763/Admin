import { DictValueEnumObj } from '@/components/DictTag';
import { getValueEnumLabel } from '@/utils/options';
import { Button, Descriptions, Modal } from 'antd';
import React, { useEffect } from 'react';

export type OperlogFormValueType = Record<string, unknown> &
  Partial<API.Monitor.Job>;

export type OperlogFormProps = {
  onCancel: (flag?: boolean, formVals?: OperlogFormValueType) => void;
  open: boolean;
  values: Partial<API.Monitor.Job>;
  statusOptions: DictValueEnumObj;
};

const OperlogForm: React.FC<OperlogFormProps> = (props) => {
  const { values, statusOptions } = props;

  useEffect(() => {}, [props]);

  const misfirePolicy: any = {
    '0': '默认策略',
    '1': '立即执行',
    '2': '执行一次',
    '3': '放弃执行',
  };

  const handleCancel = () => {
    props.onCancel();
  };

  return (
    <Modal
      width={800}
      title="操作日志详细信息"
      open={props.open}
      destroyOnClose
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          关闭
        </Button>,
      ]}
    >
      <Descriptions column={24}>
        <Descriptions.Item span={12} label="任务编号">
          {values.jobId}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="任务名称">
          {values.jobName}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="任务组名">
          {values.jobGroup}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="是否并发执行">
          {values.concurrent === '1' ? '禁止' : '允许'}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="计划执行错误策略">
          {misfirePolicy[values.misfirePolicy ? values.misfirePolicy : '0']}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="创建时间">
          {values.createTime?.toString()}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="状态">
          {getValueEnumLabel(statusOptions, values.status, '未知')}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="下次执行时间">
          {values.nextValidTime}
        </Descriptions.Item>
        <Descriptions.Item span={24} label="cron执行表达式">
          {values.cronExpression}
        </Descriptions.Item>
        <Descriptions.Item span={24} label="调用目标字符串">
          {values.invokeTarget}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default OperlogForm;
