import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { Outlet } from "react-router-dom";
import KeepAlive,{ AliveScope, useAliveController } from 'react-activation';
import { useLocation } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import type { MenuProps } from 'antd';
import emitter from '@/utils/mitt'

type MenuItem = Required<MenuProps>['items'][number];

const LayoutMain: React.FC = (peops: any) => {
  const { pathData } = peops.permission;
  const { tabsList } = peops.tabs;
  const [ noCache, setnoCache ] = useState<boolean>(true);
  const [ key, setKey ] = useState<number>(0);
  const [ oleTabsList, setOleTabsList ] = useState<MenuProps['items']>([]);
  const { drop, refresh } = useAliveController();
  const { pathname } = useLocation();

  function getDisjointObjectsArray(arr1:any, arr2:any, key:string) {
    const arr2Ids = arr2.map((item:any) => item[key]);
    const disjointPart = arr1.filter((item:any) => !arr2Ids.includes(item[key]));
    return disjointPart;
  }

  useEffect(()=> {  
    const refreshHandle = (e:any) => {
      if (pathData[e] && !pathData[e].meta.noCache) {
        console.log(pathData[e].path,pathname);
        refresh(pathData[e].path);
      } else {
        setKey(prevKey => prevKey + 1)
      }
    }
    emitter.on('refresh', refreshHandle);
		return () => {
      emitter.off('refresh', refreshHandle);
		}
	}, [])

  useEffect(()=> {
    const route = pathData[pathname];
    if (pathname != HOME_URL) {
      setnoCache(route.meta.noCache);
    } else {
      setnoCache(true);
    }
  }, [pathname])

  useEffect(()=> {
    setOleTabsList(tabsList);
    getDisjointObjectsArray(oleTabsList,tabsList,'key').forEach((element:MenuItem) => {
      const route = pathData[element?.key || ''];
      if (!route.meta.noCache && route.path) {
        drop(route.path);
      }
    });
  }, [tabsList])
  return (
    <AliveScope>
      {
        !noCache && <KeepAlive autoFreeze={false} when={true} cacheKey={pathname} name={pathname}>
          <Outlet />
        </KeepAlive>
      }
      {
        noCache && <Outlet key={key} />
      }
    </AliveScope>
  )
}

const mapStateToProps = (state: any) => state;
export default connect(mapStateToProps)(LayoutMain);