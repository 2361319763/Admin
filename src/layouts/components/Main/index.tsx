import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { Outlet } from "react-router-dom";
import KeepAlive,{ AliveScope, useAliveController } from 'react-activation';
import { useLocation } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const LayoutMain: React.FC = (peops: any) => {
  const { pathData } = peops.permission;
  const { tabsList, previousTabsList } = peops.tabs;
  const [ noCache, setnoCache ] = useState<boolean>(true);
  const [ oleTabsList, seOleTabsList ] = useState<MenuProps['items']>([]);
  const { drop, refresh } = useAliveController();
  const { pathname } = useLocation();

  useEffect(()=> {
    console.log('LayoutMain');
    
  }, [])

  useEffect(()=> {
    const route = pathData[pathname];
    if (pathname != HOME_URL) {
      setnoCache(route.meta.noCache);
    } else {
      setnoCache(true);
    }
  }, [pathname])

  function getDisjointObjectsArray(arr1:any, arr2:any, key:string) {
    const arr2Ids = arr2.map((item:any) => item[key]);
    const disjointPart = arr1.filter((item:any) => !arr2Ids.includes(item[key]));
    return disjointPart;
  }

  useEffect(()=> {
    seOleTabsList(tabsList);
    console.log(oleTabsList,tabsList,);
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
        noCache && <Outlet />
      }
    </AliveScope>
  )
}

const mapStateToProps = (state: any) => state;
export default connect(mapStateToProps)(LayoutMain);