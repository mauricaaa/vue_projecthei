<template>
    <router-view></router-view>
</template>

<script>
// import { getUserInfoAPI } from '@/api'
export default {
  created () {
    this.$store.dispatch('getUserInfoActions')
  }
}
</script>

<style scoped>

</style>
