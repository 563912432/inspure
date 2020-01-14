<template>
  <div class="GuoShuiZengZhiBiao2">
    <!--增值税纳税申报表附列资料【四】-->
    <div>
      <p style="font-size:20px;height:35px; font-weight:bold;text-align: center;">增值税纳税申报表附列资料（四）</p>
      <p style="font-size:20px;height:35px; font-weight:bold;text-align: center;">（税额抵减情况表）</p>
      <p style="text-align: center;">税款所属时间：20xx年xx月xx日至20xx年xx月xx日</p>
      <p style="width:50%; float:left; height:25px; text-align:left;">纳税人名称：{{ data.firm_name }}</p>
      <p style="width:50%; float:left; height:25px; text-align:right;">金额单位：元至角分</p>
      <form class="presetForm">
        <table cellpadding="0" cellspacing="0" border="1" width="100%">
          <tr>
            <td rowspan="2" class="text-center">序号</td>
            <td rowspan="2" class="text-center">抵减项目</td>
            <td class="text-center">期初余额</td>
            <td class="text-center">本期发生额</td>
            <td class="text-center">本期应抵减税额</td>
            <td class="text-center">本期实际抵减税额</td>
            <td class="text-center">期末余额</td>
          </tr>
          <tr>
            <td class="text-center">1</td>
            <td class="text-center">2</td>
            <td class="text-center">3=1+2</td>
            <td class="text-center">4≤3</td>
            <td class="text-center">5=3-4</td>
          </tr>
          <tr>
            <td class="text-center">1</td>
            <td class="text-left">增值税税控系统专用设备费及技术维护费</td>
            <td style="background-color:#d6ebff;"><input v-model="data['1_1']" tabindex="1"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td class="text-center">2</td>
            <td class="text-left">分支机构预征缴纳税款</td>
            <td style="background-color:#d6ebff;"><input v-model="data['2_1']" tabindex="4"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td class="text-center">3</td>
            <td class="text-left">建筑服务预征缴纳税款</td>
            <td style="background-color:#d6ebff;"><input v-model="data['3_1']" tabindex="7"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td class="text-center">4</td>
            <td class="text-left">销售不动产预征缴纳税款</td>
            <td style="background-color:#d6ebff;"><input v-model="data['4_1']" tabindex="10"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td class="text-center">5</td>
            <td class="text-left">出租不动产预征缴纳税款</td>
            <td style="background-color:#d6ebff;"><input v-model="data['5_1']" tabindex="13"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
        </table>
      </form>
    </div>
    <div style="margin-top: 15px" class="uk-text-center">
      <el-button size="small" type="primary" @click="resetData"><i class="uk-icon-refresh" /> 数据还原</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuoShuiZengZhiBiao2',
  props: {
    data: {
      type: Object,
      required: true,
      defaults: {}
    }
  },
  data() {
    return {
    }
  },
  methods: {
    resetData() {
      this.$emit('resetData')
    }
  }
}
</script>

<style scoped>
  .GuoShuiZengZhiBiao2{
    padding: 10px;
  }
  table, table tr th, table tr td {
    font-family: '宋体';
    border: 1px solid #333;
  }

  table {
    max-width: 100%;
    min-height: 25px;
    line-height: 25px;
    text-align: center;
    border-collapse: collapse;
    padding: 2px;
  }

  input, select {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    padding: 0 2px;
    outline: 0px;
    text-align: right;
  }

  td {
    text-align: right;
    padding: 3px 2px;
  }
  .text-center{
    text-align: center;
  }
  .text-left{
    text-align: left;
  }
</style>
