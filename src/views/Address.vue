<template>
  <div class="address">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <Bg>
      <van-address-edit
        :area-list="areaList"
        detail-maxlength="30"
        show-postal
        :show-delete="!!aid"
        show-set-default
        show-search-result
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="save"
        :address-info="orginAddressInfo"
        @delete="removeAddress"
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
      // 地址
      areaList,

      // 地址id
      aid: "",

      // 地址初始值
      orginAddressInfo: {},
    };
  },
  components: {
    Bg,
  },
  created() {
    // 截取路由
    if (this.$route.params.aid) {
      this.aid = this.$route.params.aid;
      // 获取地址数据
      this.getAddressDataByAid();
    }
  },
  methods: {
    // 新增地址
    add(value) {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      // 合并处理数据
      let data = { ...value, tokenString, appkey: this.appkey };
      data.isDefault = Number(value.isDefault);
      delete data.country;
      console.log(data);
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
        this.$toast.clear();
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

    // 编辑地址
    edit(value) {
      let isEdit = false;
      // 判断用户修改地址了吗
      for (let key in this.orginAddressInfo) {
        if (this.orginAddressInfo[key] !== value[key]) {
          isEdit = true;
          break;
        }
      }

      // 如果修改了地址就发起请求
      if (isEdit) {
        let tokenString = this.$cookies.get("tokenString");
        if (!tokenString) {
          return this.$router.push({ name: "Login" });
        }

        // 复制value地址
        let address = {};
        address.aid = this.aid;
        address.name = value.name;
        address.tel = value.tel;
        address.province = value.province;
        address.city = value.city;
        address.county = value.county;
        address.addressDetail = value.addressDetail;
        address.areaCode = value.areaCode;
        address.postalCode = value.postalCode;
        address.isDefault = Number(value.isDefault);

        this.$toast.loading({
          message: "加载中",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          method: "POST",
          url: this.baseUrl + "/editAddress",
          data:{
            appkey:this.appkey,
            tokenString,
            ...address
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
          if (res.data.code == 30000) {

            this.$router.push({ name: "AddressList" });
          }
        });
      } else {
        this.$router.push({ name: "AddressList" });
      }
    },

    // 保存
    save(value) {
      if (this.aid) {
        this.edit(value);
      } else {
        // 新增地址
        this.add(value);
      }
    },

    // 获取地址数据
    getAddressDataByAid() {
      // 查询地址
      let tokenString = this.$cookies.get("tokenString");
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
        url: this.baseUrl + "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      }).then((res) => {
        console.log(res);
        this.$toast.clear();
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
        if (res.data.code == 40000) {
          let data = res.data.result[0];
          // !!转换成布尔值
          data.isDefault = !!data.isDefault;
          console.log(data);
          this.orginAddressInfo = data;
        } else {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        }
      });
    },

    // 删除地址
    removeAddress(value) {
      // 查询地址
      let tokenString = this.$cookies.get("tokenString");
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
        url: this.baseUrl + "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: value.aid,
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
        if (res.data.code == 10000) {
          this.$router.push({ name: "AddressList" });
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