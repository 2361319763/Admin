import React from 'react'
import { ConfigProvider } from "antd";
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
      <ConfigProvider componentSize={assemblySize}>
        <AuthRouter>
          <Routes />
        </AuthRouter>
      </ConfigProvider>
    </BrowserRouter>
  )
}

const mapStateToProps = (state: any) => state.settings;
export default connect(mapStateToProps)(App);