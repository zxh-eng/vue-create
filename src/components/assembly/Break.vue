<template>
  <div>
    <Breadcrumb :breadcrumblabel="breadcrumblist"></Breadcrumb>
  </div>
</template>

<script>
import Breadcrumb from "./Breadcrumb.vue";
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      breadcrumblist: [
        {
          label: "首页",
          path: '/home'
        },
        {
          label: "商品管理",
        },
        {
          label: "商品分类",
        },
      ],
    };
  },
};
</script>