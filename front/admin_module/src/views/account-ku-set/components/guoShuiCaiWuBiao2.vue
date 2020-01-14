<!--eslint-disable-->
<template>
  <div class="GuoShuiCaiWuBiao2" style="height: 600px;overflow-y: auto">
    <h1 class="text-center" style="font-weight: bold;">利润表</h1>
    <div style="margin: 0 auto">
      <div class="text-right">会小企02表</div>
      <div class="flex flex-justify-space-between">
        <span class="flex"><span style="display: inline-block;width: 100px">编制单位:</span><input v-model="data.firm_name"/></span>
        <span>20xx年xx月</span>
        <span>单位:元</span>
      </div>
    </div>
    <form class="presetForm">
      <table style="margin:0px auto;" cellpadding="0" cellspacing="0" border="1" width="100%">
        <tbody>
          <tr height="30">
            <td width="500" style="text-align: center">项目</td>
            <td width="30" style="text-align: center">行次</td>
            <td width="200" style="text-align: center">本年累计金额</td>
            <td width="200" style="text-align: center">本月金额</td>
          </tr>
          <tr height="30">
            <td>一、营业收入</td>
            <td style="text-align: center">1</td>
            <td class="bg-unwrite"><input v-model="data['1_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　减:营业成本</td>
            <td style="text-align: center">2</td>
            <td class="bg-unwrite"><input v-model="data['2_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　税金及附加</td>
            <td style="text-align: center">3</td>
            <td class="bg-unwrite"><input v-model="data['3_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　其中：消费税</td>
            <td style="text-align: center">4</td>
            <td class="bg-unwrite"><input v-model="data['4_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　　　营业税</td>
            <td style="text-align: center">5</td>
            <td class="bg-unwrite"><input v-model="data['5_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　　　城市维护建设税</td>
            <td style="text-align: center">6</td>
            <td class="bg-unwrite"><input v-model="data['6_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　　　资源税</td>
            <td style="text-align: center">7</td>
            <td class="bg-unwrite"><input v-model="data['7_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　　　土地增值税</td>
            <td style="text-align: center">8</td>
            <td class="bg-unwrite"><input v-model="data['8_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　　　城镇土地使用税、房产税、车船税、印花税</td>
            <td style="text-align: center">9</td>
            <td class="bg-unwrite"><input v-model="data['9_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　　　教育费附加、矿产资源补偿费、排污费</td>
            <td style="text-align: center">10</td>
            <td class="bg-unwrite"><input v-model="data['10_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　销售费用</td>
            <td style="text-align: center">11</td>
            <td class="bg-unwrite"><input v-model="data['11_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　其中：商品维护费</td>
            <td style="text-align: center">12</td>
            <td class="bg-unwrite"><input v-model="data['12_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　广告费和业务宣传费</td>
            <td style="text-align: center">13</td>
            <td class="bg-unwrite"><input v-model="data['13_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　管理费用</td>
            <td style="text-align: center">14</td>
            <td class="bg-unwrite"><input v-model="data['14_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　其中：开办费</td>
            <td style="text-align: center">15</td>
            <td class="bg-unwrite"><input v-model="data['15_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　　业务招待费</td>
            <td style="text-align: center">16</td>
            <td class="bg-unwrite"><input v-model="data['16_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　　研究费用</td>
            <td style="text-align: center">17</td>
            <td class="bg-unwrite"><input v-model="data['17_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　财务费用</td>
            <td style="text-align: center">18</td>
            <td class="bg-unwrite"><input v-model="data['18_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　其中：利息费用(收入以"-"号填列)</td>
            <td style="text-align: center">19</td>
            <td class="bg-unwrite"><input v-model="data['19_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　加:投资收益(损失以"-"号填列)</td>
            <td style="text-align: center">20</td>
            <td class="bg-unwrite"><input v-model="data['20_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>二、营业利润(亏损以"-"号填列)</td>
            <td style="text-align: center">21</td>
            <td class="bg-unwrite"><input v-model="data['21_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　加:营业外收入</td>
            <td style="text-align: center">22</td>
            <td class="bg-unwrite"><input v-model="data['22_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　其中：政府补助</td>
            <td style="text-align: center">23</td>
            <td class="bg-unwrite"><input v-model="data['23_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　减:营业外支出</td>
            <td style="text-align: center">24</td>
            <td class="bg-unwrite"><input v-model="data['24_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　其中：坏账损失</td>
            <td style="text-align: center">25</td>
            <td class="bg-unwrite"><input v-model="data['25_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　无法收回的长期债券投资损失</td>
            <td style="text-align: center">26</td>
            <td class="bg-unwrite"><input v-model="data['26_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　无法收回的长期股权投资损失</td>
            <td style="text-align: center">27</td>
            <td class="bg-unwrite"><input v-model="data['27_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　自然灾害等不可抗力因素造成的损失</td>
            <td style="text-align: center">28</td>
            <td class="bg-unwrite"><input v-model="data['28_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　　　　税收滞纳金</td>
            <td style="text-align: center">29</td>
            <td class="bg-unwrite"><input v-model="data['29_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>三、利润总额</td>
            <td style="text-align: center">30</td>
            <td class="bg-unwrite"><input v-model="data['30_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>　　　减:所得税费用</td>
            <td style="text-align: center">31</td>
            <td class="bg-unwrite"><input v-model="data['31_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
          <tr height="30">
            <td>四、净利润(净亏损以"-"号填列)</td>
            <td style="text-align: center">32</td>
            <td class="bg-unwrite"><input v-model="data['32_1']" /></td>
            <td style="text-align: right">0.00</td>
          </tr>
        </tbody>
      </table>
    </form>
    <div style="margin-top: 15px;margin-bottom: 15px;">
      <el-button size="small" type="primary" @click="resetData"><i class="uk-icon-refresh"></i> 数据还原</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuoShuiCaiWuBiao2',
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
  .GuoShuiCaiWuBiao2{
    padding: 10px;
  }
  table, table tr th, table tr td {
    font-family: '宋体';
    border: 1px solid #333;
  }

  table {
    max-width: 900px;
    min-height: 25px;
    line-height: 25px;
    text-align: center;
    border-collapse: collapse;
    padding: 2px;
  }

  input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    padding: 0 2px;
    outline: 0px;
    text-align: right;
  }

  td {
    padding: 3px 2px;
    text-align: left;
  }

  .bg-unwrite {
    background: #d6ebff;
  }
</style>
