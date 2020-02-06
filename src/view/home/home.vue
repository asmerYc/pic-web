<template>
  <div>
    <header-vue @tableVisibleAdmin="tableVisibleAdmin"></header-vue>
    <el-container class="home">
      <!-- 左侧边栏 -->
      <el-aside class="aside" width="245px">
        <el-input
          class="search"
          placeholder="请输入班级名称"
          v-model="inputClassName"
          @keyup.enter.native="inputClass"
        >
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div class="search-title" @click="viewSclImgs">学校图片</div>
        <div class="class-list">
          <ul class="infinite-list" v-infinite-scroll style="overflow:auto">
            <li
              v-for="(item, index) in classList"
              :class="[
                'infinite-list-item',
                'class-item',
                item.selected ? 'active' : null
              ]"
              :key="index"
              @click="selectClass(item)"
            >{{ item.name }}</li>
          </ul>
        </div>
      </el-aside>
      <!-- 右侧内容 -->
      <el-container>
        <!-- 头部标签 -->
        <el-header class="header" height="180px">
          <div>
            <el-input
              class="tag-search"
              v-model="inputTagsSearch"
              @input="searchOperate"
              placeholder="请输入内容"
            >
              <el-button
                class="tag-search-btn"
                slot="append"
                icon="el-icon-search"
                @click="searchResult"
              ></el-button>
            </el-input>
            <div>
              <div v-if="this.tagsList.length !== 0" class="tags-container">
                <div class="tags-type">选择标签：</div>
                <div :class="['tags-row', {'more-row':showMoreTags}]">
                  <template v-for="(item, index) in tagsList">
                    <span
                      :class="item.selected?'active':null"
                      @click="selectTags(item)"
                      :key="index"
                    >
                      {{
                      item.name
                      }}
                    </span>
                  </template>
                </div>
                <span class="more-tag" @click="showMoreTags = !showMoreTags">
                  更多标签
                  <i
                    v-bind:class="{'el-icon-caret-bottom' : !showMoreTags ,'el-icon-caret-top' : showMoreTags}"
                  ></i>
                </span>
              </div>
              <div v-if="this.uploadersList.length !== 0" class="tags-container">
                <div class="tags-type" v-if="isShow">选择上传人：</div>
                <div class="tags-row" v-if="isShow">
                  <template v-for="(item, index) in uploadersList">
                    <span
                      :class="item.selected?'active':null"
                      v-if="index < 8"
                      @click="selectUploaders(item)"
                      :key="index"
                    >{{ item.name }}</span>
                  </template>
                </div>
              </div>
              <div class="tags-container">
                <div class="tags-type">选择日期：</div>
                <div class="tags-row">
                  <el-date-picker
                    @change="changeDate"
                    v-model="dateTime"
                    type="month"
                    placeholder="选择年月"
                    value-format="yyyy-MM"
                  ></el-date-picker>
                </div>
              </div>
            </div>
          </div>
          <div class="add-photo-btn" @click="uploadModal">
            <img src="../../assets/images/添加_06.png" />
            <span>添加照片</span>
          </div>
        </el-header>
        <!-- 照片内容 -->
        <el-main class="main" v-loading="loading">
          <div class="noimgInfo" v-if="this.allImgs.length === 0">暂无图片信息</div>
          <template v-if="this.allImgs.length !== 0">
            <div v-for="(item, index) in imgsInfo" :key="index" class="photos-item-container">
              <span v-if="item.create_time" class="date-tag">{{ item.create_time | formatDate }}</span>
              <div style="margin-top:10px;">
                <span v-if="item.user && item.user.name" class="photographer">
                  {{
                  item.user && item.user.name
                  }}
                </span>
                <div class="scroll-photos" :ref="`element${index}`">
                  <div v-if="item.user.imgs.length === 0">暂无图片</div>
                  <div
                    :class="['photos',{'more-imgs': item.user.isMore}]"
                    v-if="item.user.imgs.length > 0"
                  >
                    <div
                      @click="changeImg(i)"
                      v-for="(i, index) in item.user && item.user.imgs"
                      class="single-photo"
                      :key="index"
                    >
                      <span v-if="onEdit" :class="[{ choosed: i.isChoosed }, 'choose-icon']"></span>
                      <img :src="`${i.img_url}-thumb`" alt />
                    </div>
                  </div>
                  <div v-if="item.user.moreRow" class="moreClass" @click="changeIsMore(item.user)">
                    <div class="moreChild">
                      {{!item.user.isMore ? '查看更多' : '点击收起'}}
                      <i
                        v-bind:class="{'el-icon-caret-bottom' : !item.user.isMore ,'el-icon-caret-top' : item.user.isMore}"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-main>
        <el-footer class="footer" height="56px">
          <div class="footer-left">
            <el-button v-if="onEdit" @click="cancleCircle">取消</el-button>
          </div>
          <div v-if="onEdit" class="footer-right">
            <el-button @click="submit">提交</el-button>
            <el-button @click="download">下载</el-button>
          </div>
          <div v-else class="choose-photo">
            <el-button @click="onEdit = !onEdit">
              选择照片
              <i class="el-icon-caret-right"></i>
            </el-button>
          </div>
        </el-footer>
      </el-container>
    </el-container>
    <!-- 返回顶部 -->
    <el-backtop class="backtop" target=".main" :right="18" :bottom="110" :visibility-height="10">
      <img src="../../assets/images/07_25.png" />
    </el-backtop>
    <!-- 上传图片弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      v-loading="loading"
      title="上传照片"
      :visible.sync="dialogPhoto"
      class="dialog-photo"
    >
      <span slot="title">
        <span class="upload-title">上传照片</span>
        <span class="upload-tip">（每次上传照片最多不超过20张，上传过程中请不要删除照片）</span>
      </span>
      <el-container>
        <el-main class="upload-main">
          <div :class="['upload-photos',{'before-upload-photos' : files.length <= 0}]">
            <!-- <div :class="before-upload-photos"> -->
            <div v-for="(file, index) in files" class="upload-single-photo" :key="index">
              <img v-if="file.blob" :src="file.blob" />
              <!-- 点击开始上传  显示进度条-->
              <div
                v-if="!(file.progress === '0.00' || file.progress === 100)"
                class="extraItem progress"
              >
                <span class="extraItem progressText">{{ file.progress || 0 }}%</span>
                <div class="extraItem activeProgress" :style="{ width: file.progress + '%' }"></div>
              </div>
              <!-- 非上传时显示删除按钮 -->
              <span v-else class="extraItem delete-btn" @click="$refs.uploader.remove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </div>
            <!-- 当选择多于20张时不显示添加照片按钮 -->
            <div class="add-photo" v-show="files.length < 20">
              <img src="../../assets/images/add.png" />
              <file-upload
                accept="image/*"
                ref="uploader"
                v-model="files"
                :multiple="true"
                :maximum="20"
                :custom-action="customAction"
                :thread="20"
                @input-file="inputFile"
                @input-filter="inputFilter"
              >添加照片</file-upload>
            </div>
          </div>
        </el-main>
        <el-footer height="100px" class="upload-footer">
          <el-button
            v-if="!$refs.uploader || !$refs.uploader.active"
            type="warning"
            :class="['start-upload','upload-btn',]"
            @click="submitUpload"
            :disabled="hasDesinfo"
          >开始上传</el-button>
          <el-button v-else type="info" class="upload-btn cancle-upload" @click="cancleUpload">取消上传</el-button>
          <!-- <el-button
            v-if="!startUpload"
            type="info"
            class="upload-btn start-upload"
            @click="startPhoto"
          >开始上传</el-button>
          <el-button v-else type="info" class="upload-btn cancle-upload" @click="canclePhoto">取消上传</el-button>-->
          <el-input
            type="textarea"
            class="add-upload-disc"
            v-model="addUploadDisc"
            resize="none"
            @input="desinfoChange"
            placeholder="为了方便搜索，请按照时间、事件添加照片说明"
          ></el-input>
        </el-footer>
      </el-container>
    </el-dialog>
    <!-- 管理员设置弹窗 -->
    <el-dialog v-loading="loading" title="管理员设置" :visible.sync="dialogAdmin" class="dialog-admin">
      <span slot="title">
        <el-button type="primary" icon="el-icon-plus" class="add-admin" @click="addUser">新增</el-button>
      </span>
      <el-container>
        <el-main class="admin-main">
          <el-table :data="tableData" style="width: 100%" height="100%">
            <!-- 部门 -->
            <el-table-column label="部门" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  class="focused"
                  v-if="isAdd && scope.row.isNew"
                  v-model="scope.row.department"
                  placeholder="部门"
                ></el-input>
                <span v-else>{{ scope.row.department }}</span>
              </template>
            </el-table-column>
            <!-- 姓名 -->
            <el-table-column label="姓名" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  v-if="isAdd && scope.row.isNew"
                  v-model="scope.row.name"
                  @blur="nameBlur(scope.row)"
                  placeholder="姓名"
                ></el-input>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <!-- 职务 -->
            <el-table-column label="职务" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-if="isAdd && scope.row.isNew" v-model="scope.row.duty" placeholder="职务"></el-input>
                <span v-else>{{ scope.row.duty }}</span>
              </template>
            </el-table-column>
            <!-- 登陆账号 -->
            <el-table-column label="登陆账号" width="182" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  v-if="isAdd && scope.row.isNew"
                  v-model="scope.row.account"
                  placeholder="登陆账号"
                  readonly
                ></el-input>
                <span v-else>{{ scope.row.account }}</span>
              </template>
            </el-table-column>
            <el-table-column label="密码状态" width="100" class-name="pw-cell-class">
              <template slot-scope="scope">
                <span v-if="scope.row.password_status === 1">已经自设</span>
                <span v-else>初始密码</span>
              </template>
            </el-table-column>
            <el-table-column label="权限开放" width="100" class-name="role-cell-class">
              <template slot-scope="scope">
                <el-radio-group
                  v-model="scope.row.scope"
                  @change="scopeChange(scope.row)"
                  size="mini"
                >
                  <el-radio-button label="16">
                    <i class="el-icon-check"></i>
                  </el-radio-button>
                  <el-radio-button label="0">
                    <i class="el-icon-close"></i>
                  </el-radio-button>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="重置密码" width="100" class-name="retpw-cell-class">
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  size="mini"
                  :disabled="
                    scope.row.isNew ||
                      scope.row.password_status == 0 ||
                      scope.row.scope == 1
                  "
                  @click="handleReset(scope.$index, scope.row)"
                >立即重置</el-button>
              </template>
            </el-table-column>
            <el-table-column label width="100">
              <template slot-scope="scope">
                <span
                  v-if="!scope.row.isNew"
                  class="hide-user-btn"
                  @click="handleHidden(scope.$index, scope.row)"
                >隐藏</span>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer v-show="isAdd" height="100px" class="admin-footer">
          <el-button class="cancel-admin" @click="getUserList">取消</el-button>
          <el-button type="primary" class="save-admin" @click="saveUser">保存</el-button>
        </el-footer>
      </el-container>
    </el-dialog>
    <el-dialog title="查看图片" :visible.sync="dialogBigPic">
      <div>
        <img :src="bigUrl" style="width:100%;height:100%" alt />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headerVue from "../header";
