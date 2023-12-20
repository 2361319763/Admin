import { useState, useEffect } from "react";
import { Button, Form, Input, message, Col, Image, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { getCaptchaImg, login } from "@/api/system/login";
import { HOME_URL } from "@/config/config";
import { UserOutlined, LockOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useAppDispatch } from '@/modules/store';
import { SetToken } from '@/modules/user';

const LoginForm = (props: any) => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [captchaCode, setCaptchaCode] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');
	const dispatch = useAppDispatch();

	// 登录
	const onFinish = async (loginForm: API.LoginParams) => {
		try {
			setLoading(true);
			login({...loginForm,uuid}).then(res=>{
				dispatch(SetToken(res.token))
				message.success("登录成功！");
				navigate(HOME_URL);
			});
		} finally {
			getCaptchaCode();
			setLoading(false);
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	const getCaptchaCode = async () => {
    const response = await getCaptchaImg();
    const imgdata = `data:image/png;base64,${response.img}`;
    setCaptchaCode(imgdata);
    setUuid(response.uuid||'');
  };
	
	useEffect(()=>{
		getCaptchaCode();
	}, [])

	return (
		<Form
			form={form}
			name="basic"
			labelCol={{ span: 5 }}
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			size="large"
			autoComplete="off"
		>
			<Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
				<Input placeholder="用户名：admin / user" prefix={<UserOutlined />} />
			</Form.Item>
			<Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
				<Input.Password autoComplete="new-password" placeholder="密码：123456" prefix={<LockOutlined />} />
			</Form.Item>
			<Row>
				<Col flex={3}>
					<Form.Item name="code" rules={[{ required: true, message: "请输入验证码" }]}>
						<Input placeholder="验证码" />
					</Form.Item>
				</Col>
				<Col flex={2}>
					<Image
						src={captchaCode}
						alt="验证码"
						style={{
							display: 'inline-block',
							verticalAlign: 'top',
							cursor: 'pointer',
							paddingLeft: '10px',
							width: '100px',
						}}
						preview={false}
						onClick={() => getCaptchaCode()}
					/>
				</Col>
			</Row>
			<Form.Item className="login-btn">
				<Button
					onClick={() => {
						form.resetFields();
					}}
					icon={<CloseCircleOutlined />}
				>
					重置
				</Button>
				<Button type="primary" htmlType="submit" loading={loading} icon={<UserOutlined />}>
					登录
				</Button>
			</Form.Item>
		</Form>
	);
};

export default LoginForm;
