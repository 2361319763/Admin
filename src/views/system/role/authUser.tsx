import DictTag from '@/components/DictTag';
import { HttpResult } from '@/enums/httpEnum';
import { getDictValueEnum } from '@/api/system/dict';
import {
  allocatedUserList,
  authUserCancel,
  authUserCancelAll,
  authUserSelectAll,
  unallocatedUserList,
} from '@/api/system/role';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import UserSelectorModal from './components/UserSelectorModal';
import { hasPermiOr } from '@/hooks/useAuth';

/**
 * 删除节点
 *
 * @param selectedRows
 */
const cancelAuthUserAll = async (
  roleId: string,
  selectedRows: API.System.User[],
) => {
  const hide = message.loading('正在取消授权');
  if (!selectedRows) return true;
  try {
    const userIds = selectedRows.map((row) => row.userId).join(',');
    const resp = await authUserCancelAll({ roleId, userIds });
    hide();
    if (resp.code === 200) {
      message.success('取消授权成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('取消授权失败，请重试');
    return false;
  }
};

const cancelAuthUser = async (roleId: string, userId: number) => {
  const hide = message.loading('正在取消授权');
  try {
    const resp = await authUserCancel({ userId, roleId });
    hide();
    if (resp.code === 200) {
      message.success('取消授权成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('取消授权失败，请重试');
    return false;
  }
};

const AuthUserTableList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<API.System.User[]>([]);
  const [statusOptions, setStatusOptions] = useState<any>([]);

  const params = useParams();
  const navigate = useNavigate();
  
  if (params.id === undefined) {
    navigate(-1);
  }
  const roleId = params.value || '0';

  useEffect(() => {
    getDictValueEnum('sys_normal_disable').then((data) => {
      setStatusOptions(data);
    });
  }, []);

  const columns: ProColumns<API.System.User>[] = [
    {
      title: '用户编号',
      dataIndex: 'deptId',
      valueType: 'text',
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
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (_, record) => {
        return <span>{record.createTime.toString()} </span>;
      },
      hideInSearch: true,
    },
    {
      title: '帐号状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
      render: (_, record) => {
        return <DictTag enums={statusOptions} value={record.status} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: '60px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          danger
          icon={<DeleteOutlined />}
          key="remove"
          hidden={!hasPermiOr(['system:role:remove'])}
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: '确认要取消该用户' + record.userName + '"角色授权吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await cancelAuthUser(roleId, record.userId);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              },
            });
          }}
        >
          取消授权
        </Button>,
      ],
    },
  ];

  return (
    <div>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<API.System.User>
          headerTitle="信息"
          actionRef={actionRef}
          rowKey="userId"
          key="userList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!hasPermiOr(['system:role:add'])}
              onClick={async () => {
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 添加用户
            </Button>,
            <Button
              type="primary"
              key="remove"
              hidden={
                selectedRows?.length === 0 ||
                !hasPermiOr(['system:role:remove'])
              }
              onClick={async () => {
                Modal.confirm({
                  title: '是否确认删除所选数据项?',
                  icon: <ExclamationCircleOutlined />,
                  content: '请谨慎操作',
                  async onOk() {
                    const success = await cancelAuthUserAll(
                      roleId,
                      selectedRows,
                    );
                    if (success) {
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                    }
                  },
                  onCancel() {},
                });
              }}
            >
              <DeleteOutlined />
              批量取消授权
            </Button>,
            <Button
              type="primary"
              key="back"
              onClick={async () => {
                history.back();
              }}
            >
              <RollbackOutlined />
              返回
            </Button>,
          ]}
          request={(params) =>
            allocatedUserList({
              ...params,
              roleId,
            } as API.System.RoleListParams).then((res) => {
              const result = {
                data: res.rows,
                total: res.total,
                success: true,
              };
              return result;
            })
          }
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
        />
      </div>
      <UserSelectorModal
        open={modalVisible}
        onSubmit={(values: React.Key[]) => {
          const userIds = values.join(',');
          if (userIds === '') {
            message.warning('请选择要分配的用户');
            return;
          }
          authUserSelectAll({ roleId: roleId, userIds: userIds }).then(
            (resp) => {
              if (resp.code === HttpResult.SUCCESS) {
                message.success('更新成功！');
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              } else {
                message.warning(resp.msg);
              }
            },
          );
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
        params={{ roleId }}
        request={(params) =>
          unallocatedUserList({ ...params } as API.System.RoleListParams).then(
            (res) => {
              const result = {
                data: res.rows,
                total: res.rows.length,
                success: true,
              };
              return result;
            },
          )
        }
      />
    </div>
  );
};

export default AuthUserTableList;