import fileUpload from "vue-upload-component";
import * as qiniu from "qiniu-js";
import Moment from "moment";
import axios from "axios";
import {
  queryMark,
  queryAdminMark,
  queryClass,
  inputClass,
  queryUserList,
  addTheUser,
  updateScope,
  resetPwd,
  hiddenPwd,
  getImgs,
  qiniuToken,
  upLoadImg,
  submitImg,
  schoolImg,
  searchImg,
  getAccount,
} from "../../request/api";
export default {
  data () {
    return {
      files: [], // 上传的照片file，最大为20个file
      dialogAdmin: false, //管理员弹窗显示
      dialogPhoto: false, //照片上传弹窗显示
      dialogBigPic: false, //照片上传弹窗显示
      count: 20,
      onEdit: false, // 首页照片是编辑状态：可选择提交或者下载
      inputClassName: "", // 输入班级名称
      inputTagsSearch: "", // 输入标签搜索
      classList: [], //  左侧班级列表
      tagsList: [], // 标签列表
      uploadersList: [], // 上传人标签列表
      showMoreTags: false, // 是否展示更多标签
      addUploadDisc: "", // 上传照片中的照片说明
      startUpload: false, // 开始上传标志
      isAdd: false, // 子账户新增标志
      tableData: [], // 子账户列表
      imgsInfo: [], //点击左侧得到照片渲染所有信息,
      imgs: [], //渲染的照片信息,
      allImgs: [],//是否有图片信息
      qiToken: "",
      domain: "",
      selectedClass: "",
      isShow: true, //是否显示上传人
      ceshiList: [],
      isChoosed: false,
      dateTime: '',
      loading: false,
      paramsTitle: [],
      paramsName: [],
      hasDesinfo: false,
      servalue: "",
      isMore: false, //图片显示更多控制样式,
      bigUrl: '',
      keys: [],
      time: {
        year: "",
        month: ""
      },
    };
  },
  filters: {
    formatDate: dateStr => {
      return Moment(dateStr).format("YYYY年MM月DD日");
    }
  },
  components: { headerVue, fileUpload },
  created () {
    // 获取班级列表
    this.getClassList();
    // 获取标签列表
    this.getMarkList();
    // 获取管理员标签列表
    this.getAdminMarkList();
    //获取七牛云token
    this.getQiNiutoken();
    this.viewSclImgs();
  },
  mounted () {
  },
  updated () {

    this.rowDateheight()
  },
  methods: {
    //重置标签模糊搜索
    resetTagsInput () {
      // 获取标签列表
      this.getMarkList();
      // 获取管理员标签列表
      this.getAdminMarkList();
      this.paramsTitle = []
      this.paramsName = []
      this.inputTagsSearch = ""
      this.dateTime = ""
    },
    // 获取班级列表
    getClassList () {
      queryClass(null).then(res => {
        if (res) {
          this.classList = res;
          this.classList.forEach(item => {
            item.selected = false;
          });
          this.classList = JSON.parse(JSON.stringify(this.classList));
        }
      });
    },
    // 获取标签列表
    getMarkList () {
      queryMark({ size: 13, page: 1 }).then(response => {
        if (response.data) {
          this.tagsList = response.data;
          this.tagsList.forEach(item => {
            item.selected = false;
          });
          this.tagsList = this.tagsList.filter(item => !!item.name);
          this.tagsList = JSON.parse(JSON.stringify(this.tagsList));
        }
      });
    },
    // 获取管理员标签列表
    getAdminMarkList () {
      queryAdminMark(null).then(response => {
        if (response) {
          this.uploadersList = response;
          this.uploadersList.forEach(item => {
            item.selected = false;
          });
          this.uploadersList = this.uploadersList.filter(item => !!item.name);
          this.uploadersList = JSON.parse(JSON.stringify(this.uploadersList));
        }
      });
    },
    // 班级模糊查询
    inputClass () {
      if (this.inputClassName.trim() === "") {
        this.getClassList();
      } else {
        inputClass({ name: this.inputClassName.trim() }).then(res => {
          if (res) {
            if (res.msg && res.msg === "结果为空") {
              this.$message({
                message: "查询结果为空!",
                type: "warning"
              });
              this.classList = [];
              return;
            }
            this.classList = res;
            this.classList.forEach(item => {
              item.selected = false;
            });
            this.classList = JSON.parse(JSON.stringify(this.classList));
          }
        });
      }
    },
    //点击班级选中
    selectClass (select) {
      this.isShow = false;
      this.loading = true;
      this.resetTagsInput()
      this.selectedClass = select;
      this.classList.forEach(item => {
        item.selected = false;
        if (select.id === item.id) {
          item.selected = true;
        }
      });
      const body = {
        id: select.id
      };
      getImgs(body).then(res => {
        this.allImgs = [];
        this.loading = false;
        this.imgsInfo = res;
        console.log(this.imgsInfo);

        this.imgsInfo.forEach(ele => {
          if (ele.user && ele.user.user_group) {
            let imgs = [];
            ele.user.user_group.forEach(item => {
              imgs = imgs.concat(item.images)
            })
            imgs.forEach(it => {
              const extra = {
                isChoosed: false
              }
              Object.assign(it, extra)
            })
            const newExtra = {
              imgs: imgs,
              isMore: false,
              moreRow: false,
            }
            Object.assign(ele.user, newExtra)
          }
        });
        //归档出所有的图片
        if (res && res.length !== 0) {
          this.imgsInfo.forEach(item => {
            this.allImgs = this.allImgs.concat(item.user.imgs)
          })
        }
        this.rowDateheight();
        const imgInfos = JSON.parse(JSON.stringify(this.imgsInfo))
        this.imgsInfo = imgInfos
      });
    },
    // 标签选择
    selectTags (item) {
      item.selected = !item.selected
      this.searchValue()
    },
    // 上传人选择
    selectUploaders (item) {
      item.selected = !item.selected
      this.searchValue()
    },
    //时间选择
    changeDate () {
      this.searchValue()
    },
    // 根据标签填入搜索框的value
    searchValue () {
      this.paramsTitle = []
      this.paramsName = []
      this.tagsList.forEach(item => {
        if (item.selected) {
          this.paramsTitle.push(item.name)
        }
      })
      this.uploadersList.forEach(item => {
        if (item.selected) {
          this.paramsName.push(item.name)
        }
      })
      this.inputTagsSearch =
        (this.dateTime ? this.dateTime : '') + (this.dateTime && (this.paramsTitle.length > 0 || this.paramsName.length > 0) ? '、' : '') +
        this.paramsTitle.join('、') + (this.paramsTitle.length > 0 && this.paramsName.length > 0 ? '、' : '') +
        this.paramsName.join('、');
    },
    //搜索图片查询
    searchResult () {
      let timsamp = new Date(this.dateTime).getTime()
      this.loading = true;
      const params = {
        title: this.paramsTitle || [],
        name: this.paramsName || [],
        time: timsamp || " ",
        cid: this.selectedClass.id || '',
        servalue: this.servalue || '',
      }
      searchImg(params).then(res => {
        this.allImgs = [];
        this.loading = false;
        if (res) {
          this.imgsInfo = res;
          this.imgsInfo.forEach(ele => {
            const extraUser = {
              user: {}
            }
            Object.assign(ele, extraUser)
            if (ele.user_group) {
              let imgs = [];
              ele.user_group.forEach(item => {
                imgs = imgs.concat(item.images)
              })
              imgs.forEach(it => {
                const extra = {
                  isChoosed: false
                }
                Object.assign(it, extra)
              })
              const newExtra = {
                imgs: imgs,
                name: ele.name,
                isMore: false,
                moreRow: false,
              }
              Object.assign(ele.user, newExtra)
            }
          })
          //   this.imgsInfo = [...this.imgsInfo]
          this.rowDateheight();
          const imgInfos = JSON.parse(JSON.stringify(this.imgsInfo))
          this.imgsInfo = imgInfos
          this.imgsInfo.forEach(item => {
            this.allImgs = this.allImgs.concat(item.user.imgs)
          })

        }
      })

    },

    /* 上传图片弹窗 */
    /**
     * Has changed
     * @param  Object|undefined   newFile   只读
     * @param  Object|undefined   oldFile   只读
     * @return undefined
     */
    inputFile: function (newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // 获得相应数据
        // console.log("response", newFile.response);
        if (newFile.xhr) {
          //  获得响应状态码
          //   console.log("status", newFile.xhr.status);
        }
      }

      // 自动上传
      //   if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
      //     if (!this.$refs.uploader.active) {
      //       this.$refs.uploader.active = true
      //     }
      //   }
    },
    /**
     * Pretreatment
     * @param  Object|undefined   newFile   读写
     * @param  Object|undefined   oldFile   只读
     * @param  Function           prevent   阻止回调
     * @return undefined
     */
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // 过滤不是图片后缀的文件
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          return prevent();
        }
      }
      // 创建 blob 字段 用于图片预览
      if (newFile) {
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }
      }
    },
    // 组件上传照片方法
    customAction (file, component) {
      console.log(file.active)
      const key = this.uuid();
      const token = this.qiToken; //从服务器拿的并存在本地data里
      const putExtra = {
        fname: '',
        params: {},
        mimeType: []
      };
      const config = {
        useCdnDomain: true //使用cdn加速
      };
      const observable = qiniu.upload(file.file, key, token, putExtra, config);
      observable.subscribe({
        next: result => {
          console.log(file.active)
          this.files.forEach(item => {
            if (item.name === file.name) {
              item.progress = result.total.percent
            }
          })
        },
        error: () => {
          this.$message(`${file.name}上传失败`);
        },
        complete: res => {
          this.keys.push(res.key);
          console.log(this.keys.length);
          if (this.files.length === this.keys.length) {
            //   const imgUrls = this.files.map(item => {
            //     return `${this.domain}/${item.name}`;
            //   });
            const imgUrls = this.keys.map(item => {
              return `${this.domain}/${item}`;
            });
            const body = {
              img: imgUrls,
              description: this.addUploadDisc
            };
            upLoadImg(body).then(res => {
              if (res.code === 1) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                this.addUploadDisc = "";
                this.files = [];
                this.viewSclImgs();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          }
        }
      });
    },

    /* 管理员设置弹窗 */
    // 打开管理员设置弹窗
    tableVisibleAdmin (value) {
      this.dialogAdmin = value;
      this.getUserList();
    },
    //获取子账户列表
    getUserList () {
      queryUserList({ size: 99999, page: 1 }).then(response => {
        if (response.data) {
          this.isAdd = false;
          this.tableData = response.data;
          this.tableData.forEach(item => {
            item.isNew = false;
          });
          this.tableData = JSON.parse(JSON.stringify(this.tableData));
        }
      });
    },
    // 管理员设置新增
    addUser () {
      this.isAdd = true;
      this.tableData.push({
        account: "",
        name: "",
        duty: "",
        department: "",
        scope: "",
        isNew: true
      });
    },
    // 保存子账户
    saveUser () {
      let newUser = [];
      this.loading = true;
      newUser = this.tableData.filter(item => {
        if (item.isNew) {
          return {
            account: item.account,
            name: item.name,
            duty: item.duty,
            scope: item.scope,
            department: item.department
          };
        }
      });
      newUser
      addTheUser(newUser).then(response => {
        if (response.code === 1) {
          this.loading = false;
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.getUserList();
        } else {
          this.loading = false;
          this.$message({
            message: response.msg,
            type: "error"
          });
        }
      });
    },
    //权限切换
    scopeChange (row) {
      if (!row.id) return;
      const body = {
        id: row.id,
        scope: row.scope
      };
      updateScope(body).then(res => {
        if (res.code === 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.getUserList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    // 重置密码
    handleReset (index, row) {
      const body = {
        aid: row.id
      };
      resetPwd(body).then(res => {
        if (res.code === 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.getUserList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    // 隐藏按钮
    handleHidden (index, row) {
      const body = {
        id: row.id
      };
      hiddenPwd(body).then(res => {
        if (res.code === 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.getUserList();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //查询七牛云token
    getQiNiutoken () {
      qiniuToken(null).then(res => {
        if (res) {
          this.qiToken = res.uptoken;
          this.domain = res.domain;
        }
      });
    },
    //上传图片
    submitUpload () {
      if (!this.addUploadDisc) {
        this.hasDesinfo = true;
        this.$message({
          message: "请添加完照片并且输入描述信息之后再进行上传操作！",
          type: "warning"
        });
        return;
      }
      if (this.files.length === 0) {
        this.hasDesinfo = true;
        this.$message({
          message: "请添加完照片并且输入描述信息之后再进行上传操作！",
          type: "warning"
        });
        return;
      }
      this.$refs.uploader.active = true;

    },
    cancleUpload () {
      this.$refs.uploader.active = false;
    },
    //查看学校图片
    viewSclImgs () {
      if (this.selectedClass) { this.selectedClass.selected = false; this.selectedClass = "" }
      this.loading = true;
      this.isShow = true;
      this.resetTagsInput()
      schoolImg(null).then(res => {
        this.allImgs = [];
        this.loading = false;
        if (res) {
          this.imgsInfo = res;
          this.imgsInfo.forEach(ele => {
            const extraUser = {
              user: {}
            }
            Object.assign(ele, extraUser)
            if (ele.user_group) {
              let imgs = [];
              ele.user_group.forEach(item => {
                imgs = imgs.concat(item.images)
              })
              imgs.forEach(it => {
                const extra = {
                  isChoosed: false
                }
                Object.assign(it, extra)
              })
              const newExtra = {
                imgs: imgs,
                name: ele.name,
                isMore: false,
                moreRow: false,
              }
              Object.assign(ele.user, newExtra)
            }
          })
          this.imgsInfo.forEach(item => {
            this.allImgs = this.allImgs.concat(item.user.imgs)
          })

          //   this.imgsInfo = [...this.imgsInfo]
          this.rowDateheight();
          const imgInfos = JSON.parse(JSON.stringify(this.imgsInfo))
          this.imgsInfo = imgInfos
          console.log(imgInfos)
        }
      })
    },

    //选择图片
    changeImg (item) {
      if (!this.onEdit) {
        this.dialogBigPic = true;
        this.bigUrl = item.img_url;
        return;
      }
      item.isChoosed = !item.isChoosed;
      const selectList = this.allImgs.filter(it => it.isChoosed === true)

      if (selectList.length <= 20) {

        this.imgsInfo = [...this.imgsInfo]
      } else {
        item.isChoosed = false;
        this.imgsInfo = [...this.imgsInfo];
        this.$message({
          type: 'warning',
          message: "最多选择20张图片"
        })
      }

    },
    cancleCircle () {
      this.onEdit = !this.onEdit;
      this.resetImgStatus();
    },
    //下载
    download () {
      let imgList = []
      this.imgsInfo.forEach(item => {
        imgList = imgList.concat(item.user.imgs)
      })
      const selectList = imgList.filter(item => item.isChoosed);
      if (selectList.length === 0) {
        this.$message({
          type: "warning",
          message: "请先选择要下载的照片！"
        });
        return;
      }
      selectList.forEach(item => {
        if (item.img_url) {
          let image = new Image();
          image.setAttribute("crossOrigin", "anonymous");
          image.src = item.img_url;
          let names = item.img_url.split("/");
          let name = names[names.length - 1];
          image.onload = () => {
            let canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, image.width, image.height);
            canvas.toBlob(blob => {
              let url = URL.createObjectURL(blob);
              this.clickDownload(url, name);
              this.resetImgStatus();
              // 用完释放URL对象
              URL.revokeObjectURL(url);
            });
          };
        }
      });
    },
    clickDownload (href, name) {
      let eleLink = document.createElement("a");
      eleLink.download = name;
      eleLink.href = href;
      eleLink.click();
      eleLink.remove();
    },
    //提交
    submit () {
      let imgList = []
      this.imgsInfo.forEach(item => {
        imgList = imgList.concat(item.user.imgs)
      })
      const selectList = imgList.filter(item => item.isChoosed);
      if (selectList.length === 0) {
        this.$message({
          type: "warning",
          message: "请先选择要提交的照片！"
        });
        return;
      }
      this.loading = true;
      const ids = selectList.map(item => item.id);
      const body = {
        img: ids
      };
      submitImg(body).then(res => {
        this.loading = false;
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.resetImgStatus();
      });
    },
    resetImgStatus () {
      this.imgsInfo.forEach(ele => {
        if (ele.user && ele.user.imgs) {
          ele.user.imgs.forEach(item => {
            item.isChoosed = false
          })
        }
      })
      this.imgsInfo = [...this.imgsInfo]
    },
    nameBlur (row) {
      const body = {
        cn: row.name
      }
      getAccount(body).then(res => {
        if (res && res.code === 1) {
          row.account = res.data
        }
      })

    },
    desinfoChange (value) {
      if (value) { this.hasDesinfo = false }
    },
    //图片搜索值监听
    searchOperate (value) {
      this.servalue = value;
      if (!value) {
        this.tagsList.forEach(item => item.selected = false)
        this.uploadersList.forEach(item => item.selected = false)
        this.dateTime = "";
      }
    },
    changeIsMore (user) {
      user.isMore = !user.isMore;
      this.imgsInfo = [...this.imgsInfo]
    },
    rowDateheight () {
      this.imgsInfo.forEach((item, index) => {
        if (this.$refs && this.$refs[`element${index}`] && this.$refs[`element${index}`][0]) {
          if (this.$refs[`element${index}`][0].offsetHeight > 230) {
            item.user.moreRow = true
          } else {
            item.user.moreRow = false
          }
        }
      })

    },
    //uuid
    uuid () {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    },
    uploadModal () {
      this.dialogPhoto = true;
      this.files = [];
      this.addUploadDisc = "";
    }



  }
};
</script>

<style scoped>
/* 侧边栏 */
.aside {
  height: calc(100vh - 70px);
  background-color: #f1f1f1;
}
.search {
  margin: 37px 18px;
  width: 207px;
}
.search /deep/ .el-input__inner {
  color: #353535;
  background-color: transparent;
  border-color: #aaa;
  outline: none;
}
.search /deep/ .el-input__icon {
  height: 93%;
  font-size: 25px;
}
.search-title {
  position: relative;
  width: 220px;
  height: 46px;
  line-height: 46px;
  margin-left: 25px;
  margin-bottom: 20px;
  /* padding-left: 50px; */
  text-align: center;
  color: white;
  font-size: 18px;
  cursor: pointer;
  background-image: url("../../assets/images/05_14.png");
}
.search-title::before {
  position: absolute;
  right: 40px;
  top: 13px;
  width: 16px;
  height: 16px;
  transform: rotate(180deg);
  background-image: url("../../assets/images/向左_14.png");
  background-repeat: no-repeat;
  content: "";
}
.class-list {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: calc(100vh - 250px);
  overflow: auto;
}
.class-item {
  width: 168px;
  height: 32px;
  line-height: 32px;
  margin-bottom: 14px;
  text-align: center;
  color: #353535;
  background-color: #b8b8b8;
  border-radius: 16px 0 0 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.class-item:hover,
.class-item.active {
  color: white;
  background-color: #f8b626;
}
/* 内容头部 */
.header {
  display: flex;
  align-items: center;
  padding: 20px 54px;
  border-bottom: 1px solid #e5e5e5;
  background-color: #f8f8f8;
}
.header /deep/ .el-date-editor.el-input,
.header /deep/ .el-date-editor.el-input__inner {
  width: 120px;
}
.tag-search {
  width: 50%;
  min-width: 300px;
  margin-bottom: 15px;
}
.tag-search /deep/ .el-input__inner {
  color: #555555;
  outline: none;
}
.tag-search /deep/ .el-input-group__append {
  border: none;
  border-radius: 0;
}
.tag-search-btn {
  position: relative;
  top: 2px;
  width: 100px;
  padding: 7px 20px;
  font-size: 25px;
  color: white !important;
  border: none;
  border-radius: 0;
  background-image: url("../../assets/images/02_03.png");
}
.tags-container {
  display: flex;
}
.tags-type {
  width: 90px;
  min-width: 90px;
  font-weight: bold;
  color: #acacac;
  text-align: justify;
  text-align-last: justify;
  margin-bottom: 10px;
}
.tags-row {
  width: calc(100vw - 663px);
  min-width: 200px;
  height: 22px;
  overflow: hidden;
}
.tags-row.more-row {
  max-height: 54px;
}
.tags-row span,
.date-tag,
.more-tag {
  display: inline-block;
  height: 22px;
  line-height: 20px;
  padding: 0 10px 10px;
  margin-right: 30px;
  margin-bottom: 5px;
  border-radius: 2px;
  border: 1px solid #acacac;
  color: #f8b626;
  cursor: pointer;
}
.more-tag {
  width: 100px;
  color: #555555;
}
.tags-row span:active,
.tags-row span.active {
  color: white;
  background-color: #f8b626;
  border: 1px solid #f8b626;
}
.year-select,
.month-select,
.tags-type-more {
  width: 80px;
  height: 22px;
}
.year-select {
  margin-right: 15px;
}
.tags-row /deep/ .el-input__inner {
  height: 22px;
  color: #f8b626;
  background-color: transparent;
  border-radius: 2px;
  border: 1px solid #acacac;
}
.tags-row /deep/ .el-select .el-input.is-focus .el-input__inner {
  border: 1px solid #acacac;
}
.tags-row /deep/ .el-input__suffix {
  top: 10px;
}
.tags-row /deep/ .el-select .el-input .el-select__caret {
  color: #f8b626;
}
.tags-row /deep/ .el-input__prefix,
.tags-row /deep/ .el-input__suffix {
  top: -9px !important;
}
.add-photo-btn {
  display: inline-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100px;
  min-width: 100px;
  height: 100px;
  margin-left: 20px;
  color: white;
  background-color: #f8b626;
  cursor: pointer;
}
.add-photo-btn img {
  margin-bottom: 5px;
}
/* 内容 */
.main {
  height: calc(100vh - 306px);
  padding: 12px 54px 0;
  position: relative;
}
.main .noimgInfo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #ccc;
  font-size: 24px;
}
.date-tag {
  /* margin-bottom: 12px; */
  cursor: default;
}
.photographer {
  display: inline-block;
  color: #acacac;
  font-weight: bold;
  margin-bottom: 12px;
}
.scroll-photos {
  width: 100%;
}
.photos {
  display: flex;
  flex-wrap: wrap;
  background-color: #f1f1f1;
  padding-top: 10px;
  padding-left: 10px;
  max-height: 232px;
  overflow: hidden;
}
.more-imgs {
  overflow: auto;
  max-height: 100%;
}

.single-photo {
  position: relative;
  width: 100px;
  height: 100px;
  background-color: #fff;
  margin: 0.3125rem 0.625rem;
}
.single-photo img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100px;
}
.single-photo .choose-icon {
  position: absolute;
  width: 18px;
  height: 18px;
  top: 5px;
  right: 5px;
  background-image: url("../../assets/images/选择2_16.png");
  background-repeat: no-repeat;
  z-index: 99;
}
.single-photo .choose-icon.choosed {
  background-image: url("../../assets/images/选择_14.png");
  z-index: 99;
}
/* 底部按钮 */
.footer {
  display: flex;
  justify-content: space-between;
  padding: 12px 64px;
}
.footer button {
  width: 93px;
  height: 32px;
  padding: 0px 20px;
}
.footer /deep/ .el-button:focus,
.footer /deep/ .el-button:hover {
  color: #606266;
  background: #fff;
  border-color: 1px solid #dcdfe6;
}
.footer /deep/ .el-button:active {
  color: white;
  border-color: #f8b626;
  background-color: #f8b626;
}
.choose-photo button {
  padding: 0px 12px;
  border-color: #f8b626;
}
/* 返回顶部 */
.backtop {
  background-color: #b8b8b8;
  width: 45px;
  height: 45px;
  border-radius: 0;
}
/* 上传照片模态框 */
.dialog-photo .upload-title {
  font-size: 16px;
  color: #555;
}
.dialog-photo .upload-tip {
  color: #999;
}
.dialog-photo .upload-main {
  width: 100%;
  height: calc(100% - 142px);
  padding-right: 0;
  padding-left: 0;
  padding-bottom: 0;
}
.dialog-photo .upload-photos {
  display: flex;
  flex-wrap: wrap;
}
.dialog-photo .before-upload-photos {
  position: relative;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 180px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  transform: translate(-50%, -50%);
}
.dialog-photo .upload-single-photo {
  position: relative;
  width: 180px;
  height: 180px;
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #f1f1f1;
}
.dialog-photo .upload-single-photo .extraItem {
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 68px;
  left: 0;
  width: 100%;
  height: 44px;
  color: white;
  font-size: 24px;
  background-color: rgba(0, 0, 0, 0.5);
}
.dialog-photo .upload-single-photo .delete-btn {
  cursor: pointer;
}
.dialog-photo .upload-single-photo:hover .delete-btn {
  display: flex;
}
.dialog-photo .upload-single-photo .progress {
  display: flex;
  opacity: 0.9;
  z-index: 1;
}
.dialog-photo .upload-single-photo .progressText {
  display: flex;
  font-size: 14px;
  top: 0px;
  z-index: 1;
  background-color: transparent;
}
.dialog-photo .upload-single-photo .activeProgress {
  display: flex;
  top: 0px;
  background-color: #f8b626;
}
.dialog-photo .upload-single-photo img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 180px;
}
.dialog-photo .upload-footer {
  display: flex;
  width: 100%;
  padding: 25px 50px;
  background-color: #f1f1f1;
}
.dialog-photo .upload-btn {
  position: relative;
  width: 180px;
  min-width: 180px;
  height: 50px;
  margin-right: 20px;
  font-size: 18px;
  padding-left: 65px;
  /* background-color: #fff; */
  /* background-color: #f8b62b;
  border-color: #f8b62b; */
}
.dialog-photo .start-upload::before {
  position: absolute;
  content: "";
  top: 10px;
  left: 30px;
  width: 30px;
  height: 28px;
  background-repeat: no-repeat;
  background-image: url("../../assets/images/111_03.png");
}
.dialog-photo .cancle-upload {
  color: #999;
  background-color: transparent;
}
.dialog-photo .cancle-upload::before {
  position: absolute;
  content: "";
  top: 14px;
  left: 30px;
  width: 20px;
  height: 20px;
  border-color: #999;
  background-repeat: no-repeat;
  background-image: url("../../assets/images/close.png");
}
.dialog-photo .add-upload-disc /deep/ .el-textarea__inner {
  height: 50px;
}
.dialog-photo .add-photo {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 180px;
  margin-left: 20px;
  background-color: #e8e8e8;
  border: 1px solid #f1f1f1;
}
.dialog-photo .add-photo img {
  position: relative;
  top: -10px;
}
.dialog-photo .file-uploads {
  position: absolute;
  top: 0;
  height: 180px;
  width: 180px;
  padding-top: 125px;
  color: #b8b8b8;
}
/* 管理员设置弹窗 */
.dialog-admin .add-admin,
.dialog-admin .save-admin,
.dialog-admin .cancel-admin {
  width: 95px;
  height: 32px;
  line-height: 30px;
  padding: 0;
  color: #fff;
  border-color: #f8b626;
  background-color: #f8b626;
}
.dialog-admin .cancel-admin {
  margin-right: 10px;
  color: #f8b626;
  background-color: #fff;
}
.dialog-admin .admin-main {
  width: 100%;
  height: calc(100% - 142px);
  margin-bottom: 10px;
  padding: 0px 30px;
  border-top: 2px solid #e0e0e0;
}
.dialog-admin .hide-user-btn {
  cursor: pointer;
}
.dialog-admin .admin-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 25px 50px;
  /* border-top: 2px solid #e0e0e0; */
}
.el-input--suffix /deep/ .el-input__prefix {
  top: -8px;
  left: 5px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
.moreClass {
  position: relative;
}
.moreClass .moreChild {
  margin-top: 5px;
  font-size: 14px;
  border: 1px solid #acacac;
  padding-left: 20px;
  width: 114px;
  height: 22px;
  position: absolute;
  right: 0px;
}
.admin-main /deep/ .el-input__inner:focus {
  border-bottom: 3px solid #f8b626;
}
</style>
