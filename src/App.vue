<template>
  <div id="app">
    <v-header></v-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import header from './components/header/header'
  export default {
    name: 'app',
    components: {
      'v-header': header
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: "Microsoft YaHei", "Arial", "SimSun";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $color1;
  }
</style>
