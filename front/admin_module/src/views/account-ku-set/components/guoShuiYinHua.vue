<template>
  <div>
    <div class="text-right mb-12"><el-button size="small" type="primary" @click="add">新增数据</el-button></div>
    <div>
      <el-table
        size="mini"
        :data="guoShuiYinHua"
        border
        fit
        highlight-current-row
        :stripe="true"
        style="width: 100%;"
      >
        <el-table-column label="应税凭证" align="center" prop="taxable_name" width="" />
        <el-table-column label="纳税期限" align="center" prop="taxes_status" width="" />
        <el-table-column label="适用税率" align="center" prop="tax_rate" width="" />
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{ row, column, $index }">
            <el-button type="text" size="small" @click="editRow(row, column, $index)">编辑</el-button>
            <el-button type="text" size="small" @click="delRow(row, column, $index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--印花税-->
    <el-dialog v-el-drag-dialog class="tax-dialog" width="400px" :modal="false" :close-on-click-modal="false" :title="dialogTitle[dialogStatus]" :visible.sync="dialogTaxVisible" @dragDialog="handleTaxDrag">
      <el-form ref="taxForm" :model="taxFormData" :rules="taxRules" label-position="left" label-width="80px">
        <el-form-item label="应税凭证" prop="taxable_name">
          <el-input v-model="taxFormData.taxable_name" class="w-223" size="mini" type="text" placeholder="例：技术合同" clearable />
        </el-form-item>
        <el-form-item label="纳税期限" prop="taxes_status">
          <el-select v-model="taxFormData.taxes_status" placeholder="请选择年月" size="mini">
            <el-option label="按月申报" value="按月申报" />
            <el-option label="按次申报" value="按次申报" />
          </el-select>
        </el-form-item>
        <el-form-item label="适用税率" prop="tax_rate">
          <el-input v-model="taxFormData.tax_rate" class="w-223" size="mini" type="text" placeholder="例：0.0003" clearable />
        </el-form-item>
      </el-form>
      <div ref="divTax" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveTax('taxForm')">
          保存
        </el-button>
        <el-button size="small" plain @click="dialogTaxVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  name: 'GuoShuiInHua',
  directives: { elDragDialog },
  props: {
    guoShuiYinHua: {
      type: Array,
      required: true,
      defaults: []
    }
  },
  data() {
    return {
      dialogTitle: {
        'add': '新增',
        'update': '编辑'
      },
      dialogStatus: '',
      taxFormData: {},
      taxRules: {
        taxable_name: [{ required: true, message: '请填写应税凭证', trigger: 'blur' }],
        taxes_status: [{ required: true, message: '请选择纳税期限', trigger: 'change' }],
        tax_rate: [{ required: true, message: '请填写适用税率', trigger: 'blur' }]
      },
      dialogTaxVisible: false,
      index: 0
    }
  },
  methods: {
    add() {
      this.dialogStatus = 'add'
      this.taxFormData = {
        taxable_name: '',
        taxes_status: '',
        tax_rate: ''
      }
      this.dialogTaxVisible = true
      this.$nextTick(() => {
        this.$refs['taxForm'].clearValidate()
      })
    },
    saveTax(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'add') {
            this.guoShuiYinHua.push(this.taxFormData)
          } else {
            this.guoShuiYinHua[this.index] = this.taxFormData
          }
          this.dialogTaxVisible = false
        }
      })
    },
    editRow(row, column, index) {
      this.index = index
      this.taxFormData = Object.assign(row)
      this.dialogStatus = 'update'
      this.dialogTaxVisible = true
      this.$nextTick(() => {
        this.$refs['taxForm'].clearValidate()
      })
    },
    delRow(row, column, index) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.guoShuiYinHua.splice(index, 1)
      }).catch(() => {
        console.log('cancel')
      })
    },
    handleTaxDrag() {
      this.$refs['divTax'].blur()
    }
  }
}
</script>

<style scoped>

</style>
