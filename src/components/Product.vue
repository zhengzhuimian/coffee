<template>
  <div class="product" @click="geDetail(product.pid)">
    <div class="img-box">
      <img class="auto-img" :src="product.smallImg" alt="" />
    </div>
    <div class="pro-info">
      <div class="pro-name">{{ product.name }}</div>
      <div class="pro-enname">{{ product.enname }}</div>
      <div class="pro-price">
        <div class="price">&yen;{{ product.price }}</div>

        <!-- 删除插槽 -->
        <div class="delete-icon">
          <slot name="delete"></slot>
        </div>
      </div>
    </div>
    <slot name="hot"></slot>
  </div>
</template>

<script>
import "../assets/less/product.less";
export default {
  props: {
    product: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    // 商品详情
    geDetail(pid) {
      this.$router.push({ name: "Detail",params:{pid} });
    },
  },
};
</script>

<style>
</style>