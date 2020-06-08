<template>
  <div class="jst-top">
    <!-- 回到顶部 -->
    <div class="gotop" v-show="gotop" @click="toTop" >Top</div>
  </div>
</template>

<script>
import { Throttle } from 'utils/tool'
export default {
  data () {
    return {
      gotop: false
    }
  },
  mounted () {
    // 此处true需要加上，不加滚动事件可能绑定不成功
    window.addEventListener('scroll', Throttle(this.handleScroll, 500), true)
  },
  methods: {
    handleScroll () {
      const scrolltop =
        document.documentElement.scrollTop || document.body.scrollTop
      scrolltop > 30 ? (this.gotop = true) : (this.gotop = false)
    },
    toTop () {
      let top = document.documentElement.scrollTop || document.body.scrollTop
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 50
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.jst-top .gotop {
  text-align: center;
  position: fixed;
  right: 50px;
  bottom: 30px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  background: white;
  color: #000000;
}
</style>
