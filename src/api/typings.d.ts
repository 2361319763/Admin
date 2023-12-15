declare namespace API {
  type CaptchaResult = {
    code: number;
    uuid?: string;
    img?: string;
  };
  type LoginResult = {
    code: number;
    msg?: string;
    token: string;
  };
  type LoginParams = {
    username: string;
    password: string;
    uuid: string;
    autoLogin?: boolean;
    code: string;
  };
  type RoutersMenuItem = {
    alwaysShow?: boolean;
    children?: RoutersMenuItem[];
    component?: string;
    hidden?: boolean;
    meta: MenuItemMeta;
    name: string;
    path: string;
    redirect?: string;
    [key: string]: any;
  };
  interface UserInfoResult {
    code?: number;
    msg?: string;
    user: UserInfo;
    permissions: any;
    roles: any;
  }
  interface UserInfo {
    userId?: string;
    userName?: string;
    nickName?: string;
    avatar?: string;
    sex?: string;
    email?: string;
    gender?: UserGenderEnum;
    unreadCount: number;
    address?: string;
    phonenumber?: string;
    dept?: Dept;
    roles?: Role[];
    permissions: string[];
  }
  interface Result {
    code: number;
    msg: string;
    data?: Record<string, any>;
  }
  export type DictTypeListParams = {
    dictId?: string;
    dictName?: string;
    dictType?: string;
    status?: string;
    createBy?: string;
    createTime?: string;
    updateBy?: string;
    updateTime?: string;
    remark?: string;
    pageSize?: string;
    currentPage?: string;
    filter?: string;
    sorter?: string;
  };
}
