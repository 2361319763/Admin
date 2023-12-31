import React from 'react';
import { hasPermiOr, hasPermiAnd } from '@/hooks/useAuth';

interface PermissionControlledComponentProps {
  access: string[];
  children: React.ReactNode;
  isEvery?: boolean;
}

const PermissionControlledComponent: React.FC<PermissionControlledComponentProps> = ({ access, children, isEvery = false }) => {

  // 检查用户是否具有所需权限
  const hasPermissionOr = hasPermiOr(access); // 只需包含其中一个
  const hasPermissionAnd = hasPermiAnd(access); // 必须全部拥有

  // 如果用户拥有权限，则渲染子组件
  if (isEvery) {
    return hasPermissionAnd ? <>{children}</> : null;
  } else {
    return hasPermissionOr ? <>{children}</> : null;
  }
  
};

export default PermissionControlledComponent;