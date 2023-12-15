import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { useAppDispatch } from '@/modules/store';
import { setIsCollapse } from '@/modules/settings';

const CollapseIcon = (props: any) => {
	const { isCollapse } = props;
	const dispatch = useAppDispatch();
	return (
		<div
			className="collapsed"
			onClick={() => {
				dispatch(setIsCollapse(!isCollapse));
			}}
		>
			{isCollapse ? <MenuUnfoldOutlined id="isCollapse" /> : <MenuFoldOutlined id="isCollapse" />}
		</div>
	);
};

const mapStateToProps = (state: any) => state.settings;
export default connect(mapStateToProps)(CollapseIcon);
