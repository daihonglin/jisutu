<template>
  <div class="attention">
    <!-- 头部 -->
    <jst-header>我的关注</jst-header>
    <!-- 关注用户列表 -->
    <jst-user
    v-for="item in attentionList"
    :key="item.id"
    :userInfo="item"
    @click="cancelAttention"
    ></jst-user>
  </div>
</template>

<script>
export default {
  data () {
    return {
      attentionList: []
    }
  },
  created () {
    this.getAttentionList()
  },
  methods: {
    // 获取数据
    async getAttentionList () {
      const res = await this.$axios.get('/user_follows')
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.attentionList = data
      }
    },
    // 取消关注
    async cancelAttention (id) {
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast(message)
        this.getAttentionList()
      }
    }
  }
}
</script>

<style>

</style>
