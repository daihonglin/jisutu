<template>
  <!-- 导航 -->
  <div class="jst-nav" @click="handleClick">
    <!-- 左侧 -->
    <div class="nav-left">
      <slot></slot>
    </div>
    <!-- 中间 -->
    <div class="nav-center"> {{navCenter}} </div>
    <!-- 右侧 -->
    <div class="nav-right">
      <i class="iconfont iconjiantou1"></i>
    </div>
  </div>
</template>

<script>
export default {
  // props接收传值
  props: {
    navCenter: {
      type: String
    }
  },
  // 组件内部的方法
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
// 导航
.jst-nav {
  display: flex;
  height: 50px;
  align-items: center;
  border-bottom: 1px solid #ccc;
  // 左侧
  .nav-left {
    font-size: 16px;
    color: #000;
  }
  // 中间
  .nav-center {
    flex: 1;
    text-align: right;
    font-size: 12px;
    color: #777;
  }
  // 右侧
  .nav-right {
    margin-right: 10px;
    .iconjiantou1 {
      font-size: 16px;
    }
  }
}
</style>
