import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const MoreButton = (props: any) => {
	const { pathname } = useLocation();
	const navigate = useNavigate();

	// close multipleTab
	const closeMultipleTab = (tabPath?: string) => {
		const handleTabsList = props.tabsList.filter((item: MenuItem) => {
			return item?.key === tabPath || item?.key === HOME_URL;
		});
		props.setTabsList(handleTabsList);
		tabPath ?? navigate(HOME_URL);
	};

	const menu = (
		<Menu
			items={[
				{
					key: "1",
					label: <span>关闭当前</span>,
					onClick: () => props.delTabs(pathname)
				},
				{
					key: "2",
					label: <span>关闭其它</span>,
					onClick: () => closeMultipleTab(pathname)
				},
				{
					key: "3",
					label: <span>关闭所有</span>,
					onClick: () => closeMultipleTab()
				}
			]}
		/>
	);
	return (
		<Dropdown overlay={menu} placement="bottom" arrow={{ pointAtCenter: true }} trigger={["click"]}>
			<Button className="more-button" type="primary" size="small">更多<DownOutlined />
			</Button>
		</Dropdown>
	);
};
export default MoreButton;
