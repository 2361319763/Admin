import DictTag from '@/components/DictTag';
import { getDictValueEnum } from '@/api/system/dict';
import {
  ActionType,
  ParamsType,
  ProColumns,
  ProTable,
  RequestData,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export type DataScopeFormProps = {
  onCancel: () => void;
  onSubmit: (values: React.Key[]) => void;
  open: boolean;
  params: ParamsType;
  request?: (
    params: Record<string, any>,
  ) => Promise<Partial<RequestData<API.System.User>>>;
};

const UserSelectorModal: React.FC<DataScopeFormProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [statusOptions, setStatusOptions] = useState<any>([]);

  useEffect(() => {
    getDictValueEnum('sys_normal_disable').then((data) => {
      setStatusOptions(data);
    });
  }, [props]);

  const handleOk = () => {
    props.onSubmit(selectedRowKeys);
  };
  const handleCancel = () => {
    props.onCancel();
  };

  const columns: ProColumns<API.System.User>[] = [
    {
      title: '用户编号',
      dataIndex: 'userId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '用户账号',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      valueType: 'text',
    },
    {
      title: '帐号状态',
      dataIndex: 'status',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: statusOptions,
      render: (_, record) => {
        return <DictTag enums={statusOptions} value={record.status} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInSearch: true,
      render: (_, record) => {
        return <span>{record.createTime.toString()} </span>;
      },
    },
  ];

  return (
    <Modal
      width={800}
      title="选择用户"
      open={props.open}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProTable<API.System.User>
        headerTitle="信息"
        actionRef={actionRef}
        rowKey="userId"
        key="userList"
        search={{
          labelWidth: 120,
        }}
        toolbar={{}}
        params={props.params}
        request={props.request}
        columns={columns}
        rowSelection={{
          onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
      />
    </Modal>
  );
};

export default UserSelectorModal;
