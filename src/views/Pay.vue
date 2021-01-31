<template>
  <div class="pay">
    <van-nav-bar
      title="订单结算"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    >
    </van-nav-bar>

    <div class="pay-box">
      <div class="select-box">
        <div class="select">
          <div class="s-address" @click="showAddressList">选择地址</div>
          <van-icon name="arrow" />
        </div>

        <!-- 地址 -->
        <div class="address-box" v-if="currentAddress.aid">
          <div class="user-info">
            <div class="user-name">{{ currentAddress.name }}</div>
            <div class="phone">{{ currentAddress.tel }}</div>
            <div class="default" v-if="currentAddress.isDefault">默认</div>
          </div>
          <div class="adddress-detail">{{ currentAddress.address }}</div>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="pay-info">
        <PayBox :pro-info="proInfo">
          <template #order-item>
            <OrderItem
              v-for="(item, index) in payShopbagData"
              :key="index"
              :product="item"
            ></OrderItem>
          </template>
        </PayBox>
      </div>
    </div>
    <van-popup v-model="show" position="bottom" closeable>
      <div class="address-boxing">
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="add"
          @select="selectAddress"
        />
      </div>
    </van-popup>

    <div class="pay-btn" >
      <van-button color="blue" block round @click="pay">立即结算</van-button>
    </div>
  </div>
</template>
<script>
import "../assets/less/pay.less";
import PayBox from "../components/PayBox.vue";
import OrderItem from "../components/OrderItem.vue";
import {mapState,mapMutations} from 'vuex'
export default {
  name: "Pay",
  data() {
    return {
      show: false,
      chosenAddressId: "",
      // 现有的地址
      list: [],
      // 当前地址信息
      currentAddress: {},
      // 结算商品的id
      sids: [],
      // 需要购买的购物车的商品数据
      payShopbagData: [],
      // 商品总数量和总价
      proInfo: {
        count: 0,
        total: 0,
      },
    };
  },
  components: {
    PayBox,
    OrderItem,
  },
  computed:{
    ...mapState(['shopabagCount'])
  },
  created() {
    // 截取id
    this.sids = this.$route.query.sids.split("-");

    // 地址数据
    this.getAddressListData();
    // 提交订单的信息
    this.getShopbagDataByPay();
  },
  methods: {
    ...mapMutations(['changeShopbagCount']),

    // 显示地址列表
    showAddressList() {
      this.show = true;
    },
    // 跳转新增地址页面
    add() {
      console.log(111);
      this.$router.push({ name: "Address" });
    },
    // 查询地址
    getAddressListData() {
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
        url: this.baseUrl + "/findAddress",
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
        if (res.data.code == 20000) {
          // 添加属性
          res.data.result.forEach((v) => {
            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
            v.isDefault = Boolean(v.isDefault);

            // 默认地址赋值
            if (v.isDefault) {
              this.chosenAddressId = v.id;
              this.currentAddress = { ...v };
            }
          });
          // 赋值
          this.list = res.data.result;
        } else {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        }
      });
    },

    // 选择地址
    selectAddress(item) {
      this.chosenAddressId = item.id;
      this.currentAddress = { ...item };

      this.show = false;
    },

    // 获取订单结算的商品
    getShopbagDataByPay() {
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
        url: this.baseUrl + "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
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
        if (res.data.code == 50000) {

          // 返回到这个页面如果数据为空跳转到首页
          if(res.data.result.length === 0 ){
            return this.$router.push({path:"/"})
          }

          // 累计件数和总价
          res.data.result.forEach((v) => {
            this.proInfo.count += v.count;
            this.proInfo.total += v.count * v.price;
          });
          this.payShopbagData = res.data.result;
        } else {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        }
      });
    },

    // 立即结算
    pay() {
      // 选择地址了吗
      if (!this.currentAddress.aid) {
        return this.$toast({
          message: "请选择收货地址",
          duration: 1000,
        });
      }

      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let data = {
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify(this.sids),
        phone: this.currentAddress.tel,
        address:this.currentAddress.address,
        receiver:this.currentAddress.name
      };

      this.axios({
        method: "POST",
        url: this.baseUrl + "/pay",
        data
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
        if (res.data.code == 60000) {
          // 修改购物袋数量
          this.changeShopbagCount(this.shopabagCount - this.sids.length)
          
          // 跳转订单页面
          this.$router.push({name:'Order'})
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