<template>
  <div class="jst-comment">
    <div class="time">{{commentInfo.create_date | handleTime('YYYY-MM-DD HH:mm')}}</div>
    <div class="parent-comment" v-if="commentInfo.parent">
      <p class="name">回复: {{commentInfo.parent.user.nickname}}</p>
      <p class="parent-content one-txt-cut">{{commentInfo.parent.content}}</p>
    </div>
    <div class="comment-info">{{commentInfo.content}}</div>
    <div class="original" @click="toOriginal">
      <div class="content one-txt-cut">原文：{{commentInfo.post.title}}</div>
      <i class="iconfont iconjiantou1"></i>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    commentInfo: Object
  },
  methods: {
    // 去详情页
    toOriginal () {
      const id = this.commentInfo.post.id
      this.$emit('click', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.jst-comment {
  padding: 15px;
  border-bottom: 1px solid #ccc;
  // 评论时间
  .time {
    color: #888;
    height: 20px;
    line-height: 20px;
  }
  // 父评论
  .parent-comment {
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #e4e4e4;
    border-radius: 10px;
    .name {
      font-size: 12px;
    }
    .parent-content {
      font-size: 14px;
    }
  }
  // 评论内容
  .comment-info {
    font-size: 14px;
    color: #000;
    height: 26px;
    line-height: 26px;
  }
  // 原文
  .original {
    display: flex;
    align-items: center;
    .content {
      padding-right: 20px;
    }
  }
}
</style>
