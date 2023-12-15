import path from 'path'
import { defineConfig, loadEnv, ConfigEnv  } from 'vite'
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }: ConfigEnv )=>{
  const root = process.cwd();

  const env = loadEnv(mode, root);
  
  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_APP_ENV, VITE_APP_BASE_API, VITE_APP_BASE_URL } = viteEnv;

  const isBuild = command === 'build';

  return {
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: createVitePlugins(viteEnv, isBuild),
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks(id) {
            if (id.includes("node_modules")) {
              // 让每个插件都打包成独立的文件
              return id.toString().split("node_modules/")[1].split("/")[0].toString(); 
            }
          }
        }
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }      
    },
    resolve: {
      alias: {
        // 设置别名
        '@': path.resolve(__dirname, './src')
      }
    },
    css: {
			preprocessorOptions: {
				less: {
					// modifyVars: {
					// 	"primary-color": "#1DA57A",
					// },
					javascriptEnabled: true,
					additionalData: `@import "@/styles/var.less";`
				}
			}
		},
    server: {
      // Listening on all local IPs
      host: true,
      open: true,
      https: true,
      port: VITE_PORT,
      proxy: {
        [VITE_APP_BASE_API]: { 
          target: VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, '')
        }
      },
      hmr:{
        overlay:false
      }
    },
  }
})
