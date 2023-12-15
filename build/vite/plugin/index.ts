import { PluginOption } from 'vite';
import VitePluginCertificate from 'vite-plugin-mkcert';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import createCompression from './compression';
import createSvgIcon from './svg-icon';
import createViteMockServe from './mock-serve';

interface ViteEnv {
  VITE_PORT: number;
  VITE_USE_MOCK: boolean;
  VITE_USE_PWA: boolean;
  VITE_PUBLIC_PATH: string;
  VITE_PROXY: [string, string][];
  VITE_GLOB_APP_TITLE: string;
  VITE_GLOB_APP_SHORT_NAME: string;
  VITE_USE_CDN: boolean;
  VITE_DROP_CONSOLE: boolean;
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  VITE_LEGACY: boolean;
  VITE_USE_IMAGEMIN: boolean;
  VITE_GENERATE_UI: string;
}

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean = false) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    react(),
    visualizer({open: true}),
    // @ts-ignore
    VitePluginCertificate({
      source: 'coding',
    }),
  ];
  vitePlugins.push(createSvgIcon(isBuild))
  vitePlugins.push(createViteMockServe());
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  
  return vitePlugins;
}