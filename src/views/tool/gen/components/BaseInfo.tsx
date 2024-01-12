import {
  ProForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, message, Row } from 'antd';
import React, { Fragment, useEffect } from 'react';
import styles from '../style.module.less';

export type BaseInfoProps = {
  values?: any;
  onStepSubmit?: any;
};

const BaseInfo: React.FC<BaseInfoProps> = (props) => {
  const [form] = Form.useForm();
  const { onStepSubmit } = props;
  const navigate = useNavigate();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      tableName: props.values.tableName,
    });
  });

  const onValidateForm = async () => {
    const values = await form.validateFields();
    if (onStepSubmit) {
      onStepSubmit('base', values);
    }
  };

  return (
    <Fragment>
      <Row>
        <Col span={24}>
          <ProForm
            form={form}
            onFinish={async () => {
              message.success('提交成功');
            }}
            initialValues={{
              tableName: props.values?.tableName,
              tableComment: props.values?.tableComment,
              className: props.values?.className,
              functionAuthor: props.values?.functionAuthor,
              remark: props.values?.remark,
            }}
            submitter={{
              resetButtonProps: {
                style: { display: 'none' },
              },
              submitButtonProps: {
                style: { display: 'none' },
              },
            }}
          >
            <Row>
              <Col span={12} order={1}>
                <ProFormText
                  name="tableName"
                  label="表名称"
                  rules={[
                    {
                      required: true,
                      message: '表名称不可为空。',
                    },
                  ]}
                />
              </Col>
              <Col span={12} order={2}>
                <ProFormText name="tableComment" label="表描述" />
              </Col>
            </Row>
            <Row>
              <Col span={12} order={1}>
                <ProFormText
                  name="className"
                  label="实体类名称"
                  rules={[
                    {
                      required: true,
                      message: '实体类名称不可为空。',
                    },
                  ]}
                />
              </Col>
              <Col span={12} order={2}>
                <ProFormText name="functionAuthor" label="作者" />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <ProFormTextArea name="remark" label="备注" />
              </Col>
            </Row>
          </ProForm>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={4}>
          <Button
            type="primary"
            className={styles.step_buttons}
            onClick={() => {
              navigate(-1);
            }}
          >
            返回
          </Button>
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
};

export default BaseInfo;
