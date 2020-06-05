<template>
  <div class="jst-header">
    <!-- 左侧 -->
    <div class="header-left" @click="$router.go(-1)">
      <i class="iconfont iconjiantou2"></i>
    </div>
    <!-- 中间 -->
    <div class="header-center">
      <slot></slot>
    </div>
    <!-- 右侧 -->
    <div class="header-right"></div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.jst-header {
  display: flex;
  height: 60px;
  border-bottom: 1px solid #ccc;
  align-items: center;
  // 左侧
  .header-left {
    width: 60px;
    height: 100%;
    line-height: 59px;
    text-align: center;
    .iconjiantou2 {
      font-size: 20px;
    }
  }
  // 中间
  .header-center {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  // 右侧
  .header-right {
    width: 60px;
  }
}
</style>
