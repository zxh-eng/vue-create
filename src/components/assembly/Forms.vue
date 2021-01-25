<template>
  <!-- labelWidth:表单域标签的宽度,labelPosition:表单域标签的位置 -->
  <el-form
    :model="form"
    :rules="rule"
    ref="ruleForm"
    :label-width="labelWidth"
    :label-position="labelPosition"
  >
    <template v-for="item in FormItem">
      <!-- 当为input输入框时 -->
      <template v-if="item.type === 'input'">
        <el-form-item
          :key="item.prop"
          :label="item.label + ':'"
          :prop="item.prop"
        >
        <!-- disabled:是否禁用,type:input类型,clearable:是否一键清除,prefixIcon:首部显示图标,suffixIcon:尾部显示图标 -->
          <el-input
            v-model="form[item.prop]"
            :placeholder="'请输入' + item.label"
            :disabled="item.disabled"
            :type="item.Inputtype"
            :clearable="Inputclearable"
            :prefix-icon="prefixIcon"
            :suffix-icon="suffixIcon"
            :size="Inputsize"
          ></el-input>
        </el-form-item>
      </template>

      <!-- 当为多行文本域时 -->
      <template v-else-if="item.type === 'textarea'">
        <el-form-item
          :key="item.prop"
          :label="item.label + ':'"
          :prop="item.prop"
        >
        <!-- autosize:多行文本域的行数 -->
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
            v-model="form[item.prop]"
            :placeholder="'请输入' + item.label"
          ></el-input>
        </el-form-item>
      </template>

      <!-- 当为多选框的时 -->
      <template v-else-if="item.type === 'checkout'">
        <!-- 当为多选框组的时候 -->
        <template v-if="item.children">
          <el-form-item :key="item.prop" :label="item.label">
            <!-- Checkoutmin:最小选择数,Checkoutmax:最大选择数 -->
            <el-checkbox-group
              v-model="form[item.prop]"
              @change="checkoutGroup"
              :min="Checkoutmin"
              :max="Checkoutmax"
            >
              <el-checkbox
                v-for="checkboxItem in item.children"
                :key="checkboxItem.prop"
                :label="checkboxItem.label"
                :disabled="checkboxItem.disabled"
                :border="checkoutGroupborder"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
        <!-- 当只有一个多选框的时候 -->
        <template v-else>
          <el-form-item :key="item.label" :label="item.label">
            <el-checkbox
              v-model="fomr[item.prop]"
              @change="checkboxChange"
              :disabled="Checkoutdisabled"
              :border="checkboxborder"
              
              >{{ item.label }}</el-checkbox
            >
          </el-form-item>
        </template>
      </template>
      <!-- 当为计数器时 -->
      <template v-else-if="item.type === 'inputNumber'">
        <el-form-item :key="item.prop" :label="item.label">
          <!-- Numbermin:最小的值,Numbermax:最大的值,NumberStep:每次增加的数值,Numberprecision:小数点的位数 -->
          <el-input-number
            v-model="form[item.prop]"
            @change="inputNumberChange"
            :min="Numbermin"
            :max="Numbermax"
            :disabled="Numberdisabled"
            :step="NumberStep"
            :size="Numbersize"
            :precision="Numberprecision"
          ></el-input-number>
        </el-form-item>
      </template>

      <!-- 当为级联选择器时 -->
      <template v-else-if="item.type === 'cascader'">
        <el-form-item :key="item.prop" :label="item.label">
          <!-- Casaderseparator:选项分隔符 -->
          <el-cascader
            v-model="form[item.prop]"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
            @change="cascaderChange"
            :separator="Casaderseparator"
          ></el-cascader>
        </el-form-item>
      </template>

      <!-- 当为switch开关时 -->
      <template v-else-if="item.type === 'switch'">
        <el-form-item :key="item.prop" :label="item.label">
          <!-- activeText:打开时候的值,inactiveText:关闭时候的值 -->
          <el-switch
            v-model="form[item.prop]"
            :active-text="activeText"
            :inactive-text="inactiveText"
            @change="switchChange"
            :disabled="Switchdisabled"
          ></el-switch>
        </el-form-item>
      </template>

      <!-- 当为单选框时 -->
      <template v-else-if="item.type === 'radio'">
        <el-form-item :key="item.prop" :label="item.label">
          <!-- 如果存在多个单选框组 -->
          <template v-if="item.children">
            <el-radio-group
              v-model="form[item.prop]"
              @change="radioGroupChange"
              
            >
              <el-radio
                v-for="radioItem in item.children"
                :key="radioItem.prop"
                :label="radioItem.label"
                :border="RadioGroupborder"
                :disabled="RadioGroupdisabled"
                >{{ radioItem.label }}</el-radio
              >
            </el-radio-group>
          </template>

          <!-- 如果只有一个单选框组 -->
          <template v-else>
            <el-radio
              :key="item.prop"
              v-model="form[item.prop]"
              :label="form[item.prop]"
              @change="radioChange"
              :border="Radioborder"
              :disabled="Radiodisabled"
              >{{ item.label }}</el-radio
            >
          </template>
        </el-form-item>
      </template>

      <!-- 选择器 -->
      <template v-else-if="item.type === 'select'">
        <el-form-item :key="item.prop" :label="item.label">
          <el-select
            v-model="form[item.prop]"
            :placeholder="item.label"
            @change="selectChange"
            :clearable="Selectclearable"
            :disabled="Selectdisabled"
          >
            <el-option
              v-for="select in item.children"
              :key="select.prop"
              :label="select.label"
              :value="select.prop"
              :disabled="select.disabled"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </template>
  </el-form>
