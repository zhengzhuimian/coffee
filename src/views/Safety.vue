<template>
  <div class="safety">
    <van-nav-bar title="安全中心" left-arrow @click-left="$router.go(-1)" />
    <div class="bg"></div>
    <div class="conten">
      <div @click="modification">修改密码</div>
      <div @click="logout">注销账号</div>
    </div>
    <div class="quit" @click="quit">退出登录</div>
  </div>
</template>

<script>
import { Dialog } from "vant";
export default {
  name: "Safety",
  data(){
    return{
      // 确认注销
      cancel: false,
    }
  },
  methods: {
    // 退出登录
    quit() {
      this.$cookies.set("tokenString", 11, "1d");
      this.$router.push({ name: "Login" });
    },
    // 前往修改密码
    modification(){
       this.$router.push({name:'Modification'})
    },
    // 确认注销账号
    logout() {
      Dialog.confirm({
        message: "确认注销账号吗?",
      }).then(() => {
        // 再次调用
          this.cancal()
      });
       
    },
    // 注销账号
    cancal(){
       this.axios({
          method: "POST",
          url: this.baseUrl + "/destroyAccount",
          data: {
            appkey: this.appkey,
            tokenString: this.$cookies.get("tokenString"),
          },
        }).then((res) => {
          if (res.data.code == 700) {
            this.$toast.loading({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            // 跳转到登录页面
            this.$router.push({ name: "Login" });
          }
        });
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar .van-icon,
/deep/ .van-nav-bar__text,
/deep/ .van-nav-bar__title {
  color: #00a862;
}
.safety {
  .bg {
    width: 100%;
    height: 130px;
    background-color: #00a862;
  }
  .conten {
    position: relative;
    top: -25px;
    background-color: white;
    margin: 0 28px;
    text-align: center;
    padding: 10px 0px;
    border-radius: 10px;
    font-size: 16px;
    div {
      padding: 10px 0;
      border-bottom: 1px solid #e6e6e6;
      margin: 0 120px;
    }
  }
  .quit {
    width: 150px;
    height: 40px;
    line-height: 40px;
    color: white;
    background-color: #00a862;
    border-radius: 20px;
    text-align: center;
    font-size: 16px;
    margin: 0 auto;
    margin-top: 60px;
  }
}
</style>