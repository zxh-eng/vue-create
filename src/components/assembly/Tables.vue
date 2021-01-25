<template>
    <div>
        <el-table :data="tableDate" :stripe="stripe" :border="border">
             <el-table-column v-if="tableDatelabel.type "  type="index" width="50">1</el-table-column>
             <el-table-column  show-overflow-tooltip v-for="table in tableDatelabel" :key="table.label" :label="table.label" :prop="table.prop"></el-table-column>
             <slot></slot>
        </el-table>
    </div>
</template>

<script>
export default {

   props: {
       tableDate:Array,
       tableDatelabel:Array,
       stripe:Boolean,
       border:Boolean,
   },
    created() {},
    methods: {},
}
</script>

<style lang="less" scoped>

</style>