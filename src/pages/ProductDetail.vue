<template>
  <div class="product-detail" :class="{'comment':isWriting}">
    <!-- 头部 -->
    <div class="detail-header">
      <div
        class="left"
        @click="$router.go(-1)"
      >
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <i
          class="iconfont iconnew"
          @click="$router.push('/home')"
        ></i>
      </div>
      <div class="right">
        <div
          class="follow"
          v-if="productDetail.has_follow"
          @click="unFollow"
        >已关注</div>
        <div
          class="follow unfollow"
          v-if="!productDetail.has_follow"
          @click="follow"
        >关注</div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="content">
      <h3>{{productDetail.title}}</h3>
      <div class="user">
        <!-- 防止报错 -->
        <span
          class="name"
          v-if="productDetail.user"
        >{{productDetail.user.nickname}}</span>
        <span class="time">{{productDetail.create_date | handleTime}}</span>
      </div>
      <!-- 视频内容 -->
      <video
        v-if="productDetail.type === 2"
        :src="productDetail.content"
        controls
        loop
      ></video>
      <!-- 内容文字图片 -->
      <div class="info" v-else v-html="productDetail.content" ></div>

      <div class="bottom">
        <div
          class="good"
          :class="{'like':productDetail.has_like}"
          @click="toggleGood"
        >
          <i class="iconfont icondianzan"></i>{{productDetail.like_length}}
        </div>
        <div class="share">
          <i class="iconfont iconweixin"></i>微信
        </div>
      </div>
    </div>
    <!-- 评论区域 -->
    <div class="wonderful-comment">
      <h3>精彩跟帖</h3>
      <!-- 上拉加载组件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="100"
        :immediate-check="false"
        @load="onLoad"
      >
        <jst-excellent-comment
          v-for="item in commentList"
          :key="item.id"
          :commentInfo="item"
          @reply="reply"
        >
        </jst-excellent-comment>
      </van-list>
    </div>
    <!-- 底部默认展示 -->
    <div class="footer" v-if="!isWriting">
      <div class="write" @click="writeComment">写跟帖</div>
      <div class="icon-comment">
        <i class="iconfont iconpinglun-"></i>
        <span v-if="productDetail.comment_length">{{productDetail.comment_length}}</span>
      </div>
      <div class="icon-collect">
        <i :class="{'collected':productDetail.has_star}" class="iconfont iconshoucang" @click="toggleCollect"></i>
      </div>
      <div class="icon-share">
        <i class="iconfont iconfenxiang"></i>
      </div>
    </div>
    <!-- 底部写评论状态 -->
    <div class="footer-write-comment" v-else>
      <textarea
        rows="3"
        v-model="newComment"
        v-focus
        @blur="handleBlur"
        :placeholder="`回复:${replyName}`"
        ></textarea>
      <div class="send" @click="sendComment">发送</div>
    </div>
    <!-- 回到顶部 -->
    <jst-top></jst-top>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: -1, // 当前文章id
      parentId: -1, // 父级评论id
      productDetail: {}, // 文章信息对象
      isWriting: false, // 是否在写评论
      newComment: '', // 新评论
      commentList: [], // 评论列表
      pageIndex: 1, // 当前页
      pageSize: 8, // 每页多少条
      replyName: '文章', // 默认回复
      loading: false, // 默认加载状态
      finished: false // 是否加载完成
    }
  },
  created () {
    this.id = this.$route.params.id
    // 获取产品信息
    this.getProductDetail()
    // 获取评论列表
    this.getCommentList()
  },
  methods: {
    // 获取文章信息
    async getProductDetail () {
      const res = await this.$axios.get(`/post/${this.id}`)
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.productDetail = data
      }
    },
    // 取消关注
    async unFollow () {
      const id = this.productDetail.user.id
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode) {
        this.$toast(message)
        this.getProductDetail()
      }
    },
    // 关注
    async follow () {
      const id = this.productDetail.user.id
      const res = await this.$axios.get(`/user_follows/${id}`)
      const { statusCode, message } = res.data
      if (statusCode) {
        this.$toast.success(message)
        this.getProductDetail()
      }
    },
    // 切换点赞
    async toggleGood () {
      const id = this.productDetail.id
      const res = await this.$axios.get(`/post_like/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getProductDetail()
      }
    },
    // 切换收藏
    async toggleCollect () {
      const productId = this.productDetail.id
      const res = await this.$axios.get(`/post_star/${productId}`)
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getProductDetail()
      }
    },
    // 写评论
    writeComment () {
      this.isWriting = true
    },
    // 失去焦点, 隐藏编辑框
    handleBlur () {
      if (this.newComment.trim() === '') {
        this.isWriting = false
        this.newComment = ''
      }
    },
    // 发送评论
    async sendComment () {
      // 如果评论的是文章
      if (this.replyName === '文章') {
        const res = await this.$axios.post(`/post_comment/${this.id}`, {
          content: this.newComment
        })
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          this.pageIndex = 1
          this.commentList = []
          this.getCommentList()
          this.newComment = ''
          this.isWriting = false
        }
      } else {
        const res = await this.$axios.post(`/post_comment/${this.id}`, {
          content: this.newComment,
          parent_id: this.parentId
        })
        console.log(res)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          this.pageIndex = 1
          this.commentList = []
          this.getCommentList()
          this.newComment = ''
          this.isWriting = false
        }
      }
    },
    // 获取评论列表
    async getCommentList () {
      const res = await this.$axios.get(`/post_comment/${this.id}`, {
        params: {
          pageIndex: this.pageIndex, // 1
          pageSize: this.pageSize // 8
        }
      })
      console.log(res)
      const { statusCode, data } = res.data
      console.log('data', data)
      if (data.length < this.pageSize) {
        this.finished = true
      }
      console.log(data)
      if (statusCode === 200) {
        this.commentList = [...this.commentList, ...data] // 将之前的与现在的进行了拼接 key就重复了
      }
    },
    // 回复父级评论
    reply (id, nickname) {
      console.log(id, nickname)
      this.replyName = `@${nickname}`
      this.parentId = id
      this.isWriting = true
    },
    // 下拉触底时触发
    onLoad () {
      console.log('触底了')
      this.pageIndex++
      this.getCommentList()
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail {
  padding-bottom: 60px;

  // 头部
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #ccc;
    overflow: hidden;
    // 左侧
    .left {
      width: 40px;
      height: 100%;
      line-height: 59px;
      text-align: center;
      .iconjiantou2 {
        font-size: 20px;
      }
    }
    // 中间
    .center {
      flex: 1;
      text-align: left;
      .iconnew {
        height: 100%;
        font-size: 60px;
      }
    }
    // 右侧
    .right {
      margin-right: 10px;
      .follow {
        width: 80px;
        height: 32px;
        border-radius: 15px;
        border: 1px solid #ccc;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
      }
      .unfollow {
        border: 1px solid red;
        background-color: #ff0000;
        color: #fff;
      }
    }
  }
  // 内容
  .content {
    border-bottom: 3px solid #ccc;
    padding: 15px;
    h3 {
      font-size: 20px;
      font-weight: bold;
    }
    .user {
      color: #888;
      .name {
        margin-right: 10px;
      }
    }
    .info {
      padding-bottom: 15px;
      padding-top: 5px;
      font-size: 14px;
      line-height: 24px;
    }
    // 视频
    video {
      width: 100%;
    }
    // 点赞相关
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .good,
      .share {
        width: 80px;
        font-size: 14px;
        height: 32px;
        border: 1px solid #ccc;
        line-height: 30px;
        text-align: center;
        border-radius: 16px;
        .icondianzan {
          margin-right: 5px;
        }
      }
      .good {
        margin-left: 30px;
      }
      .good.like {
        border-color: red;
        color: red;
      }
      .share {
        margin-right: 30px;
        .iconweixin {
          margin-right: 5px;
          color: #15ca15;
        }
      }
    }
  }
  // 评论部分
  .wonderful-comment {
    h3 {
      font-size: 24px;
      text-align: center;
      padding: 15px 0;
    }
  }
  // 底部
  .footer {
    position: fixed;
    bottom: 0px;
    display: flex;
    height: 50px;
    width: 100%;
    border-top: 2px solid #ccc;
    background-color: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    .write {
      width: 180px;
      height: 30px;
      border-radius: 15px;
      background-color: #d7d7d7;
      line-height: 30px;
      padding-left: 20px;
    }
    .icon-comment {
      position: relative;
      span {
        position: absolute;
        left: 25px;
        font-size: 10px;
        background-color: red;
        height: 16px;
        line-height: 16px;
        border-radius: 8px;
        padding: 0 5px;
        color: #fff;
      }
    }
    .iconfont {
      margin: 0 15px;
      font-size: 22px;
    }
    .iconshoucang.collected {
      color: red;
    }
  }
  // 底部写评论
  .footer-write-comment {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    padding: 20px 10px 5px 10px;
    align-items: flex-end;
    background-color: #f2f2f2;
    border-top: 1px solid #ccc;
    textarea {
      flex: 1;
      border-radius: 10px;
      background-color: #d7d7d7;
      font-size: 16px;
      padding: 10px;
    }

    .send {
      width: 60px;
      height: 26px;
      border-radius: 13px;
      background-color: red;
      font-size: 14px;
      text-align: center;
      line-height: 26px;
      color: #fff;
      margin-left: 10px;
    }
}
}
.product-detail.comment {
  padding-bottom: 116px;
}
</style>
