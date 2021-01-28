<template>
  <div class="address">
    <van-nav-bar
      title="新增地址"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <Bg>
      <van-address-edit
        :area-list="areaList"
        detail-maxlength="30"
        show-postal
        show-delete
        show-set-default
        show-search-result
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="save"
      />
    </Bg>
  </div>
</template>

<script>
import Bg from "../components/Bg.vue";
import "../assets/less/address.less";
import areaList from "../assets/js/area";
export default {
  name: "AddressList",
  data() {
    return {
      areaList,
    };
  },
  components: {
    Bg,
  },
  methods: {
    save(value) {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      // 合并处理数据
      let data = { ...value, tokenString, appkey: this.appkey };
      data.isDefault = Number(value.isDefault);
      delete data.country;

      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: this.baseUrl + "/addAddress",
        data,
      }).then((res) => {
        console.log(res);
        this.$toast.clear()
        // 新增失败
        if (res.data.code == 700) {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
          return this.$router.push({ name: "Login" });
        }
        // 新增成功
        if (res.data.code == 9000) {
         
        //   this.$toast.loading({
        //     message: res.data.msg,
        //     forbidClick: true,
        //     duration: 1000,
        //   });
        this.$router.push({ name: "AddressList" });
        }
      });
    },
  },
};
</script>

<style>
</style>