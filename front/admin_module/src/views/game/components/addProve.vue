<template>
  <div class="add-prove">
    <table class="foulUserTable" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <th>证书名称</th>
        <td colspan="3"><el-input v-model="proveInfo.title" clearable placeholder="请输入证书名称" /></td>
      </tr>
      <tr>
        <th>模板选择</th>
        <td>
          <el-select v-model="proveInfo.template_id" size="small" clearable style="width: 100%;height: 100%;" placeholder="请选择证书模板">
            <el-option label="默认模板" value="account_template" />
          </el-select>
        </td>
        <th>证书类型</th>
        <td>
          <el-select v-model="proveInfo.category_id" size="small" clearable style="width: 100%;height: 100%;" placeholder="请选择证书类型">
            <el-option v-for="(item,index) in proveTypeList" :key="index" :label="item.category_title" :value="item.id" />
          </el-select>
        </td>
      </tr>
      <tr>
        <th>发放规则</th>
        <td colspan="3">
          <el-select
            v-model="proveInfo.subjects"
            size="small"
            style="width: 100%;"
            multiple
            filterable
            allow-create
            clearable
            default-first-option
            placeholder="请编写证书绑定的科目"
          />
        </td>
      </tr>
    </table>
    <div class="text-right mt-10">
      <el-button size="mini" type="primary" @click="addProve">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { getCertCategoryList, certAdd, setCertItem } from '@/api/game'
export default {
  name: 'AddProve',
  data() {
    return {
      proveInfo: {
        title: '', // 证书名称
        category_id: '', // 证书类型
        template_id: '', // 证书绑定的模板
        subjects: '' // 请选择证书绑定的科目
      },
      proveid: '',
      // 证书类型
      proveTypeList: []
    }
  },
  watch: {
    proveid: function() {
      if (this.proveid === '') {
        // 新增
        Object.assign(this.$data.proveInfo, this.$options.data().proveInfo)
      } else {
        // 编辑
        setCertItem(this.proveid).then(res => {
          this.proveInfo = res.data
        })
      }
    }
  },
  mounted() {
    this.getProveType() // 证书类型获取
  },
  methods: {
    // 证书类型查询
    getProveType() {
      getCertCategoryList().then(res => {
        this.proveTypeList = res.data.data
      })
    },
    // 证书新增
    addProve() {
      var proveInfo = this.proveInfo
      if (proveInfo.switch) {
        proveInfo.switch = 1
      } else {
        proveInfo.switch = 0
      }
      // console.log(proveInfo)
      certAdd(proveInfo).then(res => {
        this.$message.success('新增成功')
        Object.assign(this.$data.proveInfo, this.$options.data().proveInfo)
        this.$emit('fatherMethod')
      })
    }
  }
}
</script>

<style>
  .add-prove .foulUserTable .el-select>.el-input,
  .add-prove .el-input--small .el-input__inner{
    height: 100%;
  }
  .add-prove .el-input__inner,
  .add-prove .el-textarea__inner{
    border: 0px;
  }
  .add-prove .el-input--small .el-input__icon{
    line-height: 15px;
  }
</style>
<style scoped>
  .add-prove .foulUserTable{
    width: 100%;
    border-top: 1px solid #CACACA;
    border-left: 1px solid #CACACA;
  }
  .add-prove .foulUserTable td,
  .add-prove .foulUserTable th {
    height: 35px;
    border-bottom: 1px solid #CACACA;
    border-right: 1px solid #CACACA;
  }
  .add-prove .foulUserTable th {
    padding: 5px;
    width: 80px;
    background-color: #EEEEEE;
    text-align: left;
  }
</style>
