import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Spin } from "antd";
import { getOpenKeys } from "@/utils/util";
import { useAppSelector } from '@/modules/store';
import { selectSettings } from '@/modules/settings';
import { selectPermission } from '@/modules/permission';
import type { MenuProps } from "antd";
import * as Icons from "@ant-design/icons";
import Logo from "./components/Logo";
import "./index.less";

const LayoutMenu: React.FC = () => {
  const { pathname } = useLocation();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	const { isCollapse } = useAppSelector(selectSettings);
	const { routes } = useAppSelector(selectPermission);

  // 刷新页面菜单保持高亮
	useEffect(() => {
		setSelectedKeys([pathname]);
		isCollapse ? null : setOpenKeys(getOpenKeys(pathname));
	}, [pathname, isCollapse]);

  useEffect(()=>{
    setMenuList([
      {
        key: "/",
        icon: <Icons.HomeOutlined />,
        label: "首页",
      },
      ...deepLoopFloat(routes)
    ]);
  }, [routes])

  // 设置当前展开的 subMenu
	const onOpenChange = (openKeys: string[]) => {
		if (openKeys.length === 0 || openKeys.length === 1) return setOpenKeys(openKeys);
		const latestOpenKey = openKeys[openKeys.length - 1];
		if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
		setOpenKeys([latestOpenKey]);
	};

  // 定义 menu 类型
	type MenuItem = Required<MenuProps>["items"][number];
  const getItem = (
		label: React.ReactNode,
		key?: string | null,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: "group"
	): MenuItem => {
		return {
			key: key && (key.indexOf('/') == -1?`/${key}`: key),
			icon,
			children,
			label,
			type
		} as MenuItem;
	};

  // 动态渲染 Icon 图标
	const customIcons: { [key: string]: any } = Icons;
	const addIcon = (name: string) => {
		return React.createElement(customIcons[name]);
	};

  // 处理后台返回菜单 key 值为 antd 菜单需要的 key 值
	const deepLoopFloat = (menuList: any, newArr: MenuItem[] = []) => {
		menuList.forEach((item: any) => {
			if (!item?.children?.length) return newArr.push(getItem(item.meta.title, item.path, item.meta.icon!));
			newArr.push(getItem(item.meta.title, item.path, item.meta.icon!, deepLoopFloat(item.children,[])));
		});
		return newArr;
	};

  // 获取菜单列表并处理成 antd menu 需要的格式
	const [menuList, setMenuList] = useState<MenuItem[]>([]);
	const [loading, setLoading] = useState(false);

  // 点击当前菜单跳转页面
	const navigate = useNavigate();
	const clickMenu: MenuProps["onClick"] = ({keyPath}) => {
		navigate(keyPath[0]);
	};

  return (
    <div className="menu">
			<Spin spinning={loading} tip="Loading...">
				<Logo></Logo>
				<Menu
					theme="dark"
					mode="inline"
					triggerSubMenuAction="click"
					openKeys={openKeys}
					selectedKeys={selectedKeys}
					items={menuList}
					onClick={clickMenu}
					onOpenChange={onOpenChange}
				></Menu>
			</Spin>
		</div>
  )
}

export default LayoutMenu;