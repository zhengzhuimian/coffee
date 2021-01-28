<template>
  <div class="address-list">
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <Bg>
      <van-address-list
        :list="list"
        default-tag-text="默认"
        :switchable="false"
        @add="add"
      />
    </Bg>
  </div>
</template>

<script>
import Bg from "../components/Bg.vue";
import "../assets/less/addressList.less";

export default {
  name: "AddressList",
  components: {
    Bg,
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getAddressListData();
  },
  methods: {
    add() {
      this.$router.push({ name: "Address" });
    },

    // 查询地址
    getAddressListData() {
      let tokenString = this.$cookies.get("tokenString");
      console.log(tokenString);
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
        url: this.baseUrl + "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        console.log(res);
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
        if (res.data.code == 20000) {
          // 添加属性
          res.data.result.forEach((v) => {
            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
            v.isDefault = Boolean(v.isDefault);

            // 赋值
            this.list = res.data.result;
          });
        } else {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        }
      });
    },
  },
};
</script>

<style>
</style>