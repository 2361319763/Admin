import DictTag from '@/components/DictTag';
import {
  getDictType,
  getDictTypeOptionSelect,
  getDictValueEnum,
} from '@/api/system/dict';
import {
  addDictData,
  exportDictData,
  getDictDataList,
  removeDictData,
  updateDictData,
} from '@/api/system/dictdata';
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
import { useNavigate, useParams } from 'react-router-dom';
import type { FormInstance } from 'antd';
import { Button, Modal, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import UpdateForm from './edit';
import { hasPermiOr } from '@/hooks/useAuth';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.System.DictData) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addDictData({ ...fields });
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
const handleUpdate = async (fields: API.System.DictData) => {
  const hide = message.loading('正在更新');
  try {
    const resp = await updateDictData(fields);
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
const handleRemove = async (selectedRows: API.System.DictData[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await removeDictData(
      selectedRows.map((row) => row.dictCode).join(','),
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

const handleRemoveOne = async (selectedRow: API.System.DictData) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.dictCode];
    const resp = await removeDictData(params.join(','));
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
    await exportDictData();
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

export type DictTypeArgs = {
  id: string;
};

const DictDataTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [dictId, setDictId] = useState<string>('');
  const [dictType, setDictType] = useState<string>('');

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.System.DictData>();
  const [selectedRows, setSelectedRows] = useState<API.System.DictData[]>([]);

  const [dictTypeOptions, setDictTypeOptions] = useState<any>([]);
  const [statusOptions, setStatusOptions] = useState<any>([]);


  const params = useParams();
  const navigate = useNavigate();

  if (params.id === undefined) {
    navigate('/system/dict');
  }
  const id = params.id || '0';

  useEffect(() => {
    if (dictId !== id) {
      setDictId(id);
      getDictTypeOptionSelect().then((res) => {
        if (res.code === 200) {
          const opts: any = {};
          res.data.forEach((item: any) => {
            opts[item.dictType] = item.dictName;
          });
          setDictTypeOptions(opts);
        }
      });
      getDictValueEnum('sys_normal_disable').then((data) => {
        setStatusOptions(data);
      });
      getDictType(id).then((res) => {
        if (res.code === 200) {
          setDictType(res.data.dictType);
          formTableRef.current?.setFieldsValue({
            dictType: res.data.dictType,
          });
          actionRef.current?.reloadAndRest?.();
        } else {
          message.error(res.msg);
        }
      });
    }
  }, [dictId, dictType, params]);

  const columns: ProColumns<API.System.DictData>[] = [
    {
      title: '字典编码',
      dataIndex: 'dictCode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
      valueType: 'text',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      valueType: 'select',
      hideInTable: true,
      valueEnum: dictTypeOptions,
      search: {
        transform: (value) => {
          setDictType(value);
          return value;
        },
      },
    },
    {
      title: '字典键值',
      dataIndex: 'dictValue',
      valueType: 'text',
    },
    {
      title: '字典排序',
      dataIndex: 'dictSort',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
      render: (_, record) => {
        return <DictTag enums={statusOptions} value={record.status} />;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (_, record) => {
        return <span>{record.createTime.toString()} </span>;
      },
      search: {
        transform: (value) => {
          return {
            'params[beginTime]': value[0],
            'params[endTime]': value[1],
          };
        },
      },
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
          hidden={!hasPermiOr(['system:data:edit'])}
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
          hidden={!hasPermiOr(['system:data:remove'])}
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
        <ProTable<API.System.DictData>
          headerTitle="信息"
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="dictCode"
          key="dataList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!hasPermiOr(['system:data:add'])}
              onClick={async () => {
                setCurrentRow({
                  dictType: dictType,
                  isDefault: 'N',
                  status: '0',
                } as API.System.DictData);
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
            <Button
              type="primary"
              key="remove"
              hidden={
                selectedRows?.length === 0 ||
                !hasPermiOr(['system:data:remove'])
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
              hidden={!hasPermiOr(['system:data:export'])}
              onClick={async () => {
                handleExport();
              }}
            >
              <PlusOutlined />
              导出
            </Button>,
          ]}
          request={(params) =>
            getDictDataList({
              ...params,
              dictType,
            } as API.System.DictDataListParams).then((res) => {
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
            hidden={!hasPermiOr(['system:data:del'])}
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
          if (values.dictCode) {
            success = await handleUpdate({ ...values } as API.System.DictData);
          } else {
            success = await handleAdd({ ...values } as API.System.DictData);
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
        statusOptions={statusOptions}
      />
    </div>
  );
};

export default DictDataTableList;
