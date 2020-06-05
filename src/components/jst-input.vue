<template>
  <div class="jst-input">
    <!-- 表单元素 -->
    <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="handleInput"
      :class="[status]"
    />
    <!-- 提示文本 -->
    <span :class="{'show': isShow}">{{errMsg}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShow: false, // 是否显示提示
      status: '' // 控制下边框的颜色
    }
  },
  // 父组件传递过来的数据
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: [String],
    value: {
      type: String,
      required: true
    },
    validateReg: {
      type: RegExp
    },
    errMsg: {
      type: String
    }
  },
  // 组件的方法
  methods: {
    // 处理输入框输入的方法
    handleInput (e) {
      const value = e.target.value
      this.$emit('input', value)
      if (!this.validateReg) return
      const res = this.validateReg.test(value)
      if (res) {
        this.status = 'success'
        this.isShow = false
      } else {
        this.status = 'error'
        this.isShow = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.jst-input {
  position: relative;
  padding-bottom: 20px;
  // 输入框
  input {
    width: 100%;
    height: 36px;
    font-size: 18px;
    background-color: #f2f2f2;
    color: #9494ad;
    border-bottom: 1px solid #9494ad;
    &.success {
      border-bottom-color: green;
    }
    &.error {
      border-bottom-color: #d81e06;
    }
  }
  // 提示文字
  span {
    position: absolute;
    top: 36px;
    left: 0;
    color: #d81e06;
    display: none;
    &.show {
      display: block;
    }
  }
}
</style>
