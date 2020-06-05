<template>
  <div class="personal">
    <!-- 头部 -->
    <div class="user">
      <!-- 头像 -->
      <img :src="userInfo.head_img | jointUrl" alt="我的头像" >
      <!-- 用户信息 -->
      <div class="user-info">
        <p class="name">
          <i class="iconfont iconxingbienan" v-if="userInfo.gender === 1"></i>
          <i class="iconfont iconxingbienv" v-else></i>
          {{userInfo.nickname}}
        </p>
        <p class="time">{{userInfo.create_date | handleTime}}</p>
      </div>
      <!-- 右箭头 -->
      <div class="right-arrow">
        <i class="iconfont iconjiantou1"></i>
      </div>
    </div>
    <!-- nav导航 -->
    <div class="nav-wrap">
      <jst-nav navCenter="关注的用户">我的关注</jst-nav>
      <jst-nav navCenter="跟帖/回复">我的跟帖</jst-nav>
      <jst-nav navCenter="文章/视频">我的收藏</jst-nav>
    </div>
    <!-- 退出 -->
    <div class="logout">
      <jst-button>退出</jst-button>
    </div>
  </div>
</template>

<script>
export default {
  // 组件内部的数据
  data () {
    return {
      userInfo: {} // 个人信息
    }
  },
  // 数据已准备好, 可发ajax
  created () {
    this.getUserInfo()
  },
  // 组件的方法
  methods: {
    async getUserInfo () {
      const id = localStorage.getItem('user_id')
      const res = await this.$axios.get(`user/${id}`)
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.userInfo = data
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.personal {
  // 头部
  .user {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 5px solid #ccc;
    border-top: 5px solid #ccc;
    // 头像
    img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin-right: 20px;
    }
    // 用户信息
    .user-info {
      flex: 1;
      .name {
        font-size: 14px;
        .iconxingbienan {
          color: skyblue;
        }
      }

      .time {
        font-size: 12px;
        color: #888;
      }
    }
    // 右箭头
    .right-arrow {
      .iconjiantou1 {
        font-size: 20px;
      }
    }
  }
  // 导航容器
  .nav-wrap {
    padding-left: 15px;
    margin-bottom: 15px;
  }
  .logout {
    padding: 0 10px;
  }
}
</style>
