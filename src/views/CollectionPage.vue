<template>
  <div class="collection-page">
    <van-nav-bar title="个人收藏" left-arrow @click-left="$router.go(-1)" />
    <Commodity
      v-for="(item, index) in collectionData"
      :key="index"
      :item="item"
      :bool="true"
      :index="index"
      @update:cancel = "cancel"
    />
  </div>
</template>

<script>
import Commodity from "../components/Commodity.vue";
export default {
  name: "CollectionPage",
  components: { Commodity },
  data() {
    return {
      collectionData: [],
    };
  },
  created() {
    this.CollectionPage();
  },
  methods: {
    // 收藏的数据
    CollectionPage() {
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
        url: this.baseUrl + "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        //   console.log(res)
        this.collectionData = res.data.result;
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
        if (res.data.code == "2000") {
          this.$toast.loading({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        }
      });
    },
    // 删除取消的收藏的数据
    cancel(index){
        this.collectionData.splice(index,1)
        console.log(this.collectionData)
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar .van-icon,
/deep/ .van-nav-bar__text {
  color: #00a862;
}
/deep/ .van-nav-bar__title {
  color: #00a862;
}
</style>