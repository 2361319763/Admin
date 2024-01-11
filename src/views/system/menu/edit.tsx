import { DictValueEnumObj } from '@/components/DictTag';
import IconSelector from '@/components/IconSelector';
import { createIcon } from '@/utils/IconUtil';
import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';

export type MenuFormData = Record<string, unknown> & Partial<API.System.Menu>;

export type MenuFormProps = {
  onCancel: (flag?: boolean, formVals?: MenuFormData) => void;
  onSubmit: (values: MenuFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.Menu>;
  visibleOptions: DictValueEnumObj;
  statusOptions: DictValueEnumObj;
  menuTree: DataNode[];
};

const MenuForm: React.FC<MenuFormProps> = (props) => {
  const [form] = Form.useForm();

  const [menuTypeId, setMenuTypeId] = useState<any>('M');
  const [menuIconName, setMenuIconName] = useState<any>();
  const [iconSelectorOpen, setIconSelectorOpen] = useState<boolean>(false);

  const { menuTree, visibleOptions, statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    setMenuIconName(props.values.icon);
    setMenuTypeId(props.values.menuType);
    form.setFieldsValue({
      menuId: props.values.menuId,
      menuName: props.values.menuName,
      parentId: props.values.parentId || 0,
      orderNum: props.values.orderNum,
      path: props.values.path,
      component: props.values.component,
      query: props.values.query,
      isFrame: props.values.isFrame,
      isCache: props.values.isCache || '0',
      menuType: props.values.menuType,
      visible: props.values.visible,
      status: props.values.status || '0',
      perms: props.values.perms,
      icon: props.values.icon,
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
    props.onSubmit(values as MenuFormData);
  };

  return (
    <Modal
      width={640}
      title="编辑菜单权限"
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
          name="menuId"
          label="菜单编号"
          placeholder="请输入菜单编号"
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: '请输入菜单编号！',
            },
          ]}
        />
        <ProFormTreeSelect
          name="parentId"
          label="上级菜单"
          params={{ menuTree }}
          request={async () => {
            return menuTree;
          }}
          placeholder="请输入父菜单编号"
          rules={[
            {
              required: true,
              message: '请输入父菜单编号！',
            },
          ]}
          fieldProps={{
            defaultValue: 0,
          }}
        />
        <ProFormRadio.Group
          name="menuType"
          valueEnum={{
            M: '目录',
            C: '菜单',
            F: '按钮',
          }}
          label="菜单类型"
          placeholder="请输入菜单类型"
          rules={[
            {
              required: false,
              message: '请输入菜单类型！',
            },
          ]}
          fieldProps={{
            defaultValue: 'M',
            onChange: (e) => {
              setMenuTypeId(e.target.value);
            },
          }}
        />
        <ProFormSelect
          name="icon"
          label="菜单图标"
          valueEnum={{}}
          hidden={menuTypeId === 'F'}
          addonBefore={createIcon(menuIconName)}
          fieldProps={{
            onClick: () => {
              setIconSelectorOpen(true);
            },
          }}
          placeholder="请输入菜单图标"
          rules={[
            {
              required: false,
              message: '请输入菜单图标！',
            },
          ]}
        />
        <ProFormText
          name="menuName"
          label="菜单名称"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入菜单名称"
          rules={[
            {
              required: true,
              message: '请输入菜单名称！',
            },
          ]}
        />
        <ProFormDigit
          name="orderNum"
          label="显示顺序"
          width="lg"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入显示顺序"
          rules={[
            {
              required: false,
              message: '请输入显示顺序！',
            },
          ]}
          fieldProps={{
            defaultValue: 1,
          }}
        />
        <ProFormRadio.Group
          name="isFrame"
          valueEnum={{
            0: '是',
            1: '否',
          }}
          initialValue="1"
          label="是否为外链"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入是否为外链"
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: false,
              message: '请输入是否为外链！',
            },
          ]}
          fieldProps={{
            defaultValue: '1',
          }}
        />
        <ProFormText
          name="path"
          label="路由地址"
          width="lg"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入路由地址"
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: menuTypeId !== 'F',
              message: '请输入路由地址！',
            },
          ]}
        />
        <ProFormText
          name="component"
          label="组件路径"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入组件路径"
          hidden={menuTypeId !== 'C'}
          rules={[
            {
              required: false,
              message: '请输入组件路径！',
            },
          ]}
        />
        <ProFormText
          name="query"
          label="路由参数"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入路由参数"
          hidden={menuTypeId !== 'C'}
          rules={[
            {
              required: false,
              message: '请输入路由参数！',
            },
          ]}
        />
        <ProFormText
          name="perms"
          label="权限标识"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入权限标识"
          hidden={menuTypeId === 'M'}
          rules={[
            {
              required: false,
              message: '请输入权限标识！',
            },
          ]}
        />
        <ProFormRadio.Group
          name="isCache"
          valueEnum={{
            0: '缓存',
            1: '不缓存',
          }}
          label="是否缓存"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入是否缓存"
          hidden={menuTypeId !== 'C'}
          rules={[
            {
              required: true,
              message: '请输入是否缓存！',
            },
          ]}
          fieldProps={{
            defaultValue: '0',
          }}
        />
        <ProFormRadio.Group
          name="visible"
          valueEnum={visibleOptions}
          label="显示状态"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入显示状态"
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: false,
              message: '请输入显示状态！',
            },
          ]}
          fieldProps={{
            defaultValue: '0',
          }}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label="菜单状态"
          colProps={{ md: 12, xl: 12 }}
          placeholder="请输入菜单状态"
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: true,
              message: '请输入菜单状态！',
            },
          ]}
          fieldProps={{
            defaultValue: '0',
          }}
        />
      </ProForm>
      <Modal
        width={800}
        open={iconSelectorOpen}
        onCancel={() => {
          setIconSelectorOpen(false);
        }}
        footer={null}
      >
        <IconSelector
          onSelect={(name: string) => {
            form.setFieldsValue({ icon: name });
            setMenuIconName(name);
            setIconSelectorOpen(false);
          }}
        />
      </Modal>
    </Modal>
  );
};

export default MenuForm;
