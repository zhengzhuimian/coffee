<template>
  <div class="shopbag" @click-left="$router.go(-1)">
    <van-nav-bar
      title="购物车"
      left-text="返回"
      left-arrow
      @click-right="isEdit = !isEdit"
    >
      <template #right>
        <div>
          <div class="toggleEditStatus" v-if="shopbagData.length > 0">
            {{ !isEdit ? "完成" : "编辑" }}
          </div>
        </div>
      </template>
    </van-nav-bar>

    <div v-if="shopbagData.length > 0">
      <!-- 背景图片 -->
      <div class="shopbag-bg">
        <img class="auto-img" src="../assets/images/shopbag_bg.png" alt="" />
      </div>
      <!-- 购物车的商品 -->
      <div class="shopbag-box">
        <!-- 懒加载 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="到底啦！"
          @load="onLoad"
        >
          <!-- 右滑 -->
          <van-swipe-cell
            class="shopbag-cell"
            :disabled="isEdit"
            v-for="(item, index) in shopbagData"
            :key="item.sid"
          >
            <div class="shopbag-item">
              <div class="check">
                <van-checkbox
                  v-model="item.isChecked"
                  @change="simpleSelect"
                  icon-size="18px"
                ></van-checkbox>
              </div>
              <div class="pro-info">
                <div class="pro-img">
                  <img class="auto-img" :src="item.small_img" alt="" />
                </div>
                <div class="pro-text">
                  <div class="text-box">
                    <div class="pro-names">
                      <!-- 名字 -->
                      <div class="pro-name">{{ item.name }}</div>
                      <!-- 规格 -->
                      <div class="pro-rule">{{ item.rule }}</div>
                    </div>
                    <!-- 英文名 -->
                    <div class="pro-enname">{{ item.enname }}</div>
                  </div>
                  <div class="count-box">
                    <!-- 价格 -->
                    <div class="pro-price">&yen;{{ item.price }}</div>
                    <!-- 数量 -->
                    <div class="pro-count">
                      <van-stepper
                        v-model="item.count"
                        theme="round"
                        button-size="22"
                        disable-input
                        @change="updateShopbagCount(item.sid, item.count)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                class="shopbag-remove-btn"
                square
                type="danger"
                text="删除"
                @click="removeOne([item.sid], index)"
              />
            </template>
          </van-swipe-cell>
        </van-list>
      </div>

      <!-- 提交订单 -->
      <van-submit-bar v-show="isEdit" :price="total" button-text="提交订单">
        <van-checkbox v-model="checked" @click="allSelect">全选</van-checkbox>
      </van-submit-bar>
      <van-submit-bar
        v-show="!isEdit"
        button-text="删除"
        @submit="removeSelect"
      >
        <van-checkbox v-model="checked" @click="allSelect">全选</van-checkbox>
      </van-submit-bar>
    </div>
    <!-- 购物车为空时 -->
    <div v-else>
      <van-empty
        class="custom-image"
        image="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1285087026,2572595179&fm=26&gp=0.jpg"
        description="空购物车！"
      >
      </van-empty>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopbag.less";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Shopbag",
  data() {
    return {
      // 是否编辑商品
      isEdit: true,

      // 全选或取消
      checked: false,

      // 购物车所有数据
      shopbagAllData: [],

      // 购物车数据
      shopbagData: [],

      // 开始截取数据
      start: 0,

      // 获取10条数据
      count: 7,

      // 加载
      loading: false,
      // 是否加载完毕
      finished: false,

      // 总金额
      total: 0,
    };
  },
  computed: {
    ...mapState(["shopabagCount"]),
  },
  created() {
    this.getShopbagData();
  },
  methods: {
    ...mapMutations(["changeShopbagCount"]),
    // 购物车数据
    getShopbagData() {
      let tokenString = this.$cookies.get("tokenString");
      // console.log(tokenString);
      if (!tokenString) {
        // console.log("不存在");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code == 700) {
          return this.$router.push({ name: "Login" });
        }

        if (res.data.code == 5000) {
          res.data.result.forEach((v) => {
            v.isChecked = false;
          });
          // 购物车所有数据
          this.shopbagAllData = res.data.result;
          // 截取购物车数据
          this.shopbagData = this.shopbagAllData.slice(
            this.start,
            this.start + this.count
          );

          this.start += this.count;

          // 当所有数据小于截取开始值
          if (this.shopbagAllData.length < this.count) {
            this.finished = true;
            return;
          }
          // 触底加载
          this.loading = false;
        }
      });
    },

    // 懒加载数据
    onLoad() {
      setTimeout(() => {
        let data = this.shopbagAllData.slice(
          this.start,
          this.start + this.count
        );

        this.shopbagData.push(...data);
        this.start += this.count;
        // 取消全选
        if (data.length > 0) {
          this.checked = false;
        }
        if (data.length < this.count) {
          this.finished = true;
          return;
        }

        this.loading = false;
      }, 2000);
    },

    // 修改数量
    updateShopbagCount(sid, count) {
      let tokenString = this.$cookies.get("tokenString");
      // console.log(tokenString);
      if (!tokenString) {
        // console.log("不存在");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "POST",
        url: this.baseUrl + "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid,
          count,
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code == 700) {
          return this.$router.push({ name: "Login" });
        }

        if (res.data.code === 6000) {
          this.sum();
        }
      });
    },

    // 全选
    allSelect() {
      this.shopbagData.forEach((v) => {
        v.isChecked = this.checked;
      });
      this.sum();
    },

    // 单选
    simpleSelect() {
      this.sum();
      // console.log(this.shopbagData[0].isChecked);
      // 有一个单选没勾选,则全选不能勾
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isChecked) {
          this.checked = false;
          return;
        }
      }
      this.checked = true;
    },

    // 删除单个或多个购物车数据
    removeOne(sids, index) {
      let tokenString = this.$cookies.get("tokenString");
      // console.log(tokenString);
      if (!tokenString) {
        // console.log("不存在");
        return this.$router.push({ name: "Login" });
      }
      this.axios({
        method: "POST",
        url: this.baseUrl + "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code == 700) {
          return this.$router.push({ name: "Login" });
        }
        if (res.data.code == 7000) {
          // 单个删除
          if (index != undefined) {
            console.log(111);

            this.shopbagData.splice(index, 1);
            // 执行成功后购物车数量减1
            this.simpleSelect();
            this.changeShopbagCount(this.shopabagCount - 1);
          } else {
            // 多个删除
            for (let i = 0; i < this.shopbagData.length; i++) {
              if (this.shopbagData[i].isChecked) {
                this.shopbagData.splice(i, 1);
                i--;
              }
            }
            // 删除成功直接截取数据
            this.changeShopbagCount(this.shopabagCount - sids.length);
            // 重新计算总和
            this.sum();
          }

          // 在删除的过程中如果商品高度少于屏幕高度再次触发懒加载
          this.$nextTick(() => {
            let cells = document.querySelectorAll(".shopbag-cell");
            // 获取最后一个节点尺寸
            let cellSize = cells[cells.length - 1].getBoundingClientRect();
            // console.log(cellSize)
            // 获取最后一个节点距离页面顶部的距离
            let distance = cellSize.top;
            // 获取最后一个节点的高度
            let ceillHeight = cellSize.height;

            // 获取屏幕高度
            let innerHeight = window.innerHeight;
            // console.log(innerHeight);

            if (distance + ceillHeight - innerHeight <= 50) {
              // 触发懒加载
              this.onLoad();
            }
          });

          this.$toast({
            message: "删除成功",
            forbidClick: true,
            duration: 1000,
          });
        } else {
          this.$toast({
            message: "删除失败",
            forbidClick: true,
            duration: 1000,
          });
        }
      });
    },

    // 删除所选择的购物车商品
    removeSelect() {
      let sids = [];
      this.shopbagData.forEach((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast({
          message: "未选择删除商品",
          forbidClick: true,
          duration: 1000,
        });
        return;
      }
      this.removeOne(sids);
    },

    // 计算勾选商品的金额
    sum() {
      let total = 0;
      this.shopbagData.forEach((v) => {
        if (v.isChecked) {
          total += v.price * v.count;
        }
      });
      this.total = total * 100;
    },
  },
};
</script>

<style>
</style>