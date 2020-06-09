<template>
  <div class="jst-parent">
    <!-- 递归的组件将来展示在上面 -->
    <jst-parent
      v-if="commentObj.parent"
      :commentObj="commentObj.parent"
      @reply="reply"
      ></jst-parent>
    <div class="header">
      <div class="index">{{index}}</div>
      <div class="name">{{commentObj.user.nickname}}</div>
      <div class="time">{{commentObj.create_date | fromNow}}</div>
      <div class="reply" @click="reply(commentObj.id, commentObj.user.nickname)">回复</div>
    </div>
    <div class="content">{{commentObj.content}}</div>
  </div>
</template>

<script>
export default {
  name: 'JstParent',
  data () {
    return {
      index: 1, // 初始的index 有几层parent就加几次, 顶层的是1
      commentObject: {}
    }
  },
  // vue生命周期, 先准备数据, 再准备模板
  created () {
    this.commentObject = this.commentObj // 定义一个数据来存储父组件传递过来的对象
    while (this.commentObject.parent) {
      this.index++
      this.commentObject = this.commentObject.parent // 改变循环条件
    }
  },
  methods: {
    reply (id, nickname) {
      // console.log(id, nickname)
      this.$emit('reply', id, nickname)
    }
  },
  props: {
    commentObj: {
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
.jst-parent {
  border-bottom: 1px solid #ccc;
  .header {
    display: flex;
    align-items: center;
    padding: 10px;
    .index {
      margin-right: 10px;
      font-size: 12px;
    }
    .name {
      font-size: 14px;
      margin-right: 15px;
    }
    .time {
      font-size: 12px;
      flex: 1;
    }
    .reply {
      text-align: right;
    }
  }

  .content {
    padding: 10px;
    font-size: 16px;
  }
}
</style>
