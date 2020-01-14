<template>
  <div class="GuoShuiCaiWu">
    <div>
      <el-table
        size="mini"
        :data="guoShuiCaiWu"
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
        <GuoShuiCaiWuBiao1 v-if="index === 0" :data="data" @resetData="resetCaiWuBiao1" />
        <GuoShuiCaiWuBiao2 v-if="index === 1" :data="data" @resetData="resetCaiWuBiao2" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import GuoShuiCaiWuBiao1 from './guoShuiCaiWuBiao1'
import GuoShuiCaiWuBiao2 from './guoShuiCaiWuBiao2'
export default {
  name: 'GuoShuiCaiWu',
  components: { GuoShuiCaiWuBiao2, GuoShuiCaiWuBiao1 },
  directives: { elDragDialog },
  props: {
    guoShuiCaiWu: {
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
    resetCaiWuBiao1() {
      this.data = { firm_name: '', '1_2': '0.00', '1_4': '0.00', '2_2': '0.00', '2_4': '0.00', '3_2': '0.00', '3_4': '0.00', '4_2': '0.00', '4_4': '0.00', '5_2': '0.00', '5_4': '0.00', '6_2': '0.00', '6_4': '0.00',
        '7_2': '0.00', '7_4': '0.00', '8_2': '0.00', '8_4': '0.00', '9_2': '0.00', '9_4': '0.00', '10_2': '0.00', '10_4': '0.00', '11_2': '0.00', '11_4': '0.00', '12_2': '0.00', '13_2': '0.00', '13_4': '0.00', '14_2': '0.00', '14_4': '0.00', '15_2': '0.00', '15_4': '0.00',
        '16_4': '0.00', '17_2': '0.00', '17_4': '0.00', '18_2': '0.00', '18_4': '0.00', '19_2': '0.00', '20_2': '0.00', '21_2': '0.00', '22_2': '0.00', '23_2': '0.00', '24_2': '0.00', '25_2': '0.00', '26_2': '0.00', '26_4': '0.00', '27_2': '0.00', '27_4': '0.00',
        '28_2': '0.00', '28_4': '0.00', '29_2': '0.00', '29_4': '0.00', '30_2': '0.00', '30_4': '0.00', '31_2': '0.00', '31_4': '0.00'
      }
    },
    resetCaiWuBiao2() {
      this.data = { firm_name: '', '1_1': '0.00', '2_1': '0.00', '3_1': '0.00', '4_1': '0.00', '5_1': '0.00', '6_1': '0.00',
        '7_1': '0.00', '8_1': '0.00', '9_1': '0.00', '10_1': '0.00', '11_1': '0.00', '12_1': '0.00', '13_1': '0.00', '14_1': '0.00', '15_1': '0.00',
        '16_1': '0.00', '17_1': '0.00', '18_1': '0.00', '19_1': '0.00', '20_1': '0.00', '21_1': '0.00', '22_1': '0.00', '23_1': '0.00', '24_1': '0.00', '25_1': '0.00', '26_1': '0.00', '27_1': '0.00',
        '28_1': '0.00', '29_1': '0.00', '30_1': '0.00', '31_1': '0.00', '32_1': '0.00'
      }
    }
  }
}
</script>
<style>
  .GuoShuiCaiWu .el-dialog__body{
    padding: 0;
  }
</style>
<style lang="scss" scoped>

</style>
