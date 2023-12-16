import React from 'react';
import { ConfigProvider, theme } from "antd";
import useTheme from "@/hooks/useTheme";
import { connect } from "react-redux";
import Routes from '@/router';
import useEvents, { GlobalContext } from '@/hooks/useEvents';

const App: React.FC = (props: any) => {
  const { themeConfig, assemblySize } = props;
  const { state, dispatch } = useEvents();
  // 全局使用主题
	useTheme(themeConfig);
  
  return (
    <GlobalContext.Provider value={{
      state, 
      dispatch
    }}>
      <ConfigProvider 
        componentSize={assemblySize} 
        theme={{
          algorithm: themeConfig.isDark?theme.darkAlgorithm:theme.defaultAlgorithm
        }}
      >
        <Routes />
      </ConfigProvider>
    </GlobalContext.Provider>
  )
}

const mapStateToProps = (state: any) => state.settings;
export default connect(mapStateToProps)(App);