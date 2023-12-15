import { Switch } from "antd";
import { connect } from "react-redux";
import { useAppDispatch } from '@/modules/store';
import { setThemeConfig } from '@/modules/settings';

const SwitchDark = (props: any) => {
	const { setThemeConfig, themeConfig } = props;
	const dispatch = useAppDispatch();

	const onChange = (checked: boolean) => {
		dispatch(
			setThemeConfig({ ...themeConfig, isDark: checked })
		);
	};

	return (
		<Switch
			className="dark"
			defaultChecked={themeConfig.isDark}
			checkedChildren={<>🌞</>}
			unCheckedChildren={<>🌜</>}
			onChange={onChange}
		/>
	);
};

const mapStateToProps = (state: any) => state.settings;
const mapDispatchToProps = { setThemeConfig };
export default connect(mapStateToProps, mapDispatchToProps)(SwitchDark);