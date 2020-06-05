<template>
  <div class="register">
    <!-- 关闭按钮 -->
    <div class="register-close">
      <i class="iconfont iconicon-test"></i>
    </div>
    <!-- 项目logo -->
    <h1 class="logo">
      <i class="iconfont iconnew"></i>
    </h1>
    <!-- 用户名 -->
    <jst-input
      placeholder="请输入用户名"
      v-model="username"
      :validateReg="usernameReg"
      errMsg="用户名为3~10位的数字"
    ></jst-input>
    <!-- 昵称 -->
    <jst-input
      placeholder="请输入昵称"
      v-model="nickname"
      :validateReg="nicknameReg"
      errMsg="昵称为1~3位中文"
    ></jst-input>
    <!-- 密码 -->
    <jst-input
      type="password"
      placeholder="请输入密码"
      v-model="password"
      :validateReg="passwordReg"
      errMsg="密码为3~5位的数字"
    ></jst-input>
    <!-- 登录按钮 -->
    <jst-button @click="register">注册</jst-button>
  </div>
</template>

<script>
export default {
  // 组件的数据
  data () {
    return {
      username: '',
      usernameReg: /^\d{3,10}$/,
      password: '',
      passwordReg: /^\d{3,5}$/,
      nickname: '',
      nicknameReg: /^[\u4e00-\u9fa5]{1,3}$/
    }
  },
  // 组件的方法
  methods: {
    // 登录
    async register () {
      const result = this.usernameReg.test(this.username) && this.passwordReg.test(this.password) && this.nicknameReg.test(this.nickname)
      if (!result) return
      const res = await this.$axios.post('/register', {
        username: this.username,
        password: this.password,
        nickname: this.nickname
      })
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.$router.push({
          name: 'login',
          params: {
            username: this.username,
            password: this.password
          }
        })
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  padding: 20px;
  // 关闭按钮
  .register-close {
    .iconicon-test {
      font-size: 27px;
    }
  }
  // 项目logo
  .logo {
    text-align: center;
    .iconnew {
      color: #d81e06;
      font-size: 126px;
    }
  }
  // 提示
  .tip {
    margin-top: 10px;
    font-size: 16px;
    text-align: center;
    a {
      color:rgb(84, 115, 219);
      text-decoration: underline;
    }
  }
}
</style>
