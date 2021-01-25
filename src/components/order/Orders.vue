<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <!-- 搜索框和搜索按钮 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 商品详情表格区域 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.order_pay === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addRolesDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="CityData"
            v-model="addressForm.address1"
            expand-trigger="hover"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressOrder">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 显示物流进度的对话框 -->
    <el-dialog
      title="显示物流进度"
      :visible.sync="progressVisible"
      width="50%"
    >
      <!-- timeline时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CityData from './citydata.js'
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      //   商品分类列表
      orderlist: [],
      // 控制修改信息对话框的显示与隐藏
      addressVisible: false,
      // 修改信息的表单数据
      addressForm: {
        address1: [],
        address2: '',
      },
      // 修改信息表单的验证规则对象
      addressFormRules: {
        address1: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
      },
      CityData,
      progressVisible: false,
      progressInfo: [],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表数据失败!')
      this.total = res.data.total
      this.orderlist = res.data.goods
      console.log(res)
    },
    // pageSize 改变时会触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // currentPage 改变时会触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 显示对话框的显示与隐藏
    showBox() {
      this.addressVisible = true
      console.log(this.addressForm)
    },
    addRolesDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    addressOrder() {
      this.$refs.addressFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.get(`/orders/${this.orderlist}`)
        if (res.meta.status !== 200) return this.$message.error('修改信息失败!')
        this.$message.success('修改信息成功!')
        this.addressVisible = false
        this.getOrderList()
      })
    },
    async showProgress() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200)
        return this.$message.error('获取物流进度失败!')
      this.progressInfo = res.data
      this.progressVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>