<template>
  <div class="jst-excellent-comment">
    <!-- 头部 -->
    <div class="comment-header">
      <img :src="commentInfo.user.head_img | jointUrl" alt="" >
      <div class="info">
        <p class="name">{{commentInfo.user.nickname}}</p>
        <p class="time">{{commentInfo.create_date | fromNow}}</p>
      </div>
      <div class="reply" @click="reply(commentInfo.id,commentInfo.user.nickname)">回复</div>
    </div>
    <!-- 父评论 -->
    <jst-parent
      v-if="commentInfo.parent"
      :commentObj="commentInfo.parent"
      @reply="reply"
      ></jst-parent>
    <!-- 内容 -->
    <div class="comment-content">
      {{commentInfo.content}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    commentInfo: {
      type: Object
    }
  },
  methods: {
    // 事件处理函数, 触发父元素的事件传值, 由于是递归传值, 传递的值参数也一样, 函数就可以复用
    reply (id, nickname) {
      // console.log(id, nickname)
      this.$emit('reply', id, nickname)
    }
  }
}
</script>

<style lang="scss" scoped>
.jst-excellent-comment {
  padding: 15px;
  border-bottom: 1px solid #ccc;

  // 头部
  .comment-header {
    display: flex;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }
    .info {
      flex: 1;
      .name {
        font-size: 14px;
        color: #000;
      }
      .time {
        font-size: 12px;
        color: #ccc;
      }
    }
    .reply {
      font-size: 13px;
    }
  }
  // 父评论
  .jst-parent {
    border: 1px solid #ccc;
    margin-top: 10px;
  }
  // 内容
  .comment-content {
    font-size: 14px;
    margin-top: 15px;
  }
}
</style>
