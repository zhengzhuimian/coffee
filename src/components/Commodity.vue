<template>
  <div class="commodity" @click="geDetail(item.pid)">
    <div class="content">
      <div class="commodity-img">
        <img
          class="auto-img"
          :src="item.smallImg"
          alt=""
        />
      </div>
      <div class="introduce">
        <div class="introduce-name">
          <div class="name">{{item.name}}</div>
          <div class="english-name">{{item.enname}}</div>
        </div>
        <div class="price">￥{{item.price}}</div>
      </div>
    </div>
    <div class="icon" v-if="bool">
       <van-icon name="delete-o" size="16" @click.stop="notLike(item.pid)"/>
    </div>
   
  </div>
</template>

<script>
import "../assets/less/commodity.less";
export default {
    props:["item","bool","index"],
    methods: {
        // 详情页
        geDetail(pid){
            this.$router.push({name:"Detail",params:{pid}})
        },

        // 取消收藏
    notLike(pid) {
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
          pid:pid,
          tokenString,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 700) {
          return this.$router.push({ name: "Login" });
        }

        if (res.data.code == 900) {
            this.$emit("update:cancel",this.index)
        }
      });
    },
    },
};
</script>

<style>
</style>