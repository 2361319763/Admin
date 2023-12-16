import React from 'react';
import { ConfigProvider, theme } from "antd";
import useTheme from "@/hooks/useTheme";
import { connect } from "react-redux";
import Routes from '@/router';
import { GlobalEventProvider  } from '@/hooks/useEvents';

const App: React.FC = (props: any) => {
  const { themeConfig, assemblySize } = props;

  console.log('App 被加载')
  // 全局使用主题
	useTheme(themeConfig);
  
  return (
    <GlobalEventProvider>
      <ConfigProvider 
        componentSize={assemblySize} 
        theme={{
          algorithm: themeConfig.isDark?theme.darkAlgorithm:theme.defaultAlgorithm
        }}
      >
        <Routes />
      </ConfigProvider>
    </GlobalEventProvider>
  )
}

const mapStateToProps = (state: any) => state.settings;
export default connect(mapStateToProps)(App);