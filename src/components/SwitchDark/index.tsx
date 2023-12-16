import { Switch } from "antd";
import { connect } from "react-redux";
import { setThemeConfig } from '@/modules/settings';

const SwitchDark = (props: any) => {
	const { setThemeConfig, themeConfig } = props;

	const onChange = (checked: boolean) => {
			setThemeConfig({ ...themeConfig, isDark: checked })
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