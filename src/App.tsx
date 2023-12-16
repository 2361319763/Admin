import React from 'react'
import { ConfigProvider, theme } from "antd";
import useTheme from "@/hooks/useTheme"
import { connect } from "react-redux";
import { BrowserRouter } from 'react-router-dom'
import AuthRouter from '@/router/AuthRouter'
import Routes from '@/router'

const App: React.FC = (props: any) => {
  const { themeConfig, assemblySize } = props;
  console.log('App 被加载')
  // 全局使用主题
	useTheme(themeConfig);
  
  return (
    <BrowserRouter>
      <ConfigProvider 
        componentSize={assemblySize} 
        theme={{
          algorithm: themeConfig.isDark?theme.darkAlgorithm:theme.defaultAlgorithm
        }}
      >
        <AuthRouter>
          <Routes />
        </AuthRouter>
      </ConfigProvider>
    </BrowserRouter>
  )
}

const mapStateToProps = (state: any) => state.settings;
export default connect(mapStateToProps)(App);