<template>
  <div class="order">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <Bg>
      <van-tabs
        v-model="activeTabIndex"
        swipeable
        title-active-color="blue"
        :line-height="2"
        color="#0c34BA"
      >
        <van-tab title="标签 1">内容 1</van-tab>
        <van-tab title="标签 2">内容 2</van-tab>
        <van-tab title="标签 3">内容 3</van-tab>
      </van-tabs>
    </Bg>
  </div>
</template>

<script>
import "../assets/less/order.less";
import Bg from "../components/Bg.vue";
export default {
  name: "Order",
  data() {
    return {
      activeTabIndex: 0,
    };
  },
  components: {
    Bg,
  },
  created() {
    this.getOrderData();
  },
  methods: {
    // 获取订单数据
    getOrderData() {
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
        url: this.baseUrl + "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: 0,
        },
      }).then((res) => {
        console.log(res.data.result);
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
        if (res.data.code == 70000) {
          // 去除重复的id
          let oids = [];
          // 改动后的数据
          let products = [];

          res.data.result.forEach((v) => {
            if (oids.indexOf(v.oid) === -1) {
              let o = {
                oid: v.oid,
                date: v.updatedAt,
                status: v.status,
                count: 0,
                total: 0,
                data: [],
              };
              // 去除重复id
              oids.push(v.oid);
              // 改动后数据
              products.push(o);
            }
          });
          products.forEach(value => {
              res.data.result.forEach(item =>{
                  if(value.oid === item.oid){
                    value.data.push(item)
                    value.count += item.count;
                    value.total += item.count * item.price;
                  }
              })
            })

            console.log(products)
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