import * as echarts from 'echarts';
import EChartsReactCore from './core';
import { EChartsInstance, EChartsOption, EChartsReactProps } from './types';

export type { EChartsInstance, EChartsOption, EChartsReactProps };

// export the Component the echarts Object.
export default class BaseEChart extends EChartsReactCore {
  constructor(props: EChartsReactProps) {
    super(props);

    // 初始化为 echarts 整个包
    this.echarts = echarts;
  }
}
