<template>
  <div id="app">
   
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}

body{
  margin: 0 auto;
  background-color: #f7f7f7;
  color:#444;
  font-size: 16px;
}
.auto-img{
  width:100%;
  display: block;
}
.one-text{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: el;
}
</style>