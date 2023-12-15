import React from 'react'
import useTheme from "@/hooks/useTheme"
import { connect } from "react-redux";
import { BrowserRouter } from 'react-router-dom'
import AuthRouter from '@/router/AuthRouter'
import Routes from '@/router'

const App: React.FC = (props: any) => {
  const { themeConfig } = props;
  console.log('App 被加载')
  // 全局使用主题
	useTheme(themeConfig);
  
  return (
    <BrowserRouter>
      <AuthRouter>
        <Routes />
      </AuthRouter>
    </BrowserRouter>
  )
}
// export default App;

const mapStateToProps = (state: any) => state.settings;
export default connect(mapStateToProps)(App);