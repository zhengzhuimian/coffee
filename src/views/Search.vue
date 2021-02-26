<template>
  <div class="Search">
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" />
    <Commodity v-for="(item, index) in searchData" :key="index" :item="item" />
    <!-- 搜索不到结果显示这个 -->
    <van-empty
      class="custom-image"
      image="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1285087026,2572595179&fm=26&gp=0.jpg"
      description="搜索不到商品"
      v-if="searchData == ''"
    >
    </van-empty>
  </div>
</template>

<script>
import Commodity from "../components/Commodity.vue";
export default {
  name: "Search",
  components: { Commodity },
  data() {
    return {
      searchData: "",
    };
  },
  created() {
    this.axios({
      method: "GET",
      url: this.baseUrl + "/search",
      params: {
        appkey: this.appkey,
        name: this.$route.query.search,
      },
    }).then((res) => {
      console.log(res.data.result);
      this.searchData = res.data.result;
    });
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar .van-icon,
/deep/ .van-nav-bar__text,
/deep/ .van-nav-bar__title {
  color: #00a862;
}
</style>