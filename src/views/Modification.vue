<template>
  <div class="modification">
    <van-nav-bar title="修改密码" left-arrow @click-left="$router.go(-1)" />
    <div class="bg"></div>
    <div class="conten">
      <van-form @submit="onSubmit">
        <van-field
          v-model="formerPassword"
          label="旧密码"
          placeholder="请输入旧密码"
        />
        <van-field
          v-model="NewPassword"
          type="password"
          label="新密码"
          placeholder="请输入新密码"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant';
export default {
  name: "Modification",
  data() {
    return {
      formerPassword: "",
      NewPassword: "",
    };
  },
  methods: {
    //   修改密码
    onSubmit() {
      // 密码都有值的时候发起请求
      if (this.formerPassword && this.NewPassword) {
        this.axios({
          method: "POST",
          url: this.baseUrl + "/updatePassword",
          data: {
            appkey: this.appkey,
            tokenString: this.$cookies.get("tokenString"),
            password: this.NewPassword,
            oldPassword: this.formerPassword,
          },
        }).then((res) => {
          this.$router.push({ name: "Login" });
        });
      } else {
        Dialog.alert({
          message: "请输入密码",
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.modification {
  /deep/ .van-nav-bar .van-icon,
  .van-nav-bar__text,
  .van-nav-bar__title {
    color: #00a862;
  }
  .bg {
    width: 100%;
    height: 130px;
    background-color: #00a862;
  }
  /deep/ .van-button--round {
    background-color: #00a862;
    border: none;
    margin-top: 30px;
  }
  .conten {
    margin: 0 20px;
    background: white;
    position: relative;
    top: -25px;
    padding: 20px 0 5px 0;
    border-radius: 10px;
  }
}
</style>