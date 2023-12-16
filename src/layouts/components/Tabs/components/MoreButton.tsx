import { Button, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import type { MenuProps } from 'antd';
import { useGlobalState } from '@/hooks/useEvents';

type MenuItem = Required<MenuProps>['items']
// const { useGlobalState } = useEvents();

const MoreButton = (props: any) => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { dispatch } = useGlobalState();

	// close multipleTab
	const closeMultipleTab = (tabPath?: string) => {
		const handleTabsList = props.tabsList.filter((item: MenuItem) => {
			return item?.key === tabPath || item?.key === HOME_URL;
		});
		props.setTabsList(handleTabsList);
		tabPath ?? navigate(HOME_URL);
	};

	const refresh = () => {
		dispatch({type:'REFRESH'})
	}

	const menu = [
		{
			key: "1",
			label: <span>刷新当前</span>,
			onClick: () => refresh()
		},
		{
			key: "2",
			label: <span>关闭当前</span>,
			onClick: () => props.delTabs(pathname)
		},
		{
			key: "3",
			label: <span>关闭其它</span>,
			onClick: () => closeMultipleTab(pathname)
		},
		{
			key: "4",
			label: <span>关闭所有</span>,
			onClick: () => closeMultipleTab()
		}
	];

	return (
		<Dropdown menu={{items:menu}} placement="bottom" arrow={{ pointAtCenter: true }} trigger={["click"]}>
			<Button className="more-button" type="primary" size="small">更多<DownOutlined />
			</Button>
		</Dropdown>
	);
};
export default MoreButton;
