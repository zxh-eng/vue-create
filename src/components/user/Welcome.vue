<template>
  <div class="manage">
    <Breadcrumb :breadcrumblabel="breadcrumblist">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    </Breadcrumb>
    <el-dialog
      :title="operateType === 'add' ? '新增用户' : '更新用户'"
      :visible.sync="isShow"
    >
      <Form
        :formLabel="operateFormLabel"
        :form="operateForm"
        :rule="operateFormRules"
        ref="form"
      ></Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <div class="manage-header">
      <el-button type="primary" @click="addUser">+ 新增</el-button>
      <Form inline :formLabel="formLabel" :form="searchFrom">
        <el-button type="primary" @click="getList(searchFrom.keyword)"
          >搜索</el-button
        >
      </Form>
    </div>
    <!--依次是: 表格数据 表格标签数据 分页数据  列表方法 更新方法 删除方法-->
    <!-- <Table
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      @changePage="getList()"
      @edit="editUser"
      @del="delUser"
    >
      <el-table-column label="操作" name="button">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)"
            >编辑1</el-button
          >

          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
            删除2</el-button
          >
        </template>
      </el-table-column>
    </Table> -->

    <Tables
      :tableDate="tableDate"
      :tableDatelabel="tableDatelabel"
      :stripe="stripe"
      :border="border"
    >
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showRolesDialog(scope.row.id)"
          >
            编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removentRolesById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </Tables>
    <el-card>
      <Forms
        :form="addForm"
        :rule="addFormRules"
        ref="addFormRef"
        :FormItem="FormItem"
        :options="options"
      ></Forms>
    </el-card>
  </div>
</template>

<script>
import Forms from "../assembly/Forms";
import Tables from "../assembly/Tables.vue";

