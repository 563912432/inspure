<template>
  <div class="GuoShuiZengZhiBiao2">
    <!--增值税纳税申报表附列资料【三】-->
    <div>
      <p style="font-size:20px;height:35px; font-weight:bold;text-align: center;">增值税纳税申报表附列资料（三）</p>
      <P style="font-size:16px; height:40px; font-weight:bold;text-align: center;">（服务、不动产和无形资产扣除项目明细）</P>
      <P style="height:25px;text-align: center;">税款所属时间：20xx年xx月xx日至20xx年xx月xx日</P>
      <p style="width:50%; height:25px; line-height: 25px; float:left; text-align:left;display: flex"><span style="display: inline-block;width: 100px">纳税人名称</span> <input v-model="data.firm_name" type="text"></p>
      <!--<p style="width:34%; height:25px; float:left;"></p>-->
      <p style="width:50%; height:25px; float:left; text-align:right;">金额单位：元至角分</p>
      <form class="presetForm">
        <table cellpadding="0" cellspacing="0" border="1" width="100%">
          <tr>
            <td rowspan="3" colspan="2" width="30%" class="text-center">项目及栏次</td>
            <td width="10%" rowspan="2" class="text-center">本期服务、不动产和无形资产价税合计额（免税销售额）</td>
            <td colspan="5" width="60%" class="text-center">服务、不动产和无形资产扣除项目</td>
          </tr>
          <tr>
            <td width="12.5%" class="text-center">期初余额</td>
            <td width="12.5%" class="text-center">本期发生额</td>
            <td width="12.5%" class="text-center">本期应扣除金额</td>
            <td width="12.5%" class="text-center">本期实际扣除金额</td>
            <td width="12.5%" class="text-center">期末余额</td>
          </tr>
          <tr>
            <td class="text-center">1</td>
            <td class="text-center">2</td>
            <td class="text-center">3</td>
            <td class="text-center">4=2+3</td>
            <td class="text-center">5（5≤1且5≤4）</td>
            <td class="text-center">6=4-5</td>
          </tr>
          <tr>
            <td style="text-align:left;">13%税率的项目</td>
            <td width="30" class="text-center">1</td>
            <td>0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['1_2']"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td style="text-align:left;">9%税率的项目</td>
            <td class="text-center">2</td>
            <td>0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['2_2']"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td style="text-align:left;">6%税率的项目（不含金融商品转让）</td>
            <td class="text-center">3</td>
            <td>0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['3_2']"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td style="text-align:left;">6%税率的金融转让项目</td>
            <td class="text-center">4</td>
            <td>0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['4_2']"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td style="text-align:left;">5%征收率的项目</td>
            <td class="text-center">5</td>
            <td>0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['5_2']"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td style="text-align:left;">3%征收率的项目</td>
            <td class="text-center">6</td>
            <td>0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['6_2']"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td style="text-align:left;">免抵退税的项目</td>
            <td class="text-center">7</td>
            <td>0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['7_2']"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td style="text-align:left;">免税的项目</td>
            <td class="text-center">8</td>
            <td>0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['8_2']"></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
        </table>
      </form>
    </div>
    <div style="margin-top: 15px" class="uk-text-center">
      <el-button type="primary" size="small" @click="resetData"><i class="uk-icon-refresh" /> 数据还原</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'GuoShuiZengZhiBiao1',
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
    padding: 20px;
  }
  table, table tr th, table tr td {
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
</style>