</template>

<script>
export default {
  props: {
    form: Object,
    rule: Object,
    suffixIcon:{
      type: String,
      default:'',
    },
    prefixIcon:{
      type: String,
      default:''
    },
    labelWidth: {
      type: String,
      default: "100px",
    },
    labelPosition: {
      type: String,
      default: "left",
    },
    FormItem: Array,
    Numbermin: {
      type: Number,
      default: 0,
    },
    Checkoutmin:{
      type: Number,
      default: 0,
    },
    Checkoutmax:{
      type: Number,
      default:5,
    },
    Numbermax: {
      type: Number,
      default: 10,
    },
    options: Array,
    activeText: {
      type: String,
      default: "开",
    },
    inactiveText: {
      type: String,
      default: "关",
    },
    Inputclearable:{
      type: Boolean,
      default: true,
    },
    Selectclearable: {
      type: Boolean,
      default: true,
    },
    Numberdisabled:{
      type: Boolean,
      default: false,
    },
    Checkoutdisabled: {
      type: Boolean,
      default: false,
    },
    Switchdisabled:{
      type: Boolean,
      default: false,
    },
    Selectdisabled: {
      type: Boolean,
      default: false,
    },
    RadioGroupdisabled:{
      type: Boolean,
      default: false,
    },
    Radiodisabled: {
      type: Boolean,
      default: false,
    },
    checkoutGroupborder:{
      type: Boolean,
      default: false,
    },
    checkoutborder:{
      type: Boolean,
      default: false,
    },
    Radioborder: {
      type: Boolean,
      default: false,
    },
    RadioGroupborder: {
      type: Boolean,
      default: false,
    },
    Numberprecision:{
      type: Number,
      default:0
    },
    NumberStep:{
      type: Number,
      default:2
    },
    Inputsize:{
      type: String,
      default:'large'
    },
    Numbersize:{
      type: String,
      default:'large',
    },
    Casaderseparator:{
      type: String,
      default:'/'
    },
  },
  methods: {
    //   change(){}
    inputNumberChange() {
      console.log(this.form.weight);
    },
    cascaderChange() {
      console.log(this.form.role);
    },
    switchChange() {
      console.log(this.form.open);
    },
    checkoutGroup() {
      console.log(this.form.rember);
    },
    checkboxChange() {
      console.log(this.form.rember);
    },
    radioGroupChange() {
      console.log(this.form.radio);
    },
    radioChange() {
      console.log(this.form.radio);
    },
    selectChange() {
      console.log(this.form.change);
    },
  },
};
</script>

<style lang="less" scoped>
</style>