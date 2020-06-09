<template>
  <div class="home">
    <!-- 头部 -->
    <div class="home-header">
      <!-- logo -->
      <div class="logo">
        <i class="iconfont iconnew"></i>
      </div>
      <!-- 搜索 -->
      <div class="search" @click="$router.push('/search')">
        <i class="iconfont iconsearch"></i>
        搜索新闻
      </div>
      <!-- 我的 -->
      <div class="my" @click="$router.push('/personal')">
        <i class="iconfont iconwode"></i>
      </div>
    </div>
    <!-- tab栏 -->
    <van-tabs v-model="active" sticky background="#e4e4e4" @click="toggleTab" >
      <van-tab v-for="(item,index) in tabList" :key="item.id" :title="item.name" >
        <van-pull-refresh v-model="tabList[index].refreshing" @refresh="onRefresh">
          <!-- 下拉刷新组件 -->
          <van-list
            v-model="tabList[index].loading"
            :finished="tabList[index].finished"
            finished-text="没有更多了"
            :immediate-check="false"
            offset="100"
            @load="onLoad"
            >
          <!-- 商品组件列表 -->
            <jst-product
              v-for="item in tabList[index].productList"
              :key="item.id"
              :productInfo="item"
              @click="$router.push(`/product-detail/${item.id}`)"
            ></jst-product>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 回到顶部 -->
    <jst-top></jst-top>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: localStorage.getItem('token') ? 1 : 0, // 默认激活的tab栏
      tabList: [], // tab栏列表
      pageSize: 5 // 每一页请求多少条
    }
  },
  async created () {
    // 必须要等tab栏目数据回来之后才能发送商品的请求 异步的不能保证速度, 所以等待一下
    await this.getTabList()
    this.getProductList()
  },
  methods: {
    // 获取tab栏列表
    async getTabList () {
      const token = localStorage.getItem('token')
      // 如果有数据就从本地获取数据, 并且加一些属性
      const activeTabList = JSON.parse(localStorage.getItem('activeTabList'))
      if (activeTabList && token) {
        activeTabList.forEach(item => {
          item.productList = [] // 给每一项tab栏都添加一个数组用来存储该tab栏对应的商品列表, 防止服务器压力大
          item.loading = false // 给每一项都添加一个是否为加载中的装填
          item.finished = false // 给每一项都添加一个是否加载完成的状态
          item.pageIndex = 1 // 给每一项都添加一个初始页码, 初始值都为1
          item.refreshing = false // 给每一项都添加一个自己的刷新状态, 默认值为false, 不刷新
        })
        this.tabList = activeTabList
      } else {
        // 如果没有数据, 发送请求
        const res = await this.$axios.get('/category')
        const { statusCode, data } = res.data
        // 遍历获取到的tab栏数组
        data.forEach(item => {
          item.productList = [] // 给每一项tab栏都添加一个数组用来存储该tab栏对应的商品列表, 防止服务器压力大
          item.loading = false // 给每一项都添加一个是否为加载中的装填
          item.finished = false // 给每一项都添加一个是否加载完成的状态
          item.pageIndex = 1 // 给每一项都添加一个初始页码, 初始值都为1
          item.refreshing = false // 给每一项都添加一个自己的刷新状态, 默认值为false, 不刷新
        })
        if (statusCode === 200) {
          this.tabList = data
        }
      }
    },
    // 切换tab栏会触发的函数
    toggleTab (index) {
      // 先看数组中有没有数据
      if (this.tabList[index].productList.length > 0) {
        return
      }
      this.getProductList()
    },
    // 获取产品列表
    async getProductList () {
      console.log('获取数据了')
      // 获取激活项目的id
      const id = this.tabList[this.active].id
      // 获取到数据
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageSize: this.pageSize,
          pageIndex: this.tabList[this.active].pageIndex
        }
      })
      console.log('请求发送了')
      const { statusCode, data } = res.data
      if (data.length < this.pageSize) {
        this.tabList[this.active].finished = true
      }
      if (statusCode === 200) {
        // 将数据存储到对应tab项的productList中
        // 下一次获取这一栏目商品列表就先看是否productList里面已经有数据, 如果有, 直接使用, 如果没有 才读取
        this.tabList[this.active].productList = [...this.tabList[this.active].productList, ...data]
      }
    },
    // 上拉加载下一页触发
    onLoad () {
      console.log('加载更多吧')
      // console.log(this.tabList[this.active].loading)
      this.tabList[this.active].pageIndex++
      this.getProductList()
      this.tabList[this.active].loading = false
    },
    // 下拉刷新时触发
    async onRefresh () {
      // 清空本地商品数组
      this.tabList[this.active].productList = []
      // 将页码设置为1
      this.tabList[this.active].pageIndex = 1
      // 清空列表状态
      this.tabList[this.active].finished = false
      // 处于未加载状态
      this.tabList[this.active].loading = false
      // 重新获取数据
      await this.getProductList()
      // 需要等待上面的方法执行完毕之后, 才能将刷新的状态改为false, 不然数据还没回来, 就不刷新了, 不合理
      this.tabList[this.active].refreshing = false
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  // 头部
  .home-header {
    display: flex;
    height: 50px;
    background-color: #ff0000;
    align-items: center;
    color: #fff;
    overflow: hidden;
    // 标题
    .logo {
      width: 70px;
      text-align: center;
      .iconnew {
        font-size: 50px;
      }
    }
    // 搜索
    .search {
      flex: 1;
      height: 34px;
      border-radius: 17px;
      line-height: 34px;
      text-align: center;
      background-color: rgba(255, 255, 255, .5);
      font-size: 14px;
      .iconsearch {
      }
    }

    .my {
      width: 70px;
      text-align: center;
      .iconwode {
        font-size: 24px;
      }
    }
  }
}
</style>
