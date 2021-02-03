<template>
  <div class="main">
    <div>
      <!-- 二级路由 -->
      <router-view></router-view>
    </div>
    <van-tabbar
      v-model="activeIndex"
      active-color="#00A862"
      inactive-color="#646566"
      route
    >
      <van-tabbar-item
        v-for="(item, index) in tabbarData"
        :key="index"
        :badge="item.badge > 0 ? item.badge : ''"
        :dot="item.dot"
        :to="item.to"
      >
        <span>{{ item.title }}</span>
        <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState ,mapMutations} from "vuex";
export default {
  name: "Main",
  data() {
    return {
      activeIndex: 0,
     
    };
  },
  computed: {
    ...mapState(["shopabagCount",'isLoadShopbagCont',]),
    tabbarData(){
         return [
        {
          title: "首页",
          icon: {
            active: require("../assets/images/home_active.png"),
            inactive: require("../assets/images/home.png"),
          },
          to: "/",
        },
        {
          title: "购物车",
          icon: {
            active: require("../assets/images/shopping_highlight.png"),
            inactive: require("../assets/images/shopping.png"),
          },
          to: "/Shopbag",
          badge: this.shopabagCount,
        },
        {
          title: "我的",
          icon: {
            active: require("../assets/images/my_active.png"),
            inactive: require("../assets/images/my.png"),
          },
          to: "/My",
        },
      ]
    }
  },
  created() {
    this.getShopbagCount()
  },
  methods: {
    ...mapMutations(['changeShopbagCount','changeIsLoadShopbagCont']),
    // 获取购物车的数目
    getShopbagCount() {
      if(this.isLoadShopbagCont){
        return
      }
      let tokenString = this.$cookies.get("tokenString");
      // console.log(tokenString);
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
          // console.log(res.data.result)
          this.changeShopbagCount(res.data.result)
          this.changeIsLoadShopbagCont(true)
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  padding-bottom: 50px;
  /deep/ .van-info{
    background-color: #00A862;
  }
}
</style>