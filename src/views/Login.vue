<template>
  <div class="login">
    <RXnav />
    <div class="login-box">
      <div class="login-title-box">
        <div class="login-title">欢迎回来</div>
        <div class="login-sub-title">Please login to you acounts</div>
      </div>

      <div class="from-box">
        <van-field
          v-model="userLoginInfo.phone"
          label="手机号"
          placeholder="输入手机号"
        />
        <van-field
          v-model="userLoginInfo.password"
          label="密码"
          
          placeholder="输入密码"
         :type="isText ? 'text' : 'password'"
          :right-icon="isText ?'eye-o': 'closed-eye'"
          @click-right-icon="toggleType"
        />

      <div class="forgot"><span>忘记密码</span></div>
        <div class="btn-box">
          <van-button round block color='#0c34BA' @click="login">登&nbsp;&nbsp;&nbsp;录</van-button>
          <van-button  round block color='red' class="register-btn" type="default"  @click="openPopup">注册</van-button>
        </div>
      </div>

      <van-popup v-model="isOpen" closeable position="bottom">
        <div class="register-box">
          <div class="register-title">注册</div>
        </div>

        <div class="from-box">
        <van-field
          v-model="userRegisterInfo.phone"
          label="手机号"
          placeholder="输入手机号(11位)"
        />
        <van-field
          v-model="userRegisterInfo.password"
          label="密码"
       
          placeholder="输入密码(6-16位)"
           :type="isText ? 'text' : 'password'"
          :right-icon="isText ?'eye-o': 'closed-eye'"
          @click-right-icon="toggleType"
        />
       <van-field
          v-model="userRegisterInfo.nickName"
          label="昵称"
          placeholder="输入昵称(1-11位)"
        />
        <div class="btn-box">
          <van-button round block color='#0c34BA' @click="register">注&nbsp;&nbsp;&nbsp;册</van-button>
         
        </div>
      </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/login.less";

import RXnav from "../components/RXnav.vue";

import {utils} from '../assets/js/utils.js'
export default {
  name: "Login",
  data() {
    return {
      // 用户登录信息
      userLoginInfo: {
        phone: "",
        password: "",
      },
      // 用户注册信息
      userRegisterInfo:{
        phone:'',
        password:'',
        nickName:''

      },
      // 是否显示弹出层
      isOpen:false,

      isText:true
    };
  },
  components: {
    RXnav,
  },
  methods: {
    // 显示弹出层
    openPopup(){
      this.isOpen = true
    },

    // 注册
    register(){
      let o = {
        phone:{
          value:this.userRegisterInfo.phone,
          reg:/^1[3-9]\d{9}$/,
          errorMsg:'手机号格式不正确'
        },
         password:{
          value:this.userRegisterInfo.password,
          reg:/^[A-Za-z]\w{5,15}$/,
          errorMsg:'密码支持字母数字_组合且首字符是字母'
        },
         nickName:{
          value:this.userRegisterInfo.nickName,
          reg:/^[\u4e00-\u9fa5A-Za-z\d]{1,10}$/,
          errorMsg:'昵称支持汉字数字'
        },
      };

      // 验证表单
      if(!utils.validForm(o)){
          return;
      }

      // 发起注册请求
      this.$toast.loading({
        message:"加载中",
        forbidClick:true,
        duration:0
      })

      // 发起注册 
      this.axios({
        method:'POST',
        url:'http://www.kangliuyong.com:10002/register',
        data:{
          appkey:'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          nickName:this.userRegisterInfo.nickName,
          password:this.userRegisterInfo.password,
          phone:this.userRegisterInfo.phone
        }
      }).then(res=>{
        console.log(res)
        this.$toast.clear();
        if(res.data.code == 100 ){
          this.isOpen = false;
          for(let key in this.userRegisterInfo){
            this.userRegisterInfo[key] = ''
          }
        }else{
          this.$toast({
            message:res.data.msg,
            forbidClick:true,
            duration:3000
          })
        }
      }).catch(err=>{
        this.$toast.clear();
        console.log('err ==>', err)
      })
    },

    // 登录
    login(){
      let o = {
        phone:{
          value:this.userLoginInfo.phone,
          reg:/^1[3-9]\d{9}$/,
          errorMsg:'手机号码不正确'
        },
        password:{
          value:this.userLoginInfo.password,
          reg:/^[A-Za-z]\w{5,15}$/,
          errorMsg:'密码支持字母数字_组合且首字符必须为字母'
        }
      };

      // 验证表单
      if(!utils.validForm(o)){
        return;
      }

      // 发起登录请求
      this.$toast.loading({
        message:'加载中',
        forbidClick:true,
        duration:0
      })

      this.axios({
        method:'POST',
        url: this.baseUrl + '/login',
        data:{
          appkey:this.appkey,
          password:this.userLoginInfo.password,
          phone:this.userLoginInfo.phone
        }
      }).then(res => {
        this.$toast.clear();
        console.log(res)
        if(res.data.code === 200){
          // 1d  是保存一天
            this.$cookies.set('tokenString',res.data.token,"1d")

            this.$router.push({name:'Home'})
        }else{
          this.$toast({
            message:res.data.msg,
            forbidClick:true,
            duration:2000
          })
        }
      }).catch(err =>{
        this.$toast.clear();
        console.log('err',err)
      })
    },

  
    // 切换输入框的类型
    toggleType(){
      this.isText = ! this.isText
    }
  },
};
</script>
