<template>
  <div class="jst-user">
    <img
      :src="userInfo.head_img | jointUrl"
      alt="用户头像"
    >
    <div class="userinfo">
      <p class="name">{{userInfo.nickname}}</p>
      <p class="time">{{userInfo.create_date | handleTime}}</p>
    </div>
    <div class="cancel" @click="handleClick(userInfo.id)">取消关注</div>
  </div>
</template>

<script>
export default {
  props: ['userInfo'],
  methods: {
    handleClick (id) {
      this.$emit('click', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.jst-user {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ccc;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .userinfo {
    flex: 1;
    .name {
      font-size: 14px;
    }
    .time {
      font-size: 12px;
    }
  }

  .cancel {
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
    padding: 0 8px;
    background-color: #ccc;
  }
}
</style>
