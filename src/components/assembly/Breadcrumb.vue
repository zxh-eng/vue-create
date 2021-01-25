<template>
  <div>
    <el-breadcrumb separator="/">
      <slot></slot>
      <el-breadcrumb-item v-for="item in breadcrumblabel" :key="item.label">{{
        item.label
      }}</el-breadcrumb-item>
      <!-- <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>{{}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{}}</el-breadcrumb-item> -->
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    breadcrumblabel: Array,
  },
};
</script>

<style scoped>
</style>