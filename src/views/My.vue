<template>
  <div class="my" v-if="userInfo">
    <!-- 背景图 -->
    <div class="my-bg">
      <!-- <van-uploader /> -->
    </div>
    <div class="my-box">
      <div class="my-info">
        <!-- 头像 -->
        <div class="my-img">
          <img
            class="auto-img"
            src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2867449984,3525681023&fm=26&gp=0.jpg"
            alt=""
          />
          <!-- 更换头像 -->
          <div class="up-img">
            <van-uploader :max-size="500 * 1024" @oversize="uploadAvatar" />
          </div>
        </div>
        <div class="my-text">
          <!-- 名称  简介 -->
          <div class="my-name one-text">{{ userInfo[0].nickName }}</div>
          <div class="my-desc one-text">
            {{ userInfo[0].dsec ? userInfo[0].desc : "什么都没有" }}
          </div>
        </div>
      </div>

      <!-- 列表 -->
      <div class="my-list">
        <div
          class="my-list-icon"
          v-for="(item, index) in cellData"
          :key="index"
          @click="$router.push({ name: item.name })"
        >
          <div>
            <van-icon :name="item.icon" size="25" />
          </div>
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>

    <!-- 猜你喜欢 -->
    <div class="like">
      <van-divider
        :style="{
          color: '#00A862',
          borderColor: '#d5d3d3',
          padding: '0 16px',
        }"
      >
        猜你喜欢
      </van-divider>

      <div>
        <Commodity
          v-for="(item, index) in GuessLike"
          :key="index"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/my.less";
import Commodity from "../components/Commodity.vue";
export default {
  name: "My",
  components: { Commodity },
  data() {
    return {
      cellData: [
        { title: "我的订单", name: "Order", icon: "todo-list-o" },
        { title: "我的收藏", name: "CollectionPage", icon: "star-o" },
        { title: "地址管理", name: "AddressList", icon: "envelop-o" },
        // { title: "安全中心", name: "" },
      ],
      userInfo: "",
      GuessLike: [],
    };
  },
  created() {
    // 获取用户信息
    this.getUserInfo();
    // 猜你喜欢
    this.like();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      let tokenString = this.$cookies.get("tokenString");
      // console.log(tokenString);
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: this.baseUrl + "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        // console.log(res);
        this.$toast.clear();
        // 失败
        if (res.data.code == 700) {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
          return this.$router.push({ name: "Login" });
        }
        // 成功
        if (res.data.code == "A001") {
          this.userInfo = res.data.result;
        } else {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        }
      });
    },

    // 上传头像
    uploadAvatar(file) {
      let types = ["png", "gif", "jpg", "jpeg"];
      let type = file.file.type.split("/")[1];

      if (types.indexOf(type) === -1) {
        return this.$toast.loading({
          message: `文件类型只支持${types.join(",")}`,
          forbidClick: true,
          duration: 1000,
        });
      }

      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");
      // 发起改图片
      let tokenString = this.$cookies.get("tokenString");
      // console.log(tokenString);
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: this.baseUrl + "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: type,
          serverBase64Img: base64,
        },
      }).then((res) => {
        // console.log(res);
        this.$toast.clear();
        // 失败
        if (res.data.code == 700) {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
          return this.$router.push({ name: "Login" });
        }
        // 成功
        if (res.data.code == "A001") {
        } else {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        }
      });
    },

    // 获取猜你喜欢
    like() {
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: "coffee",
        },
      }).then((res) => {
        this.GuessLike = res.data.result;
        console.log(this.GuessLike);
        this.$toast.clear();
        if (res.data.code === 500) {
          this.hotProduct = res.data.result;
        }
      });
    },

    aa(){
       this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: "coffee",
        },
      }).then((res) => {
        this.GuessLike = res.data.result;
        // console.log(this.GuessLike);
        this.$toast.clear();
        if (res.data.code === 500) {
          this.hotProduct = res.data.result;
        }
      });
    }
  },
};
</script>

<style>
</style>