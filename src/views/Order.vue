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
        @change="changeOrderStatus"
      >
        <van-tab v-for="(item, index) in tabs" :key="index" :title="item.title">
          <div v-if="orderData.length > 0">
            <div class="tab-box" v-for="(v1, i1) in orderData" :key="i1">
              <PayBox :pro-info="v1.proInfo">
                <!-- 订单编号 -->
                <template #pay-title>
                  <div class="pay-title-box">
                    <div class="pay-t">{{ v1.oid }}</div>
                    <!-- 订单状态 -->
                    <div class="pay-s" v-if="v1.status === 2">
                      <div class="pay-text">已完成</div>
                      <div class="pay-icon">
                        <van-icon name="delete-o" @click="removeOrder(v1.oid,i1)"/>
                      </div>
                    </div>
                    <div class="pay-s" v-if="v1.status === 1">
                      <div class="pay-text" @click="confirmOrder(v1,i1)">
                        确认收货
                      </div>
                    </div>
                  </div>
                </template>
                <template #order-item>
                  <OrderItem
                    v-for="(v2, i2) in v1.data"
                    :key="i2"
                    :product="v2"
                  ></OrderItem>
                </template>
              </PayBox>
            </div>
          </div>
          <div v-else>
            <van-empty description="没有该状态的订单" />
          </div>
        </van-tab>
      </van-tabs>
    </Bg>
  </div>
</template>

<script>
import "../assets/less/order.less";
import Bg from "../components/Bg.vue";
import PayBox from "../components/PayBox.vue";
import OrderItem from "../components/OrderItem.vue";
export default {
  name: "Order",
  data() {
    return {
      activeTabIndex: 0,
      tabs: [
        {
          title: "全部",
          status: 0,
        },
        {
          title: "进行中",
          status: 1,
        },
        {
          title: "已完成",
          status: 2,
        },
      ],
      // 订单数据
      orderData: [],
    };
  },
  components: {
    Bg,
    PayBox,
    OrderItem,
  },
  created() {
    this.getOrderData(0);
  },
  methods: {
    // 获取订单数据
    getOrderData(status) {
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
          status,
        },
      }).then((res) => {
        // console.log(res.data.result);
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
                status: v.status,
                proInfo: {
                  date: v.updatedAt,
                  count: 0,
                  total: 0,
                },
                data: [],
              };
              // 去除重复id
              oids.push(v.oid);
              // 改动后数据
              products.push(o);
            }
          });
          products.forEach((value) => {
            res.data.result.forEach((item) => {
              if (value.oid === item.oid) {
                value.data.push(item);
                value.proInfo.count += item.count;
                value.proInfo.total += item.count * item.price;
              }
            });
          });
          // console.log(products)
          this.orderData = products;
        } else {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        }
      });
    },

    // 切换订单状态
    changeOrderStatus(name, title) {
      this.getOrderData(name);
    },

    // 确认订单
    confirmOrder(item,index) {
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
        url: this.baseUrl + "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid:item.oid
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
        if (res.data.code == 80000) {
          item.status = 2;

          if(this.activeTabIndex === 1){
            // 移除当前tab的订单数据
            this.orderData.splice(index,1)
          }
        }
        this.$toast.loading({
          message: res.data.msg,
          forbidClick: true,
          duration: 1000,
        });
      });
    },

    // 删除订单
    removeOrder(oid,index){
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
        url: this.baseUrl + "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
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
        if (res.data.code == 90000) {
              // 移除当前tab的订单数据
            this.orderData.splice(index,1)
        }
        this.$toast.loading({
          message: res.data.msg,
          forbidClick: true,
          duration: 1000,
        });
      });
    }
  },
};
</script>

<style>
</style>