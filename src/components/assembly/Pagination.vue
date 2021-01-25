<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="pageSizes"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totals"
  >
  </el-pagination>
</template>

<script>
export default {
  props: {
   
      pagenum: {
        type: String,
      },
      pagesize: {
        type: String,
      },
      totals:{
          type: Number,
          default:0,
      },
      pageSizes:{
          type:Array,
          default:()=>[4,6,8,10,12,14,16]
      },
    

  },
  data() {
    return {
        num:this.pagenum
    };
  },
  created() {
     
  },
  methods: {
    handleSizeChange() {
         this.$listeners.handleSizeChange()
        // this.pagesize = newSize
        // console.log(newSize)
        // console.log(1)
    },
    handleCurrentChange(newPage) {
        this.$listeners.handleCurrentChange(newPage)
        // console.log(this.pagenum)
        console.log(2)
    },
    
        // handleSizeChange(newSize){
        //      this.pagesize = newSize
        //      console.log(this.pagesize)
        // }
    
  },
  computed:{
     
  }
};
</script>

<style lang="less" scoped>
</style>