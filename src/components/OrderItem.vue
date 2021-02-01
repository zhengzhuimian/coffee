<template>
  <div class="order-item">
      <div class="pro-img">
          <img class="auto-img" :src="product.small_img || product.smallImg" alt="">
      </div>
      <!-- 类型 -->
      <div class="pro-info">
        
          <div class="pro-top">
              <div class="pro-name">
                  <div class="p-name">{{product.name}}</div>
                  <div class="p-rule">{{product.rule}}/re</div>
              </div>
              <div class="p-enname">{{product.enname}}</div>
          </div>
         <!-- 价格 -->
          <div class="pro-bottom">
              <div class="p-price">{{product.price}}</div>
              <div class="p-count">x{{product.count}}</div>
          </div>
      </div>
  </div>
</template>

<script>
import '../assets/less/orderitem.less'
export default {
    props:{
        product:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    name:'OrderItem'
}
</script>

<style>

</style>