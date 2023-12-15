import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import lazyLoad from "@/router/utils/lazyLoad";
import { LayoutIndex } from "@/router/constant";
import { useAppSelector } from '@/modules/store';
import { selectPermission } from '@/modules/permission';

export interface RouteInterface {
  path?: string,
  id?: string,
  component?: string,
  element?: React.ReactNode | null;
  auth?: boolean;
  children?: RouteInterface[];
}

// 匹配views里面所有的.tsx
const modules = import.meta.glob('@/views/**/*.tsx')

export const constantRoutes = [
  {
    path: '*',
    id: 'NoFound',
    element: lazyLoad(React.lazy(() => import("@/views/404"))),
    auth: false
  },{
    path: '/redirect/:path(.*)',
    id:'redirect',
    element: lazyLoad(React.lazy(() => import("@/views/redirect"))),
    auth: false
  },{
    path: '/login',
    id:'login',
    element: lazyLoad(React.lazy(() => import("@/views/Login"))),
    auth: false
  },{
		element: <LayoutIndex />,
		children: [
			{
				path: "/",
        id: 'home',
				element: lazyLoad(React.lazy(() => import("@/views/index"))),
				meta: {
					requiresAuth: true,
					title: "首页",
					key: "home"
				}
			}
		]
	}
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [];

const elementDom = (route: RouteInterface) => {
  if(route.element) {
    return route.element;
  } else if (route.component=='Layout') {
    return <LayoutIndex />
  } else if (route.component) {
    for (const path in modules) {
      const dir = path.split('views/')[1].split('.tsx')[0];
      if (dir === route.component) {
        return lazyLoad(React.lazy(modules[path]))
      }
    }
  } else {
    return null;
  }
}

const renderRoutes = (routes: RouteInterface[] | undefined): JSX.Element[] => {
  if (!routes) return [];

  return routes.map((route: RouteInterface,index: number) => {
    const { path, children } = route;
    // console.log(path);
    
    return (
      <Route key={index} path={path} element={elementDom(route) }>
        {children && children.length > 0 && (
          <Route>{renderRoutes(children)}</Route>
        )}
      </Route>
    );
  });
};

const Router = () => {
  const [rootRoute, setRootRoute] = useState<RouteInterface[]>([]);
  const { routes } = useAppSelector(selectPermission);

  useEffect(()=> {
    setRootRoute([...constantRoutes,...dynamicRoutes,...routes])
  }, [routes])

  return <Routes>{renderRoutes(rootRoute)}</Routes>;
}

export default Router;