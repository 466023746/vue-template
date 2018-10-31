<template>
  <div id="app">
    <img alt="Vue logo" src="//haitao.nos.netease.com/efa4f9c2-6c8b-4f39-943a-b48239be12ab_200_200.png">
    <demo></demo>
  </div>
</template>

<script>
import Demo from '../../components/demo/index.vue'

export default {
  name: 'app',
  components: {
      Demo
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
