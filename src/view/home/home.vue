<template>
  <div>
    <header-vue @tableVisibleAdmin="tableVisibleAdmin"></header-vue>
    <el-container class="home">
      <!-- 左侧边栏 -->
      <el-aside class="aside" width="245px">
        <el-input class="search" placeholder="按入学年份搜索" v-model="selectEnterYear">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div class="search-title">学校图片</div>
        <div class="class-list">
          <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
            <li
              v-for="(item,index) in classList"
              :class="['infinite-list-item','class-item',item.selected?'active':null ]"
              :key="index"
              @click="selectClass( item.id)"
            >{{ item.name }}</li>
          </ul>
        </div>
      </el-aside>
      <!-- 右侧内容 -->
      <el-container>
        <!-- 头部标签 -->
        <el-header class="header" height="180px">
          <div>
            <el-input class="tag-search" v-model="inputTagsSearch" placeholder="请输入内容">
              <el-button class="tag-search-btn" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <div>
              <div class="tags-container">
                <div class="tags-type">选择标签：</div>
                <div class="tags-row">
                  <template v-for="(item,index) in tagsList">
                    <span @click="selectTags(item)" :key="index">{{ item.name}}</span>
                  </template>
                </div>
                <div class="tags-more"></div>
              </div>
              <div class="tags-container">
                <div class="tags-type">选择上传人：</div>
                <div class="tags-row">
                  <template v-for="(item,index) in uploadersList">
                    <span
                      v-if="index < 8"
                      @click="selectUploaders(item)"
                      :key="index"
                    >{{ item.name}}</span>
                  </template>
                </div>
                <div class="tags-more"></div>
              </div>
              <div class="tags-container">
                <div class="tags-type">选择日期：</div>
                <div class="tags-row">
                  <el-select
                    class="year-select"
                    v-model="time.year"
                    @change="yearSelect($event)"
                    placeholder="年份"
                  >
                    <el-option
                      v-for="(item,index) in yearList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-select
                    class="month-select"
                    v-model="time.month"
                    @change="monthSelect($event)"
                    placeholder="月份"
                  >
                    <el-option
                      v-for="(item,index) in monthList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <div class="add-photo-btn" @click="dialogPhoto = true">
            <img src="../../assets/images/添加_06.png" />
            <span>添加照片</span>
          </div>
        </el-header>
        <!-- 照片内容 -->
        <el-main class="main">
          <template>
            <div class="photos-item-container">
              <span class="date-tag">2018年5月4日</span>
              <div>
                <span class="photographer">摄影师：鹿久久</span>
                <div class="photos">
                  <div v-for="(i,index) in count" class="single-photo" :key="index">
                    <span v-if="onEdit" :class="['choose-icon','choosed']"></span>
                    <img src="../../assets/images/LOGO_03.gif" alt />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-main>
        <el-footer class="footer" height="56px">
          <div class="footer-left">
            <el-button v-if="onEdit" @click="onEdit = !onEdit">取消</el-button>
          </div>
          <div v-if="onEdit" class="footer-right">
            <el-button>提交</el-button>
            <el-button>下载</el-button>
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
    <el-dialog title="上传照片" :visible.sync="dialogPhoto" class="dialog-photo">
      <span slot="title">
        <span class="upload-title">上传照片</span>
        <span class="upload-tip">（每次上传照片最多不超过20张，上传过程中请不要删除照片）</span>
      </span>
      <el-container>
        <el-main class="upload-main">
          <div class="upload-photos">
            <div v-for="(file,index) in files" class="upload-single-photo" :key="index">
              <img v-if="file.blob" :src="file.blob" />
              <div v-if="file.active || file.progress !== '0.00'" class="extraItem progress">
                <span class="extraItem progressText">{{file.progress || 0}}%</span>
                <div class="extraItem activeProgress" :style="{width: file.progress + '%'}"></div>
              </div>
              <span v-else class="extraItem delete-btn" @click="$refs.uploader.remove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </div>
            <div class="add-photo" v-show="files.length<20">
              <img src="../../assets/images/add.png" />
              <file-upload
                ref="uploader"
                v-model="files"
                :multiple="true"
                :maximum="20"
                :custom-action="customAction"
                @input-file="inputFile"
                @input-filter="inputFilter"
              >添加照片</file-upload>
            </div>
          </div>
        </el-main>
        <el-footer height="100px" class="upload-footer">
          <el-button
            v-if="!$refs.uploader || !$refs.uploader.active"
            type="info"
            class="upload-btn start-upload"
            @click="$refs.uploader.active = true"
          >开始上传</el-button>
          <el-button
            v-else
            type="info"
            class="upload-btn cancle-upload"
            @click="$refs.uploader.active = false"
          >取消上传</el-button>
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
            placeholder="为了方便搜索，请按照时间、事件添加照片说明"
          ></el-input>
        </el-footer>
      </el-container>
    </el-dialog>
    <!-- 管理员设置弹窗 -->
    <el-dialog title="管理员设置" :visible.sync="dialogAdmin" class="dialog-admin">
      <span slot="title">
        <el-button type="primary" icon="el-icon-plus" class="add-admin">新增</el-button>
      </span>
      <el-container>
        <el-main class="admin-main">
          <el-table :data="tableData" style="width: 100%" height="100%">
            <el-table-column prop="date" label="部门" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="姓名" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="date" label="职务" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="登陆账号" width="182" show-overflow-tooltip></el-table-column>
            <el-table-column label="密码状态" width="100" class-name="pw-cell-class">
              <template slot-scope="scope">
                <span v-if="scope.row.status">已经自设</span>
                <span v-else>初始密码</span>
              </template>
            </el-table-column>
            <el-table-column label="权限开放" width="100" class-name="role-cell-class">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.open" size="mini">
                  <el-radio-button label="y">
                    <i class="el-icon-check"></i>
                  </el-radio-button>
                  <el-radio-button label="n">
                    <i class="el-icon-close"></i>
                  </el-radio-button>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="重置密码" width="100" class-name="retpw-cell-class">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">立即重置</el-button>
              </template>
            </el-table-column>
            <el-table-column label width="100">
              <template slot-scope="scope">
                <span @click="handleEdit(scope.$index, scope.row)">隐藏</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>-->
          </el-table>
        </el-main>
        <el-footer height="100px" class="admin-footer">
          <el-button class="cancel-admin">取消</el-button>
          <el-button type="primary" class="save-admin">保存</el-button>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import headerVue from '../header'
