<template>
  <div class="home">
    <van-search
  shape="round"
   v-model="value"
  background="#f7f7f7"
  placeholder="请输入搜索关键词"
   @search="search"
/>
<!-- <input type="text" v-on:keyup.enter="search"> -->
    <!-- 轮播图 -->
    <van-swipe @change="changeCurrentIndex" :autoplay="3000">
      <van-swipe-item v-for="(item, index) in bannerData" :key="index">
        <img
          @click="viewProduct(item.pid)"
          class="auto-img"
          :src="item.bannerImg"
          alt=""
          height="220px"
        />
      </van-swipe-item>
    </van-swipe>

    <!-- 点我下单 -->
    <div class="menu-box" @click="$router.push({name:'Menu'})">
      <div class="menu">
        点我菜单
      </div>
    </div>

    <!-- 推荐 -->
    <div class="product-box">
      <div class="line">
        <span>热卖推荐</span>
      </div>
      <!-- 商品 -->
      <div class="product-items">
        <Product
          class="product-item"
          v-for="(item, index) in hotProduct"
          :product="item"
          :key="index"
        >
          <template #hot>
            <div class="hot-box">hot</div>
          </template>
        </Product>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
import Product from "../components/Product.vue";

export default {
  name: "Home",
  components: { Product },
  data() {
    return {
      currentIndex: 0,
      // 轮播图数据
      bannerData: [],
      // 推荐商品
      hotProduct: [],
      // 搜索名
      value:""
    };
  },
  created() {
    this.getBannnerData();

    this.getHotProduct();
  },
  methods: {
    // 切换轮播图
    changeCurrentIndex(index) {
      // console.log(index)
      this.currentIndex = index;
    },

    // 获取轮播图数据
    getBannnerData() {
      this.axios({
        method: "GET",
        url: this.baseUrl + "/banner",
        params: {
          appkey: this.appkey,
        },
      }).then((res) => {
        //  console.log(res)
        if (res.data.code === 300) {
          this.bannerData = res.data.result;
        } else {
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          });
        }
      });
    },

    // 获取推荐商品
    getHotProduct() {
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
          key: "isHot",
          value: 1,
        },
      }).then((res) => {
        // console.log(res);
        this.$toast.clear();
        if (res.data.code === 500) {
          this.hotProduct = res.data.result;
        }
      });
    },

    // 查看商品详情
    viewProduct(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },

    // gg() {
    //   this.axios({
    //     method: "GET",
    //     url: this.baseUrl + "/type",
    //     params: {
    //       appkey: this.appkey,
    //     },
    //   }).then((res) => {
    //     console.log(res);
    //     if (res.data.code === 300) {
    //     } else {
    //       this.$toast({
    //         message: res.data.msg,
    //         forbidClick: true,
    //         duration: 3000,
    //       });
    //     }
    //   });
    // },

    // 搜索结果
    search(){
      this.$router.push({path:'/search',query:{search:this.value}})
    }
  },
};
</script>
<style lang="less" scoped>
</style>