import React, { useEffect } from 'react';
import { Layout, theme } from "antd";
import { connect } from "react-redux";
import LayoutMenu from "./components/Menu";
import LayoutHeader from "./components/Header";
import LayoutTabs from "./components/Tabs";
import LayoutMain from "./components/Main";
import LayoutFooter from "./components/Footer";
import { setIsCollapse } from '@/modules/settings';
import "./index.less"

const LayoutIndex: React.FC = (props: any) => {
  const { Sider, Content } = Layout;
	const { isCollapse, setIsCollapse } = props;
	const {
    token: { colorBgContainer },
  } = theme.useToken()

	// 监听窗口大小变化
	const listeningWindow = () => {
		window.onresize = () => {
			return (() => {
				let screenWidth = document.body.clientWidth;
				if (!isCollapse && screenWidth < 1200) setIsCollapse(true);
				if (!isCollapse && screenWidth > 1200) setIsCollapse(false);
			})();
		};
	};

	useEffect(() => {
		listeningWindow();
	}, []);
  return (
    // 这里不用 Layout 组件原因是切换页面时样式会先错乱然后在正常显示，造成页面闪屏效果
		<section className="container">
      <Sider trigger={null} collapsed={isCollapse} width={220}>
        <LayoutMenu></LayoutMenu>
      </Sider>
      <Layout>
				<LayoutHeader></LayoutHeader>
				<LayoutTabs></LayoutTabs>
				<Content style={{
					margin: '16px',
					padding: 24,
					minHeight: 280,
					background: colorBgContainer,
				}}>
					<LayoutMain></LayoutMain>
				</Content>
				<LayoutFooter></LayoutFooter>
      </Layout>
    </section>
  )
}

// export default LayoutIndex;
const mapStateToProps = (state: any) => state.settings;
const mapDispatchToProps = { setIsCollapse };
export default connect(mapStateToProps,mapDispatchToProps)(LayoutIndex);