<template>
  <div class="login">
    <!-- 关闭按钮 -->
    <div class="login-close">
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
    <!-- 密码 -->
    <jst-input
      type="password"
      placeholder="请输入密码"
      v-model="password"
      :validateReg="passwordReg"
      errMsg="密码为3~5位的数字"
    ></jst-input>
    <!-- 登录按钮 -->
    <jst-button @click="login">登录</jst-button>
    <!-- 提示 -->
    <p class="tip">没有账号? 立即<a @click="$router.push('/register')">注册</a></p>
  </div>
</template>

<script>
export default {
  // 组件生命周期钩子, 此时数据已准备完成
  created () {
    const { username, password } = this.$route.params
    if (username && password) {
      this.username = username
      this.password = password
    }
  },
  // 组件的数据
  data () {
    return {
      username: '',
      usernameReg: /^\d{3,10}$/,
      password: '',
      passwordReg: /^\d{3,5}$/
    }
  },
  // 组件的方法
  methods: {
    // 登录
    async login () {
      const result = this.usernameReg.test(this.username) && this.passwordReg.test(this.password)
      if (!result) return
      const res = await this.$axios.post('/login', {
        username: this.username,
        password: this.password
      })
      console.log(res)
      const { statusCode, message, data } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user_id', data.user.id)
        this.$router.push('/home')
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  padding: 20px;
  // 关闭按钮
  .login-close {
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
