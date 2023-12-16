import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { setIsCollapse } from '@/modules/settings';

const CollapseIcon = (props: any) => {
	const { isCollapse, setIsCollapse } = props;
	return (
		<div
			className="collapsed"
			onClick={() => {
				setIsCollapse(!isCollapse);
			}}
		>
			{isCollapse ? <MenuUnfoldOutlined id="isCollapse" /> : <MenuFoldOutlined id="isCollapse" />}
		</div>
	);
};

const mapStateToProps = (state: any) => state.settings;
const mapDispatchToProps = { setIsCollapse };
export default connect(mapStateToProps,mapDispatchToProps)(CollapseIcon);
