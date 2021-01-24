<template>
  <div class="home">

    <van-nav-bar>
      <template #left>
        <div class="home-title">
          <div>下午好</div>
          <div class="ussername one-text">Allen111111</div>
        </div>
      </template>
      <template #right>
        <van-search
          placeholder="请输入商品名称"
          shape="round"
        />
      </template>
    </van-nav-bar>


    <!-- 轮播图 -->
    <van-swipe @change="changeCurrentIndex" :autoplay="2000">
      <van-swipe-item v-for="(item,index) in bannerData" :key="index">
        <img @click="viewProduct(item.pid)" class="auto-img" :src="item.bannerImg" alt="">
      </van-swipe-item>
    
      <template #indicator>
        <div class="indicator-box">
          <div class="indicator-item" :class="{active:currentIndex === i}" v-for="(v,i) in bannerData" :key="i"></div>
        </div>
      </template>
    </van-swipe>

    <!-- 推荐 -->
    <div class="product-box">
      <div class="line">
        <span>热卖推荐</span>
      </div>
      <!-- 商品 -->
      <div class="product-items">
        <Product class="product-item" v-for="(item,index) in hotProduct" :product="item" :key="index">
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
import Product from '../components/Product.vue';

export default {
  name: "Home",
  components: {Product},
  data() {
    return {
      currentIndex:0,
      // 轮播图数据
      bannerData:[],
      // 推荐商品
      hotProduct:[]
    };
  },
  created(){
    this.getBannnerData()

    this.getHotProduct()
  },
  methods: {
    // 切换轮播图
    changeCurrentIndex(index){
      // console.log(index)
      this.currentIndex  = index
    },

    // 获取轮播图数据
    getBannnerData(){
      // this.$toast.loading({
      //   message:"加载中",
      //   forbidClick:true,
      //   duration:0
      // })

      this.axios({
        method:'GET',
        url:this.baseUrl + '/banner',
        params:{
          appkey:this.appkey
        }
      }).then(res=>{
        //  console.log(res)
         if(res.data.code === 300){
           this.bannerData = res.data.result
         }else{
           this.$toast({
            message:res.data.msg,
            forbidClick:true,
            duration:3000
          })
         }
      })
    },

    // 获取推荐商品
    getHotProduct(){
      //  this.$toast.loading({
      //   message:"加载中",
      //   forbidClick:true,
      //   duration:0
      // })
         this.axios({
        method:'GET',
        url:this.baseUrl + '/typeProducts',
        params:{
          appkey:this.appkey,
          key:'isHot',
          value:1
        }
      }).then(res=>{
        //  console.log(res)
          // this.$toast.clear();
         if(res.data.code === 500){
           this.hotProduct = res.data.result
         }
      })
    },

    // 查看商品详情
    viewProduct(pid){
      this.$router.push({name:'Detail',params:{pid}})
    }
  },
};
</script>
<style lang="less" scoped>
</style>