import { viteMockServe } from 'vite-plugin-mock';
import { resolve } from 'path';

export default function createViteMockServe() {
  return viteMockServe({
    ignore: /^\_/, // 以 _ 开头的是工具文件，忽略
    mockPath: './mock', // 解析，路径可根据实际变动
    localEnabled: true, // 开发环境
    prodEnabled: true, // 生产环境设为true，也可以根据官方文档格式
    injectCode: ` import { setupProdMockServer } from './src/mock/index.ts';
      setupProdMockServer(); `,
    watchFiles: true, // 监听文件内容变更
    injectFile: resolve('src/main.ts'), // 在main.ts注册后需要在此处注入，否则可能报找不到setupProdMockServer的错误
  });
}
