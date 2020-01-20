import { get, post } from "./http";
//登录前查询新老用户
export const queryUser = p => get("/api/v1/admin/is_newadmin", p);
//登录接口
export const apiAddress = p => post("/api/v1/admin/app", p);
//查询标签
export const queryMark = p =>
  get("/api/v1/management/get_label?size=13&page=1", p);
//设置密码
export const resetPsd = p => post("/api/v1/admin/reset_oldpwd", p);
