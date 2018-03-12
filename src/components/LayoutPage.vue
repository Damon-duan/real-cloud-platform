<template>
  <div class="app-wrapper">
    <v-header></v-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import header from './header/header'
  export default {
    name: 'app',
    components: {
      'v-header': header
    }
  }
</script>

<style scoped lang="scss">
  .container-fluid {
    padding: 50px 0 0 0;
    position: relative;
  }
</style>
