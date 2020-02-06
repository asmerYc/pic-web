import { get, post } from "./http";
//登录前查询新老用户
export const queryUser = p => get("/api/v1/admin/is_newadmin", p);
//登录接口
export const apiAddress = p => post("/api/v1/admin/app", p);
//查询标签
export const queryMark = p => get("/api/v1/management/get_label", p);
//查询管理员标签
export const queryAdminMark = p => get("/api/v1/admin/get_label", p);
//查询班级
export const queryClass = p => get("/api/v1/management/get_class", p);
//设置密码
export const resetPsd = p => post("/api/v1/admin/reset_oldpwd", p);
//班级搜索 输入查询
export const inputClass = p => get("/api/v1/management/class_byname", p);
//查询子账户列表
export const queryUserList = p => get("/api/v1/admin/son_list", p);
//新增子账户
export const addTheUser = p => post("/api/v1/admin/grant_user", p);
//更改子账户权限
export const updateScope = p => post("/api/v1/admin/update_status", p);
//管理员重置密码操作
export const resetPwd = p => post("/api/v1/admin/reset_pwd", p);
//隐藏账号
export const hiddenPwd = p => post("/api/v1/admin/hidden", p);
//点击班级获取照片
export const getImgs = p => get("/api/v1/management/img_list", p);
//查看七牛云token
export const qiniuToken = p => get("/api/v1/upload/get_token", p);
//图片上传
export const upLoadImg = p => post("/api/v1/management/up_img", p);
//提交照片
export const submitImg = p => post("/api/v1/management/sub_img", p);

//查看学校图片
export const schoolImg = p => get("/api/v1/management/school_imglist", p);
//学校管理页 照片搜索
export const searchImg = p => get("/api/v1/management/search", p);
//自动生成账户名称
export const getAccount = p => get("/api/v1/admin/get_account", p);
