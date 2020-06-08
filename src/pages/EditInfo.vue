<template>
  <div class="edit-info">
    <!-- 头部 -->
    <jst-header>编辑资料</jst-header>
    <!-- 头像 -->
    <div class="img-wrap">
      <img v-if="userInfo.head_img" :src="userInfo.head_img | jointUrl" alt="点击更换头像" >
      <van-uploader :after-read="afterRead" />
    </div>
    <!-- 导航 -->
    <div class="nav-wrap">
      <jst-nav :nav-center="userInfo.nickname" @click="showNickNameDialog">昵称</jst-nav>
      <jst-nav nav-center="******" @click="showPasswordDialog">密码</jst-nav>
      <jst-nav :nav-center="userGender" @click="showGenderDialog">性别</jst-nav>
    </div>
    <!-- vue-cropper 组件 -->
    <div class="cropper-wrap" :class="{'cropper-show': isShowCropper}" >
      <vue-cropper
        ref="cropper"
        :img="option.img"
        autoCrop
        full
        original
        centerBox
        fixed
      ></vue-cropper>
      <van-button type="danger" @click="cancelUpload">取消上传</van-button>
      <van-button type="info" @click="sureUpload">确定上传</van-button>
    </div>
    <!-- 修改昵称弹出框组件 -->
    <van-dialog
    v-model="isShowNicknameDialog"
    title="修改昵称"
    show-cancel-button
    @confirm="sureEditNickname"
    >
      <van-field
      v-model="nickname"
      placeholder="请输入昵称"
      ref="nicknameInp"
      />
    </van-dialog>
    <!-- 修改密码弹出框组件 -->
    <van-dialog
    v-model="isShowPasswordDialog"
    title="修改密码"
    show-cancel-button
    @confirm="sureEditPassword"
    >
      <van-field
      v-model="password"
      placeholder="请输入密码"
      ref="passwordInp"
      :type="isClose ? 'password' : 'text'"
      :right-icon="isClose ? 'closed-eye' : 'eye-o'"
      @click-right-icon="toggleType"
      />
    </van-dialog>
    <!-- 修改性别弹出框组件 -->
    <van-dialog
    v-model="isShowGenderDialog"
    title="修改性别"
    show-cancel-button
    @confirm="sureEditGender"
    >
      <van-radio-group v-model="gender" direction="horizontal">
        <van-radio :name="1">男</van-radio>
        <van-radio :name="0">女</van-radio>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
// 导入vue-cropper组件
import { VueCropper } from 'vue-cropper'
export default {
  data () {
    return {
      id: '', // 用户id
      userInfo: {}, // 用户信息
      isShowCropper: false, // 是否展示裁切组件
      isShowNicknameDialog: false, // 是否展示修改昵称对话框
      isShowPasswordDialog: false, // 是否展示修改密码对话框
      isShowGenderDialog: false, // 是否展示修改性别对话框
      nickname: '', // 昵称
      nicknameReg: /^[\u4e00-\u9fa5]{1,3}$/, // 昵称正则
      password: '',
      passwordReg: /^\d{3,5}$/,
      isClose: true, // 是否展示闭眼图标
      gender: -1, // 单选框绑定的值
      // vue-cropper 配置项
      option: {
        img: '', // 图片的地址
        autoCrop: true, // 是否默认生成截图框
        full: true, // 是否生成原图比例的截图
        original: true, // 上传图片按照原始比例渲染
        centerBox: true // 截图框是否被限制在图片里面
      },
      headImg: '' // 上传到服务器的图片路径
    }
  },
  created () {
    this.getUserInfo()
  },
  // 局部组件
  components: {
    VueCropper
  },
  // 计算属性
  computed: {
    // 用户性别
    userGender () {
      return this.userInfo.gender === 1 ? '男' : '女'
    }
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      this.id = localStorage.getItem('user_id')
      const res = await this.$axios.get(`/user/${this.id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.userInfo = data
      }
    },
    // 文件上传完毕后会得到文件对象
    afterRead (file) {
      console.log('ok')
      console.log('file', file)
      this.isShowCropper = true
      this.option.img = file.content
    },
    // 取消上传
    cancelUpload () {
      this.isShowCropper = false
    },
    // 确定上传
    sureUpload () {
      // 获取截图的blob数据
      this.$refs.cropper.getCropBlob(async (fdData) => {
        const fd = new FormData()
        // 将截图的blob数据添加到fd中, 用于文件上传
        fd.append('file', fdData)
        // 文件上传
        const res = await this.$axios.post('/upload', fd)
        console.log(res)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          this.headImg = data.url
          this.editHeadImg()
        }
      })
    },
    // 修改头像
    async editHeadImg () {
      const res = await this.$axios.post(`/user_update/${this.id}`, { head_img: this.headImg })
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.isShowCropper = false
        this.$toast.success(message)
        this.getUserInfo()
      }
    },
    // 展示修改昵称对话框
    showNickNameDialog () {
      this.isShowNicknameDialog = true
      this.nickname = this.userInfo.nickname
      this.$nextTick(() => {
        this.$refs.nicknameInp.focus()
      })
    },
    // 确认修改昵称
    async sureEditNickname () {
      const res = this.nicknameReg.test(this.nickname)
      if (!res) {
        return this.$toast.fail('昵称为1~3位中文')
      }
      const result = await this.$axios.post(`/user_update/${this.id}`, {
        nickname: this.nickname
      })
      console.log(result)
      const { statusCode, message } = result.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getUserInfo()
      }
    },
    // 展示修改密码对话框
    showPasswordDialog () {
      this.isShowPasswordDialog = true
      this.password = this.userInfo.password
      this.$nextTick(() => {
        this.$refs.passwordInp.focus()
      })
    },
    // 确认修改密码
    async sureEditPassword () {
      const res = this.passwordReg.test(this.password)
      if (!res) {
        return this.$toast.fail('密码为3~5位的数字')
      }
      const result = await this.$axios.post(`/user_update/${this.id}`, {
        password: this.password
      })
      console.log(result)
      const { statusCode, message } = result.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getUserInfo()
      }
    },
    // 切换密码输入框的type类型
    toggleType () {
      this.isClose = !this.isClose
    },
    // 展示修改性别对话框
    showGenderDialog () {
      this.isShowGenderDialog = true
      this.gender = this.userInfo.gender
    },
    // 确定修改性别
    async sureEditGender () {
      const res = await this.$axios.post(`/user_update/${this.id}`, {
        gender: this.gender
      })
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getUserInfo()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-info {
  // 头像
  .img-wrap {
    padding: 25px 0;
    position: relative;
    img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin: 0 auto;
    }
    // 文件上传组件
    .van-uploader {
      position: absolute;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      overflow: hidden;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
    }
  }
  // 导航
  .nav-wrap {
    padding-left: 15px;
  }
  // 裁切组件
  .cropper-wrap {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
    &.cropper-show {
      display: block;
    }
    .van-button {
      position: fixed;
      bottom: 30px;
    }
    .van-button--danger {
      left: 20px;
    }
    // 一个定位元素既有left也有right时, 只有left生效
    // 一个定位元素既有top也有bottom时, 只有left生效
    .van-button--info {
      right: 20px;
    }
  }
  .van-radio-group {
    text-align: center;
  }
}
</style>

<style lang="scss">
.van-dialog__content {
  padding:  0 15px;
  .van-field {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }
  .van-radio-group {
    display: flex;
    justify-content: space-around;
    margin: 10px;
  }
}
.van-icon-eye-o {
  color: #216af9;
}

</style>
