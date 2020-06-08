<template>
<div class="collect">
  <jst-header>我的收藏</jst-header>
  <jst-product v-for="item in collectList" :key="item.id" :productInfo="item"></jst-product>
</div>
</template>

<script>
export default {
  data () {
    return {
      collectList: [] // 收藏的商品数据
    }
  },
  created () {
    this.getCollectList()
  },
  methods: {
    // 获取商品数据
    async getCollectList () {
      const res = await this.$axios.get('/user_star')
      console.log(res)
      const { statusCode, data } = res.data
      console.log(data)
      if (statusCode === 200) {
        this.collectList = data
      }
    }
  }
}
</script>

<style>

</style>
