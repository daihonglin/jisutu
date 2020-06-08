<template>
  <div class="search">
    <!-- 头部 -->
    <jst-header @click="search">
      <div class="inp">
        <input
          type="text"
          placeholder="请输入搜索内容"
          v-focus
          v-model="content"
        >
        <i class="iconfont iconsearch"></i>
      </div>
      <template v-slot:right>搜索</template>
    </jst-header>
    <!-- 底部, 需要动态控制显示隐藏 -->
    <div class="bottom" v-show="isShowHistroy">
      <!-- 历史记录 -->
      <div class="histroy">
        <h3>历史记录</h3>
        <ul>
          <li v-for="item in searchHistory" :key="item" @click="searchNew(item)">{{item}}</li>
        </ul>
      </div>
      <!-- 历史记录 -->
      <div class="hot">
        <h3>热门搜索</h3>
        <ul>
          <li v-for="item in hotList" :key="item" @click="searchNew(item)">{{item}}</li>
        </ul>
      </div>
    </div>
    <!-- 搜索到的内容 -->
    <div class="search-content" v-show="!isShowHistroy">
      <jst-product v-for="item in searchList" :key="item.id" :productInfo="item"></jst-product>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: '', // 搜索的内容
      searchList: [], // 搜索到的内容
      isShowHistroy: true, // 是否展示历史
      searchHistory: [], // 搜索历史
      hotList: ['关晓彤', '阿信', '科比', '美女']
    }
  },
  created () {
    this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
  },
  methods: {
    // 搜索
    async search () {
      // 如果没有数据 直接return
      if (!this.content.trim()) {
        return this.$toast('请输入需要搜索的内容')
      }
      /* 历史记录处理开始 */
      const index = this.searchHistory.findIndex(item => item === this.content)
      // 如果有这一项, 就删除
      if (index !== -1) {
        this.searchHistory.splice(index, 1)
      }
      // 删除之后再添加
      this.searchHistory.unshift(this.content)
      // 如果添加之后长度大于10
      if (this.searchHistory.length > 10) {
        // 删除最后一项
        this.searchHistory.pop()
      }
      /* 历史记录处理结束 */
      // 发送请求
      const res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.content
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 将后台获取的数据存储
        this.searchList = data
        if (data.length === 0) {
          this.$toast('没有数据了')
          return
        }
        this.isShowHistroy = false
      }
    },
    // 历史记录点击的搜索
    searchNew (item) {
      this.content = item
      this.search()
    }
  },
  watch: {
    searchHistory (newValue) {
      console.log(newValue)
      localStorage.setItem('searchHistory', JSON.stringify(newValue))
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  // 头部
  .inp {
    position: relative;
    input {
      font-size: 16px;
      height: 40px;
      padding-left: 40px;
      border-radius: 20px;
      background-color: #f2f2f2;
      border: 1px solid #ccc;
      font-weight: normal;
    }
    .iconsearch {
      position: absolute;
      left: 15px;
      top: 5px;
      font-size: 20px;
      color: #888;
    }
  }
  // 历史和热门
  .histroy,
  .hot {
    padding: 15px;
    h3 {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;
      li {
        width: 50%;
        font-size: 14px;
        margin-bottom: 3px;
      }
    }
  }
  .hot ul {
    border-bottom: none;
  }
}
</style>