import fileUpload from 'vue-upload-component'
export default {
  data () {
    return {
      cell: '',
      files: [],
      dialogAdmin: false,
      dialogPhoto: false,
      count: 20,
      page: 0, //  班级列表page
      onEdit: false, // 编辑状态
      selectEnterYear: '', // 选中的入学年份
      inputTagsSearch: '', // input标签搜索
      classList: [], //  左侧班级列表
      tagsList: [], // 标签
      uploadersList: [], // 上传人
      addUploadDisc: '', // 添加照片说明
      startUpload: false, // 开始上传标志
      tableData: [{
        date: '政教处',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '政教处',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '政教处',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '政教处',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      time: {
        year: '',
        month: ''
      }, // 日期
      yearList: [
        {
          value: '',
          label: '年份'
        },
        {
          value: '2019',
          label: '2019'
        },
        {
          value: '2018',
          label: '2018'
        },
        {
          value: '2017',
          label: '2017'
        },
        {
          value: '2016',
          label: '2016'
        },
        {
          value: '2015',
          label: '2015'
        }
      ],
      monthList: [
        {
          value: '',
          label: '月份'
        },
        {
          value: '1月',
          label: '1月'
        },
        {
          value: '2月',
          label: '2月'
        },
        {
          value: '3月',
          label: '3月'
        }
      ]
    }
  },
  components: { headerVue, fileUpload },
  created () {
    this.getData()
    // 获取班级列表
    this.getClassList()
    // 获取标签列表
    this.getMarkList()
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    /**
     * Has changed
     * @param  Object|undefined   newFile   只读
     * @param  Object|undefined   oldFile   只读
     * @return undefined
     */
    inputFile: function (newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // 获得相应数据
        console.log('response', newFile.response)
        if (newFile.xhr) {
          //  获得响应状态码
          console.log('status', newFile.xhr.status)
        }
      }
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
          return prevent()
        }
      }
      // 创建 blob 字段 用于图片预览
      if (newFile) {
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
      }
    },
    // 组件上传照片方法
    customAction () {
      console.log(this.files)
    },
    // 获取标签列表
    getMarkList () {
      this.$axios.get(this.$api.getTagsList, { params: { size: 13, page: 1 } }).then(response => {
        console.log(response)
        let res = response.data
        this.tagsList = res.data
        this.tagsList.forEach(item => {
          item.selected = false
        })
        this.tagsList = JSON.parse(JSON.stringify(this.tagsList))
      })
    },
    // 获取班级列表
    getClassList () {
      let token = localStorage.getItem('Authorization');
      this.$axios.post(this.$api.getClassList, {
        token: token
      }).then(function (response) {
        console.log(response)
      }).catch(function (error) {
        console.log(error)
      });
      //   queryClass(null).then(res => {
      //     console.log('getClassList', res)
      //     this.classList = res.data
      //     this.classList.forEach(item => {
      //       item.selected = false
      //     })
      //     this.classList = JSON.parse(JSON.stringify(this.classList))
      //   })
    },
    getData () {
      this.uploadersList = [
        { id: 1, name: '摄影师' },
        { id: 2, name: '摄影师' },
        { id: 3, name: '摄影师' },
        { id: 4, name: '摄影师' },
        { id: 5, name: '摄影师' },
        { id: 6, name: '摄影师' },
        { id: 7, name: '摄影师' },
        { id: 8, name: '摄影师' },
        { id: 9, name: '摄影师' },
        { id: 10, name: '摄影师' },
        { id: 11, name: '摄影师' },
        { id: 12, name: '摄影师' },
        { id: 13, name: '摄影师' },
        { id: 14, name: '摄影师' },
        { id: 15, name: '摄影师' },
        { id: 16, name: '摄影师' },
        { id: 17, name: '摄影师' },
        { id: 18, name: '摄影师' },
        { id: 19, name: '摄影师' },
        { id: 20, name: '摄影师' }
      ]
      this.uploadersList.forEach(item => {
        item.selected = false
      })
      this.uploadersList = JSON.parse(JSON.stringify(this.uploadersList))
    },
    load () {
      this.page += 1
    },
    // 侧边栏入学年份班级选择
    selectClass (id) {
      this.classList.forEach(item => {
        item.selected = false
        if (id === item.id) {
          item.selected = true
        }
      })
    },
    // 标签选择
    selectTags (item) {
      console.log('Tags', item)
      this.searchValue(item.name)
    },
    // 上传人选择
    selectUploaders (item) {
      console.log('Uploaders', item)
      this.searchValue(item.name)
    },
    // 年份选择
    yearSelect (value) {
      console.log(value)
      this.searchValue(value)
    },
    // 月份选择
    monthSelect (value) {
      console.log(value)
      this.searchValue(value)
    },
    // 根据标签填入搜索框的value
    searchValue (value) {
      this.inputTagsSearch = this.inputTagsSearch.trim()
      if (!value) { return }
      if (this.inputTagsSearch.length === 0) {
        this.inputTagsSearch = value
      } else {
        this.inputTagsSearch = this.inputTagsSearch + ' 、' + value
      }
    },
    // 打开管理员设置弹窗
    tableVisibleAdmin (value) {
      this.dialogAdmin = value
    },
    // 开始上传事件
    startPhoto () {
      this.startUpload = true
    },
    // 取消上传事件
    canclePhoto () {
      this.startUpload = false
    }
  }
}
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
  padding-left: 50px;
  text-align: center;
  color: white;
  font-size: 18px;
  background-image: url("../../assets/images/05_14.png");
}
.search-title::before {
  position: absolute;
  left: 65px;
  top: 16px;
  width: 16px;
  height: 16px;
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
  width: calc(100vw - 563px);
  min-width: 200px;
  height: 22px;
  overflow: hidden;
}
.tags-row span,
.date-tag {
  display: inline-block;
  height: 22px;
  line-height: 20px;
  padding: 0 12px;
  margin-right: 30px;
  border-radius: 2px;
  border: 1px solid #acacac;
  color: #f8b626;
  cursor: pointer;
}
.tags-row span:active {
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
.add-photo-btn {
  display: inline-flex;
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
}
.date-tag {
  margin-bottom: 10px;
  cursor: default;
}
.photographer {
  display: inline-block;
  color: #acacac;
  font-weight: bold;
}
.photos {
  display: flex;
  flex-wrap: wrap;
  background-color: #f1f1f1;
  padding-top: 10px;
  padding-left: 10px;
  margin-top: 10px;
}
.single-photo {
  position: relative;
  width: 100px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #fff;
}
.single-photo img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
  max-width: 100px;
}
.single-photo .choose-icon {
  position: absolute;
  width: 18px;
  height: 18px;
  top: 5px;
  right: 5px;
  background-image: url("../../assets/images/选择2_16.png");
  background-repeat: no-repeat;
}
.single-photo .choose-icon.choosed {
  background-image: url("../../assets/images/选择_14.png");
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
  padding-bottom: 0;
}
.dialog-photo .upload-photos {
  display: flex;
  flex-wrap: wrap;
}
.dialog-photo .upload-single-photo {
  position: relative;
  width: 180px;
  height: 180px;
  margin-right: 20px;
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
  max-width: 180px;
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
  line-height: 32px;
  padding: 0;
  color: #fff;
  border-color: #f8b626;
  background-color: #f8b626;
}
.dialog-admin .cancel-admin {
  color: #f8b626;
  background-color: #fff;
}
.dialog-admin .admin-main {
  width: 100%;
  height: calc(100% - 142px);
  padding: 0px 30px;
  border-top: 2px solid #e0e0e0;
}
.dialog-admin .admin-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 25px 50px;
  border-top: 2px solid #e0e0e0;
}
.dialog-admin .cancel-admin {
  margin-right: 10px;
}
</style>
