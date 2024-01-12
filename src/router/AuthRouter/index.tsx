import { useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '@/modules/store';
import { selectUser, GetInfo } from '@/modules/user';
import { setRoutes, setPathData, setBreadcrumbList } from '@/modules/permission';
import { getRouters } from '@/api/index';
import { getPathData, findAllBreadcrumb } from '@/utils/util';
import useAuth, { filterAsyncRouter } from '@/hooks/useAuth';

// 白名单
const whiteList = ['/login', '/register'];

/**
 * @description 路由守卫组件
 * */
const AuthRouter = (props: { children: JSX.Element }) => {
	const dispatch = useAppDispatch();
	const { token, permissions, roles } = useAppSelector(selectUser);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const generateRoutes = () => {
    return new Promise(resolve => {
      getRouters().then(res => {
        const rdata = JSON.parse(JSON.stringify(res.data))
        const rewriteRoutes = filterAsyncRouter(rdata, false, true)
        const pathData = getPathData(rewriteRoutes)
        const breadcrumbList = findAllBreadcrumb(rewriteRoutes)
        dispatch(setRoutes(rewriteRoutes))
        dispatch(setPathData(pathData))
        dispatch(setBreadcrumbList(breadcrumbList))
        
        resolve(rewriteRoutes)
      })
    })
  }

	useEffect(() => {
		if (token) {
			dispatch(GetInfo()).then(res=>{
        if (res.payload?.code==200) {
          generateRoutes()
        } else {
          navigate('/login')
        }
      });
		}
	}, [token])

  useEffect(()=>{
    useAuth({ permissions, roles });
  },[permissions, roles])

  if (whiteList.indexOf(pathname) !== -1) return props.children;
  if (!token) return <Navigate to="/login" replace />;
  return props.children;
};

export default AuthRouter;
