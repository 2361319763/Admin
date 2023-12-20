import { connect } from "react-redux";
import "./index.less";

const LayoutFooter = (props: any) => {
	const { themeConfig } = props;
	return (
		<>
			{!themeConfig.footer && (
				<div className="footer">
					<a href="http://www.loveu.group/" target="_blank" rel="noreferrer">
						2023 © Ruoyi-React By Zhouziwei
					</a>
				</div>
			)}
		</>
	);
};

const mapStateToProps = (state: any) => state.settings;
export default connect(mapStateToProps)(LayoutFooter);
