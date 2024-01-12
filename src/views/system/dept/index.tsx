import DictTag from '@/components/DictTag';
import {
  addDept,
  exportDept,
  getDeptList,
  getDeptListExcludeChild,
  removeDept,
  updateDept,
} from '@/api/system/dept';
import { getDictValueEnum } from '@/api/system/dict';
import { buildTreeData } from '@/utils/tree';
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { hasPermiOr } from '@/hooks/useAuth';
import type { FormInstance } from 'antd';
import { Button, Modal, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import UpdateForm from './edit';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.System.Dept) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addDept({ ...fields });
    hide();
    if (resp.code === 200) {
      message.success('添加成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.System.Dept) => {
  const hide = message.loading('正在更新');
  try {
    const resp = await updateDept(fields);
    hide();
    if (resp.code === 200) {
      message.success('更新成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.System.Dept[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await removeDept(
      selectedRows.map((row) => row.deptId).join(','),
    );
    hide();
    if (resp.code === 200) {
      message.success('删除成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const handleRemoveOne = async (selectedRow: API.System.Dept) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.deptId];
    const resp = await removeDept(params.join(','));
    hide();
    if (resp.code === 200) {
      message.success('删除成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

/**
 * 导出数据
 *
 *
 */
const handleExport = async () => {
  const hide = message.loading('正在导出');
  try {
    await exportDept();
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const DeptTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.System.Dept>();
  const [selectedRows, setSelectedRows] = useState<API.System.Dept[]>([]);

  const [deptTree, setDeptTree] = useState<any>([]);
  const [statusOptions, setStatusOptions] = useState<any>([]);

  useEffect(() => {
    getDictValueEnum('sys_normal_disable').then((data) => {
      setStatusOptions(data);
    });
  }, []);

  const columns: ProColumns<API.System.Dept>[] = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      valueType: 'text',
    },
    {
      title: '显示顺序',
      dataIndex: 'orderNum',
      valueType: 'text',
    },
    {
      title: '部门状态',
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
      width: '220px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          hidden={!hasPermiOr(['system:dept:edit'])}
          onClick={() => {
            getDeptListExcludeChild(record.deptId).then((res) => {
              if (res.code === 200) {
                let depts = buildTreeData(
                  res.data,
                  'deptId',
                  'deptName',
                  '',
                  '',
                  '',
                );
                if (depts.length === 0) {
                  depts = [
                    {
                      id: 0,
                      title: '无上级',
                      children: undefined,
                      key: 0,
                      value: 0,
                    },
                  ];
                }
                setDeptTree(depts);
                setModalVisible(true);
                setCurrentRow(record);
              } else {
                message.warning(res.msg);
              }
            });
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          hidden={!hasPermiOr(['system:dept:remove'])}
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: '确定删除该项吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemoveOne(record);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              },
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <div>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<API.System.Dept>
          headerTitle="信息"
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="deptId"
          key="deptList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!hasPermiOr(['system:dept:add'])}
              onClick={async () => {
                getDeptList().then((res) => {
                  if (res.code === 200) {
                    setDeptTree(
                      buildTreeData(res.data, 'deptId', 'deptName', '', '', ''),
                    );
                    setCurrentRow(undefined);
                    setModalVisible(true);
                  } else {
                    message.warning(res.msg);
                  }
                });
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
            <Button
              type="primary"
              key="remove"
              hidden={
                selectedRows?.length === 0 ||
                !hasPermiOr(['system:dept:remove'])
              }
              onClick={async () => {
                Modal.confirm({
                  title: '是否确认删除所选数据项?',
                  icon: <ExclamationCircleOutlined />,
                  content: '请谨慎操作',
                  async onOk() {
                    const success = await handleRemove(selectedRows);
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
              删除
            </Button>,
            <Button
              type="primary"
              key="export"
              hidden={!hasPermiOr(['system:dept:export'])}
              onClick={async () => {
                handleExport();
              }}
            >
              <PlusOutlined />
              导出
            </Button>,
          ]}
          request={(params) =>
            getDeptList({ ...params } as API.System.DeptListParams).then(
              (res) => {
                const result = {
                  data: buildTreeData(res.data, 'deptId', '', '', '', ''),
                  total: res.data.length,
                  success: true,
                };
                return result;
              },
            )
          }
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
        />
      </div>
      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择
              <a style={{ fontWeight: 600 }}>{selectedRows.length}</a>项
            </div>
          }
        >
          <Button
            key="remove"
            hidden={!hasPermiOr(['system:dept:del'])}
            onClick={async () => {
              Modal.confirm({
                title: '删除',
                content: '确定删除该项吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  const success = await handleRemove(selectedRows);
                  if (success) {
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }
                },
              });
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <UpdateForm
        onSubmit={async (values) => {
          let success = false;
          if (values.deptId) {
            success = await handleUpdate({ ...values } as API.System.Dept);
          } else {
            success = await handleAdd({ ...values } as API.System.Dept);
          }
          if (success) {
            setModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setCurrentRow(undefined);
        }}
        open={modalVisible}
        values={currentRow || {}}
        deptTree={deptTree}
        statusOptions={statusOptions}
      />
    </div>
  );
};

export default DeptTableList;
