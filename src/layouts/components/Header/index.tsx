import { Layout } from "antd";
import { connect } from "react-redux";
import AvatarIcon from "./components/AvatarIcon";
import CollapseIcon from "./components/CollapseIcon";
import BreadcrumbNav from "./components/BreadcrumbNav";
import AssemblySize from "./components/AssemblySize";
import Theme from "./components/Theme";
import Fullscreen from "./components/Fullscreen";
import "./index.less";

const LayoutHeader = (props: any) => {
  const { name } = props;
	const { Header } = Layout;

	return (
		<Header>
			<div className="header-lf">
				<CollapseIcon />
				<BreadcrumbNav />
			</div>
			<div className="header-ri">
				<AssemblySize />
				<Theme />
				<Fullscreen />
				<span className="username">{name}</span>
				<AvatarIcon />
			</div>
		</Header>
	);
};

const mapStateToProps = (state: any) => state.user;
export default connect(mapStateToProps)(LayoutHeader);
// export default LayoutHeader;
