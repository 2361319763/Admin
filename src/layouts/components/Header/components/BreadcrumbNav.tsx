import React, { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { useLocation, Link } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import { connect } from "react-redux";
import { selectPermission } from '@/modules/permission';
import { useAppSelector } from '@/modules/store';
import { getComponentForPath } from "@/utils/util";

const BreadcrumbNav: React.FC = (props: any) => {
  const { pathname } = useLocation();
	const { themeConfig } = props;
  const { breadcrumbList } = useAppSelector(selectPermission);
  const [ breadcrumb, setBreadcrumb ] = useState<any>();

  useEffect(() => {
    const $breadcrumbList = breadcrumbList[pathname] || getComponentForPath(breadcrumbList,pathname);
    if ($breadcrumbList) {
      const $breadcrumb = $breadcrumbList.map(J=>({
        title: J.meta.title,
        key: J.path
      }))
      setBreadcrumb([
        {
          title: <Link  to={HOME_URL}>首页</Link>,
        },
        ...$breadcrumb
      ])
    } else {
      setBreadcrumb([
        {
          title: <Link  to={HOME_URL}>首页</Link>,
        },
      ])
    }
  },[pathname])

  return (
    <>
      {!themeConfig.breadcrumb && (
        <Breadcrumb items={breadcrumb}></Breadcrumb>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => state.settings;
export default connect(mapStateToProps)(BreadcrumbNav);