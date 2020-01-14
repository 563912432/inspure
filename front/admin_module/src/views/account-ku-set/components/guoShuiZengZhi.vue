<template>
  <div class="GuoShuiZengZhi">
    <div>
      <el-table
        size="mini"
        :data="guoShuiZengZhi"
        border
        fit
        highlight-current-row
        :stripe="true"
        style="width: 100%;"
      >
        <el-table-column label="税目" align="center" prop="title" width="" />
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{ row, column, $index }">
            <el-button type="text" size="small" @click="editRow(row, column, $index)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-el-drag-dialog class="tax-dialog" width="800px" :modal="false" :close-on-click-modal="false" title="编辑" :visible.sync="dialogTaxVisible" @dragDialog="handleTaxDrag">
      <div ref="divTax">
        <GuoShuiZengZhiBiao1 v-if="index === 0" :data="data" @resetData="resetZengZhiBiao1" />
        <GuoShuiZengZhiBiao2 v-if="index === 1" :data="data" @resetData="resetZengZhiBiao2" />
        <GuoShuiZengZhiBiao3 v-if="index === 2" :data="data" @resetData="resetZengZhiBiao3" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import GuoShuiZengZhiBiao1 from './guoShuiZengZhiBiao1'
import GuoShuiZengZhiBiao2 from './guoShuiZengZhiBiao2'
import GuoShuiZengZhiBiao3 from './guoShuiZengZhiBiao3'
export default {
  name: 'GuoShuiZengZhi',
  components: { GuoShuiZengZhiBiao3, GuoShuiZengZhiBiao2, GuoShuiZengZhiBiao1 },
  directives: { elDragDialog },
  props: {
    guoShuiZengZhi: {
      type: Array,
      required: true,
      defaults: []
    }
  },
  data() {
    return {
      index: 0,
      dialogTaxVisible: false,
      data: {}
    }
  },
  methods: {
    editRow(row, column, index) {
      this.index = index
      this.data = row['info']
      this.dialogTaxVisible = true
    },
    handleTaxDrag() {
      this.$refs['divTax'].blur()
    },
    resetZengZhiBiao1() {
      this.data = { firm_name: '', '1_2': '0.00', '2_2': '0.00', '3_2': '0.00', '4_2': '0.00', '5_2': '0.00', '6_2': '0.00', '7_2': '0.00', '8_2': '0.00' }
    },
    resetZengZhiBiao2() {
      this.data = { firm_name: '', '1_1': '0.00', '2_1': '0.00', '3_1': '0.00', '4_1': '0.00', '5_1': '0.00' }
    },
    resetZengZhiBiao3() {
      this.data = {
        firm_code: '测试', firm_trade: '测试', firm_name: '测试', firm_legal_person: '测试', firm_address: '测试', firm_operating: '测试', firm_bank_code: '测试', firm_type: '测试', firm_telephone: '测试', '1_2': '0.00', '2_2': '0.00', '3_2': '0.00', '4_2': '0.00', '5_2': '0.00', '6_2': '0.00', '7_2': '0.00', '8_2': '0.00', '9_2': '0.00', '10_2': '0.00',
        '11_2': '0.00', '12_2': '0.00', '13_2': '0.00', '14_2': '0.00', '15_2': '0.00', '16_2': '0.00', '18_2': '0.00', '19_2': '0.00', '20_2': '0.00', '21_2': '0.00', '22_2': '0.00', '23_2': '0.00', '24_2': '0.00',
        '25_1': '0.00', '25_2': '0.00', '25_3': '0.00', '25_4': '0.00', '26_2': '0.00', '27_2': '0.00', '30_2': '0.00', '31_2': '0.00', '32_1': '0.00', '32_2': '0.00', '36_2': '0.00', '37_2': '0.00', '38_2': '0.00'
      }
    }
  }
}
</script>
<style>
  .GuoShuiZengZhi .el-dialog__body{
    padding: 0;
  }
</style>
<style lang="scss" scoped>

</style>
