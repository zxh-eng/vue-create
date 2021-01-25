<template>
  <div>
    <el-menu
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath"
    >
      <template v-for="item in menulist">
        <!-- 一级菜单有子集 -->
        <template v-if="item.children">
          <el-submenu :index="item.id + ''" :key="item.id">
            <template slot="title">
              <i class="el-icon-delete"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>

            <template v-for="subItem in item.children">
              <!-- 有三级菜单的二级菜单 -->
              <template v-if="subItem.children > 0">
                <el-submenu :index="subItem.id + ''" :key="subItem.id">
                  <template slot="title">
                    <i class="el-icon-delete"></i>
                    <span slot="title">{{ subItem.authName }}</span>
                  </template>

                  <template v-for="MenuItem in subItem.children">
                    <!-- 有四级菜单的三级菜单 -->
                    <template v-if="MenuItem.children > 0">
                      <el-submenu :index="MenuItem.id + ''" :key="MenuItem.id">
                        <template slot="title">
                          <i class="el-icon-delete"></i>
                          <span slot="title">{{ MenuItem.authName }}</span>
                        </template>
                      </el-submenu>
                    </template>

                    <!-- 没有四级菜单的三级菜单 -->
                    <template v-else>
                      <el-menu-item
                        :index="'/' + MenuItem.path"
                        :key="MenuItem.id"
                        @click="saveNavState('/' + MenuItem.path)"
                      >
                        <template slot="title">
                          <i class="el-icon-edit"></i>
                          <span slot="title">{{ MenuItem.authName }}</span>
                        </template>
                      </el-menu-item>
                    </template>
                  </template>
                </el-submenu>
              </template>

              <!-- 没有三级菜单的二级菜单 -->
              <template v-else>
                <el-menu-item
                  :index="'/' + subItem.path"
                  :key="subItem.id"
                  @click="saveNavState('/' + subItem.path)"
                >
                  <template slot="title">
                    <i class="el-icon-edit"></i>
                    <span slot="title">{{ subItem.authName }}</span>
                  </template>
                </el-menu-item>
              </template>
            </template>
          </el-submenu>
        </template>

        <!-- 一级菜单没有子集 -->
        <template v-else>
          <el-menu-item
            :index="item.id + ''"
            :key="item.id"
            @click="saveNavState('/' + item.path)"
          >
            <i class="el-icon-edit"></i>
            <span slot="title">{{ item.authName }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>

export default {
     props:{
         
     },
  data() {
    return {
      menulist: [],
      activePath:'',
      isCollapse: false,
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");

  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200)
        return this.$message.error("获取菜单数据失败");
      this.menulist = res.data;
    //   console.log(res.data);
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    //   console.log(1)
    },
  },
};
</script>

<style lang="less" scoped>
</style>