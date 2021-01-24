<template>
  <div class="shopbag" @click-left="$router.go(-1)">
    <van-nav-bar
      title="购物车"
      left-text="返回"
      :right-text="isEdit ? '完成' : '编辑'"
      left-arrow
      @click-right="isEdit = !isEdit"
    />
    <!-- 背景图片 -->
    <div>
      <img class="auto-img" src="../assets/images/shopbag_bg.png" alt="" />
    </div>
    <!-- 购物车的商品 -->
    <div class="shopbag-box">
      <!-- 右滑 -->
      <van-swipe-cell class="shopbag-cell" :disabled="isEdit">
        <div class="shopbag-item">
          <div class="check">
            <van-checkbox v-model="isCheck" icon-size="18px"></van-checkbox>
          </div>
          <div class="pro-info">
            <div class="pro-img">
              <img
                class="auto-img"
                src="http://www.kangliuyong.com:10002/images/product_small/IMG_0381_02p.jpg"
                alt=""
              />
            </div>
            <div class="pro-text">
              <div class="text-box">
                <div class="pro-names">
                  <!-- 名字 -->
                  <div class="pro-name">急急急</div>
                  <!-- 规格 -->
                  <div class="pro-rule">规格</div>
                </div>
                <!-- 英文名 -->
                <div class="pro-enname">sssss</div>
              </div>
              <div class="count-box">
                <!-- 价格 -->
                <div class="pro-price">&yen;222</div>
                <!-- 数量 -->
                <div class="pro-count">
                  <van-stepper
                    v-model="count"
                    theme="round"
                    button-size="22"
                    disable-input
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #right>
          <van-button class="shopbag-remove-btn" square type="danger" text="删除" />
        </template>
      </van-swipe-cell>
    </div>

    <!-- 提交订单 -->
    <van-submit-bar v-show="!isEdit" :price="0" button-text="提交订单">
  <van-checkbox v-model="checked">全选</van-checkbox>
</van-submit-bar>
 <van-submit-bar v-show="isEdit"  button-text="删除">
  <van-checkbox v-model="checked">全选</van-checkbox>
</van-submit-bar>
  </div>
</template>

<script>
import "../assets/less/shopbag.less";
export default {
  name: "Shopbag",
  data() {
    return {
      isEdit: true,
      isCheck: true,
      count: 1,
      checked:true
    };
  },
  methods: {},
};
</script>

<style>
</style>