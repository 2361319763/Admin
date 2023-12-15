import ReactDOM from 'react-dom/client'
import "@/styles/reset.less";
import "@/assets/iconfont/iconfont.less";
import "@/assets/fonts/font.less";
import "@/styles/common.less";
import { Provider } from 'react-redux';
import App from '@/App'
import store from '@/modules/store';
import { setupProdMockServer } from '../mock';
import 'virtual:svg-icons-register';

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

setupProdMockServer();
renderApp();
