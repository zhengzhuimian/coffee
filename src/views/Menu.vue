<template>
  <div class="menu">
    <div class="menu-nav">
        <van-nav-bar
      title="菜单"
      left-arrow
      @click-left="$router.go(-1)"
    />
    </div>
   
    <div class="menu-box">
      <div class="broadside">
        <van-sidebar v-model="activeKey">
          <van-sidebar-item
            v-for="(item, index) in type"
            :key="index"
            :title="item.typeDesc"
            @click="typeProducts(item.type)"
          />
        </van-sidebar>
      </div>
      <div class="commodity-content">
        <Commodity
          v-for="(item, index) in commodity"
          :key="index"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
import Commodity from "../components/Commodity.vue";
export default {
  name: "Menu",
  data() {
    return {
      activeKey: 0,
      // 类型
      type: [],
      // 商品
      commodity: [],
    };
  },
  components: {
    Commodity,
  },
  created() {
    this.coffeType();
    this.typeProducts("latte");
  },
  methods: {
    //  类型
    coffeType() {
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/type",
        params: {
          appkey: this.appkey,
        },
      }).then((res) => {
        // console.log(res.data.result)
        this.type = res.data.result;
        this.$toast.clear();
        if (res.data.code === 500) {
          this.hotProduct = res.data.result;
        }
      });
    },

    // 商品
    typeProducts(type) {
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
          value: type,
        },
      }).then((res) => {
        this.commodity = res.data.result;
        // console.log(this.commodity)
        this.$toast.clear();
        if (res.data.code === 500) {
          this.hotProduct = res.data.result;
        }
      });
    },
  },
};
</script>

<style>
</style>