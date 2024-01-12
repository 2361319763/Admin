import DictTag from '@/components/DictTag';
import {
  addConfig,
  exportConfig,
  getConfigList,
  refreshConfigCache,
  removeConfig,
  updateConfig,
} from '@/api/system/config';
import { getDictValueEnum } from '@/api/system/dict';
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import type { FormInstance } from 'antd';
import { Button, Modal, message } from 'antd';
import { hasPermiOr } from '@/hooks/useAuth';
import React, { useEffect, useRef, useState } from 'react';
import UpdateForm from './edit';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.System.Config) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addConfig({ ...fields });
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
const handleUpdate = async (fields: API.System.Config) => {
  const hide = message.loading('正在更新');
  try {
    const resp = await updateConfig(fields);
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
const handleRemove = async (selectedRows: API.System.Config[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await removeConfig(
      selectedRows.map((row) => row.configId).join(','),
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

const handleRemoveOne = async (selectedRow: API.System.Config) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.configId];
    const resp = await removeConfig(params.join(','));
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
    await exportConfig();
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const handleRefreshCache = async () => {
  const hide = message.loading('正在刷新');
  try {
    await refreshConfigCache();
    hide();
    message.success('刷新成功');
    return true;
  } catch (error) {
    hide();
    message.error('刷新失败，请重试');
    return false;
  }
};

const ConfigTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.System.Config>();
  const [selectedRows, setSelectedRows] = useState<API.System.Config[]>([]);

  const [configTypeOptions, setConfigTypeOptions] = useState<any>([]);

  useEffect(() => {
    getDictValueEnum('sys_yes_no').then((data) => {
      setConfigTypeOptions(data);
    });
  }, []);

  const columns: ProColumns<API.System.Config>[] = [
    {
      title: '参数主键',
      dataIndex: 'configId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '参数名称',
      dataIndex: 'configName',
      valueType: 'text',
    },
    {
      title: '参数键名',
      dataIndex: 'configKey',
      valueType: 'text',
    },
    {
      title: '参数键值',
      dataIndex: 'configValue',
      valueType: 'textarea',
    },
    {
      title: '系统内置',
      dataIndex: 'configType',
      valueType: 'select',
      valueEnum: configTypeOptions,
      render: (_, record) => {
        return <DictTag enums={configTypeOptions} value={record.configType} />;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: '120px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          hidden={!hasPermiOr(['system:config:edit'])}
          onClick={() => {
            setModalVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          hidden={!hasPermiOr(['system:config:remove'])}
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
        <ProTable<API.System.Config>
          headerTitle="信息"
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="configId"
          key="configList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!hasPermiOr(['system:config:add'])}
              onClick={async () => {
                setCurrentRow(undefined);
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
            <Button
              type="primary"
              key="remove"
              danger
              hidden={
                selectedRows?.length === 0 ||
                !hasPermiOr(['system:config:remove'])
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
              hidden={!hasPermiOr(['system:config:export'])}
              onClick={async () => {
                handleExport();
              }}
            >
              <DownloadOutlined />
              导出
            </Button>,
            <Button
              type="primary"
              key="refresh"
              danger
              hidden={!hasPermiOr(['system:config:remove'])}
              onClick={async () => {
                handleRefreshCache();
              }}
            >
              <ReloadOutlined />
              刷新缓存
            </Button>,
          ]}
          request={(params) =>
            getConfigList({ ...params } as API.System.ConfigListParams).then(
              (res) => {
                const result = {
                  data: res.rows,
                  total: res.total,
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
            hidden={!hasPermiOr(['system:config:del'])}
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
          if (values.configId) {
            success = await handleUpdate({ ...values } as API.System.Config);
          } else {
            success = await handleAdd({ ...values } as API.System.Config);
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
        configTypeOptions={configTypeOptions}
      />
    </div>
  );
};

export default ConfigTableList;
