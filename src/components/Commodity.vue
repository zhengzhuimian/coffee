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
  </div>
</template>

<script>
import "../assets/less/commodity.less";
export default {
    props:["item"],
    methods: {
        // 详情页
        geDetail(pid){
            this.$router.push({name:"Detail",params:{pid}})
        }
    },
};
</script>

<style>
</style>