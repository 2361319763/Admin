import DictTag from '@/components/DictTag';
import {
  addJob,
  exportJob,
  getJobList,
  removeJob,
  runJob,
  updateJob,
} from '@/api/monitor/job';
import { getDictSelectOption, getDictValueEnum } from '@/api/system/dict';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { hasPermiOr } from '@/hooks/useAuth';
import { Button, Dropdown, FormInstance, Modal, Space, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import DetailForm from './detail';
import UpdateForm from './edit';

/**
 * 定时任务调度 List Page
 *
 * @author whiteshader
 * @date 2023-02-07
 */

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.Monitor.Job) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addJob({ ...fields });
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
const handleUpdate = async (fields: API.Monitor.Job) => {
  const hide = message.loading('正在更新');
  try {
    const resp = await updateJob(fields);
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
const handleRemove = async (selectedRows: API.Monitor.Job[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await removeJob(
      selectedRows.map((row) => row.jobId).join(','),
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

const handleRemoveOne = async (selectedRow: API.Monitor.Job) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.jobId];
    const resp = await removeJob(params.join(','));
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
 */
const handleExport = async () => {
  const hide = message.loading('正在导出');
  try {
    await exportJob();
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const JobTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Monitor.Job>();
  const [selectedRows, setSelectedRows] = useState<API.Monitor.Job[]>([]);

  const [jobGroupOptions, setJobGroupOptions] = useState<any>([]);
  const [statusOptions, setStatusOptions] = useState<any>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getDictSelectOption('sys_job_group').then((data) => {
      setJobGroupOptions(data);
    });
    getDictValueEnum('sys_normal_disable').then((data) => {
      setStatusOptions(data);
    });
  }, []);

  const columns: ProColumns<API.Monitor.Job>[] = [
    {
      title: '任务编号',
      dataIndex: 'jobId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      valueType: 'text',
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setDetailModalVisible(true);
              setCurrentRow(record);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      valueType: 'text',
      valueEnum: jobGroupOptions,
      render: (_, record) => {
        return <DictTag options={jobGroupOptions} value={record.jobGroup} />;
      },
    },
    {
      title: '调用目标字符串',
      dataIndex: 'invokeTarget',
      valueType: 'textarea',
    },
    {
      title: 'cron执行表达式',
      dataIndex: 'cronExpression',
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
      title: '操作',
      dataIndex: 'option',
      width: '220px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          icon={<EditOutlined />}
          hidden={!hasPermiOr(['monitor:job:edit'])}
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
          icon={<DeleteOutlined />}
          hidden={!hasPermiOr(['monitor:job:remove'])}
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
        <Dropdown
          key="more"
          menu={{
            items: [
              {
                label: '执行一次',
                key: 'runOnce',
              },
              {
                label: '详细',
                key: 'detail',
              },
              {
                label: '历史',
                key: 'log',
              },
            ],
            onClick: ({ key }) => {
              if (key === 'runOnce') {
                Modal.confirm({
                  title: '警告',
                  content: '确认要立即执行一次？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await runJob(record.jobId, record.jobGroup);
                    if (success) {
                      message.success('执行成功');
                    }
                  },
                });
              } else if (key === 'detail') {
                setDetailModalVisible(true);
                setCurrentRow(record);
              } else if (key === 'log') {
                navigate(`/monitor/job-log/index/${record.jobId}`);
              }
            },
          }}
        >
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            <Space>
              <DownOutlined />
              更多
            </Space>
          </a>
        </Dropdown>,
      ],
    },
  ];

  return (
    <div>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<API.Monitor.Job>
          headerTitle="信息"
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="jobId"
          key="jobList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!hasPermiOr(['monitor:job:add'])}
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
              hidden={
                selectedRows?.length === 0 ||
                !hasPermiOr(['monitor:job:remove'])
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
              hidden={!hasPermiOr(['monitor:job:export'])}
              onClick={async () => {
                handleExport();
              }}
            >
              <PlusOutlined />
              导出
            </Button>,
          ]}
          request={(params) =>
            getJobList({ ...params } as API.Monitor.JobListParams).then(
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
            hidden={!hasPermiOr(['monitor:job:del'])}
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
          if (values.jobId) {
            success = await handleUpdate({ ...values } as API.Monitor.Job);
          } else {
            success = await handleAdd({ ...values } as API.Monitor.Job);
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
        jobGroupOptions={jobGroupOptions || {}}
        statusOptions={statusOptions}
      />
      <DetailForm
        onCancel={() => {
          setDetailModalVisible(false);
          setCurrentRow(undefined);
        }}
        open={detailModalVisible}
        values={currentRow || {}}
        statusOptions={statusOptions}
      />
    </div>
  );
};

export default JobTableList;