import Breadcrumb from "../assembly/Breadcrumb.vue";
import Form from "../assembly/Form";
import Table from "../assembly/Table";
export default {
  components: {
    Form,
    Table,
    Breadcrumb,
    Tables,
    Forms,
  },
  data() {
    return {
      addForm: {
        username: "",
        password: "",
        email: "",
        rember: ["复选框 A"],
        weight: 0,
        role: [],
        open: true,
        desc: "",
        radio: "上海",
        change:'',
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      FormItem: [
        {
          label: "用户名",
          prop: "username",
          type: "input",
          Inputtype:'text',
          disabled:false,
        },
        {
          label: "密码",
          prop: "password",
          type: "input",
          Inputtype:'password',
          disabled:false,
        },
        {
          label: "邮箱",
          prop: "email",
          type: "input",
          Inputtype:'email',
          disabled:true,
        },
        {
          label: "记住密码",
          prop: "rember",
          type: "checkout",
          children: [
            {
              label: "复选框 A",
              prop: "checkout A",
              disabled:false,
            },
            {
              label: "复选框 B",
              prop: "checkout B",
              disabled:false,
            },
            {
              label: "复选框 C",
              prop: "checkout C",
              disabled:true,
            },
          ],
        },
        {
          label: "商品重量",
          prop: "weight",
          type: "inputNumber",
        },
        {
          label: "分配权限",
          prop: "role",
          type: "cascader",
        },
        {
          label: "是否激活",
          prop: "open",
          type: "switch",
        },
        {
          label: "商品描述",
          prop: "desc",
          type: "textarea",
        },
        {
          label: "记住密码",
          prop: "radio",
          type: "radio",
          children: [
            {
              label: "上海",
            },
            {
              label: "北京",
            },
          ],
        },
        {
          label: "请选择商品",
          prop: "change",
          type: "select",
          children: [
            {
              label: "黄金糕",
              prop: "选项1",
            },
            {
              label: "双皮奶",
              prop: "选项2",
            },
            {
              label: "蚵仔煎",
              prop: "选项3",
            },
            {
              label: "北京烤鸭",
              prop: "选项4",
            },
          ],
        },
      ],
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                },
                {
                  value: "fankui",
                  label: "反馈",
                },
              ],
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohanh",
                  label: "侧向导航",
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航",
                },
              ],
            },
          ],
        },
      ],
      tableDate: [
        {
          username: "admin",
          email: "971009701@qq.com",
          mobile: "1374534562",
          role: "超级管理员",
        },
      ],
      tableDatelabel: [
        {
          type: "index",
        },
        {
          label: "姓名",
          prop: "username",
        },
        {
          label: "邮箱",
          prop: "email",
        },
        {
          label: "电话",
          prop: "mobile",
        },
        {
          label: "角色",
          prop: "role",
        },
      ],
      stripe: true,
      border: true,
      breadcrumblist: [
        {
          label: "商品管理",
        },
        {
          label: "商品分类",
        },
      ],
      operateType: "add", //dialog的title的值
      isShow: false, //dialog的显示与关闭
      tableData: [
        {
          name: "1",
          age: 11,
          sexLabel: "男",
          birth: "2020-2-2",
        },
      ], //table的
      tableLabel: [
        //table的
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "age",
          label: "年龄",
        },
        {
          prop: "sexLabel",
          label: "性别",
        },
        {
          prop: "birth",
          label: "出生日期",
          width: 200,
        },
        {
          prop: "addr",
          label: "地址",
          width: 320,
        },
      ],
      config: {
        //talbe的
        page: 1,
        total: 30,
        // loading: false,
      },
      operateForm: {
        //form表单的内容
        name: "",
        addr: "",
        age: "",
        birth: "",
        sex: "",
      },
      operateFormRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        addr: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        age: [
          { required: true, message: "请输入年龄", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        birth: [
          { required: true, message: "请输入日期", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        sex: [
          { required: true, message: "请选择性别", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      operateFormLabel: [
        //form表单的表单数据
        {
          model: "name",
          label: "姓名",
          type: "input",
        },
        {
          model: "age",
          label: "年龄",
          type: "input",
        },
        {
          model: "sex",
          label: "性别",
          type: "select",
          opts: [
            {
              label: "男",
              value: 1,
            },
            {
              label: "女",
              value: 0,
            },
          ],
        },
        {
          model: "birth",
          label: "出生日期",
          type: "date",
        },
        {
          model: "addr",
          label: "地址",
          type: "input",
        },
      ],
      formRules: {
        name: [],
        age: [],
        sex: [],
        birth: [],
        addr: [],
      },
      searchFrom: {
        // form表单
        keyword: "",
      },
      formLabel: [
        //form表单
        {
          model: "keyword",
          label: "",
          type: "input",
        },
      ],
    };
  },

  methods: {
    showRolesDialog() {
      console.log(1);
    },
    removentRolesById() {
      console.log(2);
    },
    getList(name = "") {
      // this.config.loading = true;
      // // 搜索时，页码需要设置为1，才能正确返回数据，因为数据是从第一页开始返回的
      // name ? (this.config.page = 1) : "";
      // this.$http
      //   .get("/api/user/getUser", {
      //     params: {
      //       page: this.config.page,
      //       name,
      //     },
      //   })
      //   .then((res) => {
      //     this.tableData = res.data.list.map((item) => {
      //       item.sexLabel = item.sex === 0 ? "女" : "男";
      //       return item;
      //     });
      //     this.config.total = res.data.count;
      //     this.config.loading = false;
      //   });
    },
    addUser() {
      this.operateForm = {};
      this.operateType = "add";
      this.isShow = true;
    },
    editUser(row) {
      //   this.operateType = "edit";
      //   this.isShow = true;
      //   this.operateForm = row;
    },
    confirm() {
      //   if (this.operateType === "edit") {
      //     console.log(this.operateForm);
      //     this.$http.post("/api/user/edit", this.operateForm).then((res) => {
      //       console.log(res.data);
      //       this.isShow = false;
      //       this.getList();
      //     });
      //   } else {
      //     this.$http.post("/api/user/add", this.operateForm).then((res) => {
      //       console.log(res.data);
      //       this.isShow = false;
      //       this.getList();
      //     });
      //   }
    },
    delUser(row) {
      //   this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   })
      //     .then(() => {
      //       let id = row.id;
      //       this.$http
      //         .get("/api/user/del", {
      //           params: {
      //             id,
      //           },
      //         })
      //         .then((res) => {
      //           console.log(res.data);
      //           this.$message({
      //             type: "success",
      //             message: "删除成功!",
      //           });
      //           this.getList();
      //         });
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: "info",
      //         message: "已取消删除",
      //       });
      //     });
    },
  },
  created() {
    this.getList();
  },
};
</script>