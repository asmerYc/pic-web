<template>
  <div>
    <header-vue></header-vue>
    <div class="home">
      <el-container>
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
                      <span
                        v-if="index < 8"
                        :class="item.selected?'active':null"
                        @click="selectTags(item.id)"
                        :key="index"
                      >{{ item.name}}</span>
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
                        :class="item.selected?'active':null"
                        @click="selectUploaders(item.id)"
                        :key="index"
                      >{{ item.name}}</span>
                    </template>
                  </div>
                  <div class="tags-more"></div>
                </div>
                <div class="tags-container">
                  <div class="tags-type">选择日期：</div>
                  <div class="tags-row">
                    <el-select class="year-select" v-model="time.year" placeholder="年份">
                      <el-option
                        v-for="(item,index) in yearList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    <el-select class="month-select" v-model="time.month" placeholder="月份">
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
              <div class="addPhotoBtn">
                <img src="../../assets/images/添加_06.png" />
                <span>添加照片</span>
              </div>
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
                      <span :class="['choose-icon','choosed']"></span>
                      <img src="../../assets/images/08_02.png" alt />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-main>
          <el-footer class="footer" height="56px">
            <div class="footer-left">
              <el-button>取消</el-button>
            </div>
            <div class="footer-right">
              <el-button>提交</el-button>
              <el-button>下载</el-button>
            </div>
          </el-footer>
        </el-container>
      </el-container>
    </div>
    <!-- 返回顶部 -->
    <el-backtop class="backtop" target=".main" :right="18" :bottom="110" :visibility-height="10">
      <img src="../../assets/images/07_25.png" />
    </el-backtop>
  </div>
</template>

<script>
import headerVue from '../header'
export default {
  data () {
    return {
      count: 50,
      page: 0, //  班级列表page
      selectEnterYear: '', // 选中的入学年份
      inputTagsSearch: '', // input标签搜索
      classList: [], //  左侧班级列表
      tagsList: [], // 标签
      uploadersList: [], // 上传人
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
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.classList = [
        { id: 1, name: '2018级1班' },
        { id: 2, name: '2015级6班' },
        { id: 3, name: '2018级1班' },
        { id: 4, name: '2018级1班' },
        { id: 5, name: '2018级1班' },
        { id: 6, name: '2018级1班' },
        { id: 7, name: '2018级1班' },
        { id: 8, name: '2018级1班' },
        { id: 9, name: '2018级1班' },
        { id: 10, name: '2018级1班' },
        { id: 11, name: '2018级1班' },
        { id: 12, name: '2018级1班' },
        { id: 13, name: '2018级1班' },
        { id: 14, name: '2018级1班' },
        { id: 15, name: '2018级1班' },
        { id: 16, name: '2018级1班' },
        { id: 17, name: '2018级1班' },
        { id: 18, name: '2018级1班' },
        { id: 19, name: '2018级1班' },
        { id: 20, name: '2018级1班' }
      ]
      this.tagsList = [
        { id: 1, name: '运动会' },
        { id: 2, name: '运动会' },
        { id: 3, name: '运动会' },
        { id: 4, name: '运动会' },
        { id: 5, name: '运动会' },
        { id: 6, name: '运动会' },
        { id: 7, name: '运动会' },
        { id: 8, name: '运动会' },
        { id: 9, name: '运动会' },
        { id: 10, name: '运动会' },
        { id: 11, name: '运动会' },
        { id: 12, name: '运动会' },
        { id: 13, name: '运动会' },
        { id: 14, name: '运动会' },
        { id: 15, name: '运动会' },
        { id: 16, name: '运动会' },
        { id: 17, name: '运动会' },
        { id: 18, name: '运动会' },
        { id: 19, name: '运动会' },
        { id: 20, name: '运动会' }
      ]
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
      this.classList.forEach(item => {
        item.selected = false
      })
      this.tagsList.forEach(item => {
        item.selected = false
      })
      this.uploadersList.forEach(item => {
        item.selected = false
      })
      this.classList = JSON.parse(JSON.stringify(this.classList))
      this.tagsList = JSON.parse(JSON.stringify(this.tagsList))
      this.uploadersList = JSON.parse(JSON.stringify(this.uploadersList))
    },
    load () {
      this.page += 1
    },
    selectClass (id) {
      this.classList.forEach(item => {
        item.selected = false
        if (id === item.id) {
          item.selected = true
        }
      })
    },
    selectTags (id) {
      this.tagsList.forEach(item => {
        if (id === item.id) {
          item.selected = !item.selected
        }
      })
    },
    selectUploaders (id) {
      this.uploadersList.forEach(item => {
        if (id === item.id) {
          item.selected = !item.selected
        }
      })
    },
  },
  components: { headerVue }
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
  position: relative;
  padding: 20px 54px;
  border-bottom: 1px solid #e5e5e5;
  background-color: #f8f8f8;
}
.tag-search {
  width: 50%;
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
  font-weight: bold;
  color: #acacac;
  text-align: justify;
  text-align-last: justify;
  margin-bottom: 10px;
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
.addPhotoBtn {
  position: absolute;
  right: 120px;
  top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100px;
  height: 100px;
  color: white;
  background-color: #f8b626;
  cursor: pointer;
}
.addPhotoBtn img {
  margin-bottom: 5px;
}
/* 内容 */
.main {
  height: calc(100vh - 306px);
  padding: 12px 54px 0;
}
.date-tag {
  margin-bottom: 10px;
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
.single-photo img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 100px;
  height: auto;
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
.el-button:hover {
  color: white;
  border-color: #f8b626;
  background-color: #f8b626;
}
/* 返回顶部 */
.backtop {
  background-color: #b8b8b8;
  width: 45px;
  height: 45px;
  border-radius: 0;
}
</style>
