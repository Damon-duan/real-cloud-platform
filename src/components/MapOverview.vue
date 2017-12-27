<template>
  <div class="hello">
  </div>
</template>

<script>
export default {
  name: 'MapOverview',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    this.$http.post('/news', 'type=top&key=123456').then(res => {
      console.log(res.data)
      this.newsListShow = res.data.data
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
