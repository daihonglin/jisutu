<template>
  <div class="jst-product">
    <!-- 单图片 -->
    <div class="img-product">
      <div class="product-info">
        <p class="title txt-cut">{{productInfo.title}}</p>
        <!-- 三图片 -->
        <div class="img-wrap" v-if="productInfo.cover.length >=3">
          <img :src="item.url | jointUrl" alt="" v-for="item in productInfo.cover" :key="item.id">
        </div>
        <div class="video-img" v-if="productInfo.type === 2">
          <img :src="productInfo.cover[0].url | jointUrl" alt="">
          <div class="icon">
            <i class="iconfont iconshipin"></i>
          </div>
        </div>
        <p class="info">
          <span class="name">{{productInfo.user.nickname}}</span>
          <span>{{commentsLength}}跟帖</span>
        </p>
      </div>
      <img :src="productInfo.cover[0].url |jointUrl" alt="商品图片" v-if="productInfo.cover.length < 3 && productInfo.type === 1">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    productInfo: Object
  },
  computed: {
    // 评论条数处理
    commentsLength () {
      return this.productInfo.comments ? this.productInfo.comments.length : this.productInfo.comment_length
    }
  }
}
</script>

<style lang="scss" scoped>
.jst-product {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  // 商品图片展示
  .img-product {
    display: flex;
    align-items: center;
    // 左侧
    .product-info {
      flex: 1;
      .title {
        font-size: 14px;
      }
      // 三图片容器
      .img-wrap {
        display: flex;
        justify-content: space-between;
        img:nth-child(2) {
          margin: 0 3px;
        }
      }
      // 视频图片容器
      .video-img {
        position: relative;
        img {
          width: 100%;
          height: 150px;
        }
        .icon {
          position: absolute;
          width: 50px;
          height: 50px;
          text-align: center;
          line-height: 50px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .iconshipin {
          font-size: 40px;
          background-color: rgba(0, 0, 0, .3);
          border-radius: 50%;
          color: #fff;
        }
      }
      .info {
        font-size: 12px;
        color: #888;
        margin-top: 10px;
        .name {
          margin-right: 20px;
        }
      }
    }
    // 图片
    img {
      width: 120px;
      height: 75px;
      object-fit: cover;
    }
  }
}
</style>
