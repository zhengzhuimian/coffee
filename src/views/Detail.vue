<template>
  <div class="detail">
    <van-nav-bar
      title="商品详情"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div>
      <img class="auto-img" :src="datailData.large_img" alt="" />
    </div>
    <div class="pro-info" v-if="datailData">
      <div class="pro-box">
        <div class="pro-name">
          <div class="ch-name">{{ datailData.name }}</div>
          <div class="en-name">{{ datailData.enname }}</div>
        </div>
        <div class="pro-price">&yen;{{ datailData.price }}</div>
      </div>

      <!-- 规格 -->
      <div class="rules">
        <div class="rule" v-for="(v1, i1) in datailData.rulesData" :key="i1">
          <div class="rule-title">{{ v1.title }}</div>
          <div class="rule-item">
            <div
              :class="{ active: v1.currentIndex === i2 }"
              v-for="(v2, i2) in v1.rule"
              :key="i2"
              @click="selectRule(v1, i2)"
            >
              {{ v2.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- 数量 -->
      <div class="count-box">
        <div class="select-count">选择数量</div>
        <div class="count">
          <van-stepper
            v-model="count"
            theme="round"
            button-size="22"
            disable-input
          />
        </div>
      </div>

      <!-- 描述 -->
      <div class="desc">
        <div class="desc-title">商品描述</div>
        <div class="desc-text">
          <div v-for="(item, index) in datailData.desc" :key="index">
            {{ index + 1 }}.{{ item }}
          </div>
        </div>
      </div>

      <van-goods-action>
        <van-goods-action-icon
          icon="bag"
          text="购物车"
          color="#666"
          :badge="shopabagCount > 0 ? shopabagCount : ''"
          @click="$router.push('/shopbag')"
        />
        <van-goods-action-icon
          icon="like"
          :text="likeStatus ? '已收藏' : '收藏'"
          :color="likeStatus ? 'red' : '#666'"
          @click="likeAndNotLike"
        />
        <van-goods-action-button
          color="rgb(113 156 138)"
          type="warning"
          text="加入购物车"
          @click="appShopbag(false)"
        />
        <van-goods-action-button
          color="#00A862"
          type="danger"
          text="立即购买"
          @click="buyNow"
        />
      </van-goods-action>
    </div>
  </div>
</template>
direc
<script>
import "../assets/less/detail.less";
import { utils } from "../assets/js/utils.js";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      pid: "",
      // 详情
      datailData: {},
      // 收藏状态
      likeStatus: false,

      // 选择数量
      count: 1,
    };
  },
  computed: {
    ...mapState(["shopabagCount", "isLoadShopbagCont"]),
  },
  created() {
    this.pid = this.$route.params.pid;
    // 获取详情
    this.getDetaiData();
    // 查询是否收藏
    this.getLikeProduct();
    // 获取购物车的数目
    this.getShopbagCount();
  },
  methods: {
    // 增加商品数量
    ...mapMutations(["changeShopbagCount", "changeIsLoadShopbagCont"]),

    // 获取购物车的数目
    getShopbagCount() {
      if (this.isLoadShopbagCont) {
        return;
      }
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        // console.log("不存在");
        return;
      }
      this.axios({
        method: "GET",
        url: this.baseUrl + "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        // console.log(res);
        //  未登陆
        if (res.data.code == 700) {
          return;
        }
        //  查询成功
        if (res.data.code == 8000) {
          // 购物车数量
          this.changeShopbagCount(res.data.result);
          this.changeIsLoadShopbagCont(true);
        }
      });
    },

    // 获取详情
    getDetaiData() {
      this.axios({
        method: "GET",
        url: this.baseUrl + "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code === 600) {
          let data = res.data.result[0];
          let rules = ["cream", "tem", "sugar", "milk"];
          data.rulesData = [];
          rules.forEach((v) => {
            if (!data[v]) {
              return;
            }
            let rulesText = data[v].split("/");

            let currentRule = {
              title: data[v + "_desc"],
              currentIndex: 0,
              rule: [],
            };

            rulesText.forEach((item) => {
              let o = {
                title: item,
              };
              currentRule.rule.push(o);
            });
            data.rulesData.push(currentRule);
          });

          // 处理商品描述
          data.desc = data.desc.split(/\n/);
          // console.log(data);
          this.datailData = data;
        }
      });
    },

    // 切换规格
    selectRule(item, index) {
      if (item.currentIndex == index) {
        return;
      }
      item.currentIndex = index;
    },

    // 收藏
    like() {
      let tokenString = this.$cookies.get("tokenString");
      // console.log(tokenString);
      if (!tokenString) {
        // console.log("不存在");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "POST",
        url: this.baseUrl + "/like",
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code == 700) {
          return this.$router.push({ name: "Login" });
        }

        if (res.data.code == 800) {
          // 收藏成功
          this.likeStatus = true;
        }
      });
    },

    // 收藏和取消收藏
    likeAndNotLike() {
      if (this.likeStatus) {
        // 取消收藏
        this.notLike();
      } else {
        this.like();
      }
    },
    // 查询是否收藏
    getLikeProduct() {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return;
      }
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code == 700) {
          return;
        }

        if (res.data.code == 1000) {
          if (res.data.result.length > 0) {
            // 收藏成功
            this.likeStatus = true;
          }
        }
      });
    },

    // 取消收藏
    notLike() {
      let tokenString = this.$cookies.get("tokenString");
      // console.log(tokenString);
      if (!tokenString) {
        // console.log("不存在");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "POST",
        url: this.baseUrl + "/notlike",
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code == 700) {
          return this.$router.push({ name: "Login" });
        }

        if (res.data.code == 900) {
          if (res.data.result === 1) {
            // 取消收藏
            this.likeStatus = false;
          }
        }
      });
    },

    // 添加购物车
    appShopbag(isBuy) {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        this.$router.push({name:"Login"})
        return;
      }
      let rules = [];
      // 获取规格
      this.datailData.rulesData.forEach((v) => {
        rules.push(v.rule[v.currentIndex].title);
      });
      this.axios({
        method: "POST",
        url: this.baseUrl + "/addShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          pid: this.pid,
          count: this.count,
          rule: rules.join("/"),
        },
      }).then((res) => {
        // console.log(res);
        //  未登陆
        if (res.data.code == 700) {
          return this.$router.push({ name: "Login" });
        }
        //  查询成功
        if (res.data.code == 3000) {
          if (res.data.status === 1) {
            // 增加商品数量
            this.changeShopbagCount(this.shopabagCount + 1);

            this.$toast({
              message: res.data.msg,
              // forbidClick: true,
              duration: 1000,
            });
          } else {
            this.$toast({
              message: res.data.msg,
              // forbidClick: true,
              duration: 1000,
            });
          }

          if (isBuy) {
            // 跳转到结算订单组件
            this.$router.push({ name: "Pay", query: { sids: res.data.sid } });
          }
        }
      });
    },

    // 立即购买
    buyNow() {
      // 因为没有立即购买的接口,只能通过调用购物车接口再去结算
      this.appShopbag(true);

    },
  },
};
</script>

<style>
</style>