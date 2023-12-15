import React, { useMemo } from "react";
import "./index.less";

type SvgIconProps = {
  color?: string;
  prefix?: string;
  svgName: string;
  svgClass?: string;
};

/**
 * @Svg组件
 * @props  color   图标颜色
 * @props  svgName 图标名称--文件名称
 * @props  svgClass 自定义类名
 * @props  prefix 前缀 默认icon
 */

const SvgIcon:React.FC<SvgIconProps> = ({
  color,
  svgName,
  svgClass,
  prefix = "icon",
}) => {
  const symbolId = useMemo(() => `#${prefix}-${svgName}`, [prefix, svgName]);
  return (
    <svg className={`svg-class ${svgClass}`} aria-hidden="true" fill={color}>
      <use href={symbolId} fill={color} />
    </svg>
  );
}

export default SvgIcon;