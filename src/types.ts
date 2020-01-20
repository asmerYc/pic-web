import { QueryParams, QueryMethod } from './utils';

export interface ServerRes<T = any> {
  code: number;
  data: T;
  message: string;
}

export interface ResWithPageParams<T = any> {
  content:          T[];
  first:            boolean;
  last:             boolean;
  number:           number;
  numberOfElements: number;
  size:             number;
  totalElements:    number;
  totalPages:       number;
}

export interface DataBase {
  id?:         number;
  createTime?: string;
  updateTIme?: string;
  version?:    number;
}

// 功能收集
export interface Resource extends DataBase {
  orderNumber:  number;
  resourceCode: string;
  resourceName: string;
  module:       SystemModule;
}

export interface SystemModule extends DataBase {
  children:   SystemModule[];
  parent:     SystemModule;
  keyWord:     string;
  moduleUrl:   string;
  moduleName:  string;
  moduleCode:  string;
  icon?:       string;
  orderNumber: number;
  resources?:   string[];
}

export interface MenuModule extends DataBase {
  moduleName:  string;
  moduleCode:  string;
  orderNumber: number;
  moduleUrl:   string;
  keyWord:     string;
  expand:      boolean;
  parentId:    number;
  icon:        string;
  children:    MenuModule[];
}

/**
 * 字典
 */
export interface Dic extends DataBase {
  //deleted:     boolean;
  dicCode:     string;
  dicItems:    DicItem[];
  dicName:     string;
}

/**
 * 字典项
 */
export interface DicItem extends DataBase {
  dicItemCode:  string;
  dicItemName:  string;
  orderNumber?: number;

}

export interface BaseGirdConf {
  url:          string;
  body:         any;
  params:       QueryParams;
  method:       QueryMethod;
}

export interface GridAction {
  code:          string;          // 按钮权限
  name:          string;          // 按钮名称
  type?:         string;          // 按钮类型
  icon?:         string;          // 按钮图标
  click?:        () => any;       // 点击按钮时执行的函数
  multi?:        boolean;         // 多个按钮合并做下拉
  isExist?:        boolean;       // 按钮权限控制
  multiActions?: GridAction[];    // 多个按钮对应的
}

// 树节点
export interface TreeNode {
  title: string;
  expand?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  selected?: boolean;
  checked?: boolean;
  children: TreeNode[];
}
// 
export interface SimpListData {
  title: string;
  key:   any;
}

export interface MacPreviewNode {
  key:        number;
  title:      string;
  icon:       string;
  children:   MacPreviewNode[],
  payload:    any;
}

export interface QueryCondition {
  k:  string;
  v: any;
  o:   'ge' | 'gt' | 'le' | 'lt' | 'eq' | 'ne' | 'like' | 'is' | 'in';
}

export interface VStream<D, E> {
  data: D;
  event: {
    msg: E;
    name: string;
  }
}

export interface Feature extends DataBase {
  orderNumber:  number;
  resourceCode: string;
  resourceName: string;
  module:       SystemModule;
}

export interface Member extends DataBase {
  admissionTime:   Date;            // 入会时间
  branchCode:      number;          // 参与分会编码
  branchId:        number;          // 参与分会标识
  branchName:      number;          // 参与分会名称
  branchPosition:  string;          // 分会职务
  memberBirthday:  string;          // 出生日期
  memberEducation: string;          // 文化程度–字典
  memberGender:    string;          // 性别–字典
  memberName:      string;          // 姓名
  memberNation:    string;          // 民族–字典
  memberNumber:    string;          // 职员编号
  memberPosition:  string;          // 职务–字典
  nativeCity:      string;          // 籍贯市-字典 [地址]
  nativeProvince:  string;          // 籍贯省–字典【地址】
  politicalStatus: string;          // 政治面貌–字典
  reason:          string           // 审核原因
  withdrawalTime:  Date;            // 退会时间
  workDate:        Date;            // 工作时间
  memberStatus:    string;          // 当前状态–字典
  approvalStatus:  string;          // 审核状态–字典
}

export interface Welfare extends DataBase {
  endTime:     Date;
  remark:      string;
  startTime:   Date;
  welfareName: string;
}

export interface WelfareRec extends DataBase {
  memberId:      number;
  memberName:    string;
  receivingTime: Date;
  wefId:         number;
  welfareName:   string;

}

export interface UserInfo {
  member:     Member;
  moduleTree: MenuModule[];
  resources:  string[];
  canLogin:   boolean;
}