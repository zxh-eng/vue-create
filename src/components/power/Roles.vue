<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <!-- 搜索数据并能清空搜索 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getRolesList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getRolesList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addRolesDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级权限和渲染三级权限-->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级菜单 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showRolesDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removentRolesById(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配角色按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <el-dialog
      title="添加用户"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="addRolesDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="addRolesForm"
        ref="addRolesFormRef"
        label-width="100px"
        :rules="addRolesFormRule"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="roleDialogVisible"
      width="50%"
      @close="roleDialogColsed"
    >
      <el-form
        :model="roleForm"
        :rules="roleFormRules"
        ref="roleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
      },
      
      // 所有角色列表数据
      rolelist: [],
      total: 0,
      addRolesDialogVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加表单的验证规则对象
      addRolesFormRule: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      // 控制修改用户对话框的显示与隐藏
      roleDialogVisible: false,
      // 查询到的用户数据对象
      roleForm: {},
      roleFormRules: {
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的节点ID值数组
      defKeys:[],
      // 当前即将分配权限的角色id
      roleId:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //   获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.rolelist = res.data
      console.log(res.data)
    },

    addRolesDialogClosed() {
      this.$refs.addRolesFormRef.resetFields()
    },
    addRoles() {
      this.$refs.addRolesFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        // 验证通过可以发起网络请求了
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功!')
        // 隐藏添加用户的对话框
        this.addRolesDialogVisible = false
        // 重新获取列表数据
        this.getRolesList()
      })
    },
    // 展示编辑用户的对话框
    async showRolesDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      // console.log(id)
      if (res.meta.status !== 200)
        return this.$message.error('查询用户数据失败!')
      // console.log(id);
      this.roleForm = res.data
      this.roleDialogVisible = true
    },
    // 监听修改用户对话框关闭事件
    roleDialogColsed() {
      this.$refs.roleFormRef.resetFields()
    },
    // 修改用户信息并提交
    roleUserInfo() {
      this.$refs.roleFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'roles/' + this.roleForm.roleId,
          { roleName: this.roleForm.roleName, roleDesc: this.roleForm.roleDesc }
        )
        console.log(this.roleForm.id)
        if (res.meta.status !== 200)
          return this.$message.error('更新用户数据失败')
        // 关闭对话框
        this.roleDialogVisible = false
        // 刷新列表数据
        this.getRolesList()
        // 提示用户更新成功
        this.$message.success('更新用户数据成功')
      })
    },
    // 根据id删除对应的用户信息
    async removentRolesById(id) {
      // console.log(id)
      // 弹框询问用户是否删除用户信息
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err) //捕获取消操作
      // 如果用户确认删除，则返回值为字符串confirm
      // 如果用户取消删除，则返回值为字符串cancel
      // console.log(confirmResult)返回值是promis
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getRolesList()
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult != 'confirm')
        return this.$message.info('您取消了删除！')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败!')
      role.children = res.data //这里不写this.getRolesList()的原因是重新请求会刷新页面关闭这个页面
      this.$message.success('删除权限成功！')
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id//获取用户id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200)
        return this.$message.error('获取权限数据失败')
      // 把获取到的权限数据保存到data中
      this.rightslist = res.data
      // 递归获取三级节点的id
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true

    },
    // 通过递归的形式获取该角色下三级权限的数据,并保存到defKeys这个数组中
    getLeafKeys(node,arr){
      // 如果当前node节点不包含children属性就是三级节点
      if(!node.children)return arr.push(node.id)
      node.children.forEach(item=>{
        this.getLeafKeys(item,arr)
      })
    },
    // 监听分配权限对话框的关闭事件，因为这个权限数据在关闭的时候没有清除，
    // 会导致下个角色继承上个角色的权限
    setRightDialogClosed(){
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const {data:res} =  await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !== 200)return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>