interface useAuthInterface {
  permissions: string[],
  roles: string[],
}

let $permissions: string[] = [];
let $roles: string[] = [];

const useAuth = (data:useAuthInterface) => {
  const { permissions, roles } = data;
  $permissions = permissions;
  $roles = roles;
}

function authPermission(permission: any) {
  const all_permission = "*:*:*";
  if (permission && permission.length > 0) {
    return $permissions.some(v => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}

function authRole(role: any) {
  const super_admin = "admin";
  if (role && role.length > 0) {
    return $roles.some(v => {
      return super_admin === v || v === role
    })
  } else {
    return false
  }
}

export const hasPermi = (permission: string[]) => {
  return authPermission(permission);
}
// 验证用户是否含有指定权限，只需包含其中一个
export const hasPermiOr = (permissions: string[]) => {
  return permissions.some(item => {
    return authPermission(item)
  })
}
// 验证用户是否含有指定权限，必须全部拥有
export const hasPermiAnd = (permissions: string[]) => {
  return permissions.every(item => {
    return authPermission(item)
  })
}
// 验证用户是否具备某角色
export const hasRole = (role: string[]) => {
  return authRole(role);
}
// 验证用户是否含有指定角色，只需包含其中一个
export const hasRoleOr = (roles: string[]) => {
  return roles.some(item => {
    return authRole(item)
  })
}
// 验证用户是否含有指定角色，必须全部拥有
export const hasRoleAnd = (roles:string[]) => {
  return roles.every(item => {
    return authRole(item)
  })
}

// 遍历后台传来的路由字符串，转换为组件对象
export function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      const path = route.path.split('')[0] !=='/'&& route.path.indexOf('http') == -1 ? `/${route.path}` : route.path;
      route.children = filterChildren(route.children,false,path)
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false,path) {
  var children = []
  childrenMap.forEach((el, index) => {
    el.path = path + `/${el.path}`
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res;
}

export default useAuth;