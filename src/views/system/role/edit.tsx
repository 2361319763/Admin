import { DictValueEnumObj } from '@/components/DictTag';
import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Modal, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';

export type RoleFormData = Record<string, unknown> & Partial<API.System.Role>;

export type RoleFormProps = {
  onCancel: (flag?: boolean, formVals?: RoleFormData) => void;
  onSubmit: (values: RoleFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.Role>;
  menuTree: DataNode[];
  menuCheckedKeys: string[];
  statusOptions: DictValueEnumObj;
};

const RoleForm: React.FC<RoleFormProps> = (props) => {
  const [form] = Form.useForm();
  const { menuTree, menuCheckedKeys } = props;
  const [menuIds, setMenuIds] = useState<string[]>([]);
  const { statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      roleId: props.values.roleId,
      roleName: props.values.roleName,
      roleKey: props.values.roleKey,
      roleSort: props.values.roleSort,
      dataScope: props.values.dataScope,
      menuCheckStrictly: props.values.menuCheckStrictly,
      deptCheckStrictly: props.values.deptCheckStrictly,
      status: props.values.status,
      delFlag: props.values.delFlag,
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
    props.onSubmit({ ...values, menuIds } as RoleFormData);
  };

  return (
    <Modal
      width={640}
      title="编辑角色信息"
      forceRender
      open={props.open}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm
        form={form}
        grid={true}
        layout="horizontal"
        submitter={false}
        onFinish={handleFinish}
      >
        <ProFormDigit
          name="roleId"
          label="角色编号"
          placeholder="请输入角色编号"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: '请输入角色编号！',
            },
          ]}
        />
        <ProFormText
          name="roleName"
          label="角色名称"
          placeholder="请输入角色名称"
          rules={[
            {
              required: true,
              message: '请输入角色名称！',
            },
          ]}
        />
        <ProFormText
          name="roleKey"
          label="权限字符串"
          placeholder="请输入角色权限字符串"
          rules={[
            {
              required: true,
              message: '请输入角色权限字符串！',
            },
          ]}
        />
        <ProFormDigit
          name="roleSort"
          label="显示顺序"
          placeholder="请输入显示顺序"
          rules={[
            {
              required: true,
              message: '请输入显示顺序！',
            },
          ]}
          fieldProps={{
            defaultValue: 1,
          }}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label="角色状态"
          placeholder="请输入角色状态"
          rules={[
            {
              required: true,
              message: '请输入角色状态！',
            },
          ]}
          fieldProps={{
            defaultValue: '0',
          }}
        />
        <ProForm.Item name="menuIds" label="菜单权限">
          <Tree
            checkable={true}
            multiple={true}
            defaultExpandAll={false}
            treeData={menuTree}
            defaultCheckedKeys={menuCheckedKeys}
            onCheck={(checkedKeys: any) => {
              return setMenuIds(checkedKeys);
            }}
          />
        </ProForm.Item>
        <ProFormTextArea
          name="remark"
          label="备注"
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

export default RoleForm;
