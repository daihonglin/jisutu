<template>
  <div class="jst-button" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  // 组件的方法
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.jst-button {
  height: 50px;
  background-color: #cc3300;
  font-size: 20px;
  border-radius: 25px;
  color: #fff;
  text-align: center;
  line-height: 50px;
}
</style>
