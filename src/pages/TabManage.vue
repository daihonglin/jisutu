<template>
  <div class="tab-manage">
    <!-- 头部 -->
    <jst-header>栏目管理</jst-header>
    <!-- 激活的栏目 -->
    <div class="wrap">
      <p>点击删除以下频道</p>
      <ul class="tabs">
        <li
          v-for="(item,index) in activeTabList"
          :key="item.id"
          :class="index===1 || index === 0 ? 'no-del' : ''"
          @click="delTab(item.id)"
          >{{item.name}}</li>
      </ul>
    </div>
    <!-- 未激活的栏目 -->
    <div class="wrap">
      <p>点击添加以下频道</p>
      <ul class="tabs">
        <li
          v-for="item in delTabList"
          :key="item.id"
          @click="addTab(item.id)"
          >{{item.name}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeTabList: [], // 激活的tab栏列表
      delTabList: [] // 删除的tab栏列表
    }
  },
  created () {
    // 如果是第一次操作, 本地没有, 就发送请求
    // 如果本地已经有了, 就不用发送请求了
    const activeTabList = JSON.parse(localStorage.getItem('activeTabList'))
    const delTabList = JSON.parse(localStorage.getItem('delTabList'))
    if (activeTabList && delTabList) {
      this.activeTabList = activeTabList
      this.delTabList = delTabList
      return
    }
    this.getTabList()
  },
  methods: {
    // 获取数据
    async getTabList () {
      console.log('发送请求了')
      const res = await this.$axios.get('/category')
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.activeTabList = data
        localStorage.setItem('activeTabList', JSON.stringify(data))
        localStorage.setItem('delTabList', '[]')
      }
    },
    // 删除频道
    delTab (id) {
      if (id === 999 || id === 0) {
        return this.$toast('关注和头条不能删哦')
      }
      // 找到删除的这一项
      const delItem = this.activeTabList.find(item => item.id === id)
      // 删除数据
      this.delTabList.push(delItem)
      this.activeTabList = this.activeTabList.filter(item => item.id !== id)
    },
    // 添加频道
    addTab (id) {
      // 找出这一项
      const addItem = this.delTabList.find(item => item.id === id)
      // 删除这一项
      this.delTabList = this.delTabList.filter(item => item.id !== id)
      // 将这一项添加到激活项中
      this.activeTabList.push(addItem)
    }
  },
  watch: {
    activeTabList (newValue) {
      console.log(newValue)
      localStorage.setItem('activeTabList', JSON.stringify(newValue))
      localStorage.setItem('delTabList', JSON.stringify(this.delTabList))
    }
  }
}
</script>

<style lang="scss" scoped>
// 栏目管理
.tab-manage {
  // 激活栏目
  .wrap {
    padding: 8px;
    p {
      font-size: 12px;
    }
    .tabs {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      li {
        width: 80px;
        margin-right: 8px;
        margin-bottom: 5px;
        height: 40px;
        border: 1px solid #888;
        text-align: center;
        line-height: 38px;
        font-size: 14px;
      }
      li:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
  .no-del {
    background-color: #ccc;
  }
}
</style>
