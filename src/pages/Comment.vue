<template>
  <div class="comment">
    <jst-header>我的跟帖</jst-header>
    <!-- 上拉加载list组件 -->
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :immediate-check="false"
    offset="100"
    @load="onLoad" >
      <!-- 评论组件 -->
      <jst-comment v-for="item in commmentList" :key="item.id" :commentInfo="item" ></jst-comment>
    </van-list>
    <!-- 返回顶部 -->
    <jst-top></jst-top>
  </div>
</template>

<script>
export default {
  data () {
    return {
      commmentList: [], // 评论列表
      pageIndex: 1, // 页码
      pageSize: 5, // 每页几条
      loading: false, // 控制是否在加载状态
      finished: false // 控制是否已经加载完毕
    }
  },
  created () {
    this.getCommentList()
  },
  methods: {
    // 获取评论列表
    async getCommentList () {
      const res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      console.log('data', data)
      if (data.length < this.pageSize) {
        this.finished = true
      }
      if (statusCode === 200) {
        this.commmentList = [...this.commmentList, ...data]
      }
    },
    // 组件滚动到底部触发该函数
    onLoad () {
      // 发送ajax
      this.pageIndex++
      this.getCommentList()
      this.loading = false
    }
  }
}
</script>

<style>

</style>
