<template>
  <div>
    <Balls />
    <PathCurve />
    <Frog />
  </div>
</template>

<script>
import Balls from '@/components/Balls.vue'
import Frog from '@/components/Frog.vue'
import PathCurve from '@/components/PathCurve'

export default {
  name: 'App',
  components: {
    Frog: Frog,
    Balls: Balls,
    PathCurve: PathCurve
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  background-color: yellow;
  position: relative;
}
</style>
