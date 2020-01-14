<!--eslint-disable-->
<template>
  <div class="GuoShuiZengZhiBiao3">
    <div>
      <p style="font-size:20px;height:35px; font-weight:bold;text-align: center;">增&nbsp;&nbsp;值&nbsp;&nbsp;税&nbsp;&nbsp;纳&nbsp;&nbsp;税&nbsp;&nbsp;申&nbsp;&nbsp;报&nbsp;&nbsp;表</p>
      <p style="font-weight:bold;height:40px; font-size:18px;text-align: center;">（适用于增值税一般纳税人）</p>
      <p style="text-align:center;font-size: 12px">根据国家税收法律法规及增值税相关规定制定本表。纳税人不论有无销售额，均应按税务机关核定的纳税期限填写本表，并向当地税务机关申报。</p>
      <br/>
      <p style="width:40%; height:30px; float:left; text-align:left;font-size: 12px">税款所属时间：20xx年xx月xx日至20xx年xx月xx日</p>
      <p style="width:30%; height:30px; float:left;font-size: 12px">填表日期：20xx年xx月xx日</p>
      <p style="width:30%; height:30px; text-align:right; float:left;font-size: 12px">金额单位：元至角分</p>
      <p style="width:50%; height:25px; line-height: 25px; float:left; text-align:left;font-size: 12px" class="flex"><span style="display: inline-block;width: 120px">纳税人识别号：</span><input type="text" class="fl" v-model="data.firm_code"></p>
      <p style="width:50%; height:25px; line-height: 25px; float:left; text-align:left;font-size: 12px" class="flex"><span style="display: inline-block;width: 100px">所属行业：</span><input type="text" v-model="data.firm_trade"></p>
      <form class="presetForm">
        <table cellpadding="0" cellspacing="0" border="1" width="100%">
          <tr>
            <td colspan="2" width="9%" class='text-center'>纳税人名称</td>
            <td width="20%" class='text-center'><input type="text" v-model="data.firm_name" />（公章）</td>
            <td width="11%" class='text-center'>法定代表人姓名</td>
            <td colspan="2" width="8%" class='text-center'><input type="text" v-model="data.firm_legal_person"></td>
            <td width="8%" class='text-center'>注册地址</td>
            <td><input type="text" v-model="data.firm_address"/></td>
            <td class='text-center'>生产经营地址</td>
            <td><input type="text" v-model="data.firm_operating"></td>
          </tr>
          <tr>
            <td colspan="2">开户银行及账号</td>
            <td class='text-center'><input type="text" v-model="data.firm_bank_code"/></td>
            <td class='text-center'>登记注册类型</td>
            <td colspan="4" class='text-center'> <input type="text" v-model="data.firm_type" /></td>
            <td class='text-center'>电话号码</td>
            <td><input type="text" v-model="data.firm_telephone" /></td>
          </tr>
          <tr>
            <td rowspan="2" colspan="3" class='text-center'>项目</td>
            <td rowspan="2" class='text-center'>栏次</td>
            <td colspan="4" class='text-center'>一般项目</td>
            <td colspan="2" class='text-center'>即征即退项目</td>
          </tr>
          <tr>
            <td colspan="3" class='text-center'>本月数</td>
            <td class='text-center'>本年累计</td>
            <td class='text-center'>本月数</td>
            <td class='text-center'>本年累计</td>
          </tr>
          <tr>
            <td rowspan="10" width="1%">销<br/><br/><br/>售<br/><br/><br/>额</td>
            <td colspan="2" class="tdleft">（一）按适用税率征税销售额</td>
            <td class='text-center'>1</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['1_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">　　　其中：应税货物销售额</td>
            <td class='text-center'>2</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['2_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">　　　　　　应税劳务销售额</td>
            <td class='text-center'>3</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['3_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">　　　　　　纳税检查调整的销售额</td>
            <td class='text-center'>4</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['4_2']"/></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">（二）按简易办法计税销售额</td>
            <td class='text-center'>5</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['5_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">　　　其中：纳税检查调整的销售额</td>
            <td class='text-center'>6</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['6_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">（三）免、抵、退办法出口销售额</td>
            <td class='text-center'>7</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['7_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">（四）免税销售额</td>
            <td class='text-center'>8</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['8_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">　　　其中：免税货物销售额</td>
            <td class='text-center'>9</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['9_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">　　　　　　免税劳务销售额</td>
            <td class='text-center'>10</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['10_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td rowspan="14">税<br/><br/><br/><br/>款<br/><br/><br/><br/>计<br/><br/><br/><br/>算</td>
            <td colspan="2" class="tdleft">销项税额</td>
            <td class='text-center'>11</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['11_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">进项税额</td>
            <td class='text-center'>12</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['12_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">上期留抵税额</td>
            <td class='text-center'>13</td>
            <td colspan="3" style="background-color:#d6ebff;"><input v-model="data['13_1']" tabindex="23" /></td>
            <td style="background-color:#d6ebff;"><input v-model="data['13_2']" /></td>
            <td>0.00</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">进项税额转出</td>
            <td class='text-center'>14</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['14_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">免、抵、退应退税额</td>
            <td class='text-center'>15</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['15_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">按适用税率计算的纳税检查应补缴税额</td>
            <td class='text-center'>16</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['16_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">应抵扣税额合计</td>
            <td class='text-center'>17=12+13-14-15+16</td>
            <td colspan="3">0.00</td>
            <td class='text-center'>----</td>
            <td>0.00</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">实际抵扣税额</td>
            <td class='text-center'>18(如17＜11为17，否则为11)</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['18_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">应纳税额</td>
            <td class='text-center'>19=11-18</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['19_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">期末留抵税额</td>
            <td class='text-center'>20=17-18</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['20_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">简易计税办法计算的应纳税额</td>
            <td class='text-center'>21</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['21_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">按简易计税办法计算的纳税检查应补缴税额</td>
            <td class='text-center'>22</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['22_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">应纳税额减征额</td>
            <td class='text-center'>23</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['23_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">应纳税额合计</td>
            <td class='text-center'>24=19+21-23</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['24_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td rowspan="14">税<br/><br/><br/><br/>款<br/><br/><br/><br/>缴<br/><br/><br/><br/>纳</td>
            <td colspan="2" class="tdleft">期初未缴税额（多缴为负数）</td>
            <td class='text-center'>25</td>
            <td colspan="3" style="background-color:#d6ebff;"><input v-model="data['25_1']" /></td>
            <td style="background-color:#d6ebff;"><input v-model="data['25_2']" /></td>
            <td style="background-color:#d6ebff;"><input v-model="data['25_3']" tabindex="46" /></td>
            <td style="background-color:#d6ebff;"><input v-model="data['25_4']" tabindex="47" /></td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">实收出口开具专用缴款书退税额</td>
            <td class='text-center'>26</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['26_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">本期已缴税额</td>
            <td class='text-center'>27=28+29+30+31</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['27_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">①分次预缴税额</td>
            <td class='text-center'>28</td>
            <td colspan="3">0.00</td>
            <td class='text-center'>----</td>
            <td>0.00</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">②出口开具专用缴款书预缴税额</td>
            <td class='text-center'>29</td>
            <td colspan="3">0.00</td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">③本期缴纳上期应纳税额</td>
            <td class='text-center'>30</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['30_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">④本期缴纳欠缴税额</td>
            <td class='text-center'>31</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['31_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">期末未缴税额（多缴为负数）</td>
            <td class='text-center'>32=24+25+26-27</td>
            <td colspan="3" style="background-color:#d6ebff;"><input v-model="data['32_1']" /></td>
            <td style="background-color:#d6ebff;"><input v-model="data['32_2']" /></td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">其中：欠缴税额(≥0)</td>
            <td class='text-center'>33=25+26-27</td>
            <td colspan="3">0.00</td>
            <td class='text-center'>----</td>
            <td>0.00</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">本期应补（退）税额</td>
            <td class='text-center'>34=24-28-29</td>
            <td colspan="3">0.00</td>
            <td class='text-center'>----</td>
            <td>0.00</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">即征即退实际退税额</td>
            <td class='text-center'>35</td>
            <td colspan="3" class='text-center'>----</td>
            <td class='text-center'>----</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">期初未缴查补税额</td>
            <td class='text-center'>36</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['36_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">本期入库查补税额</td>
            <td class='text-center'>37</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['37_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr>
            <td colspan="2" class="tdleft">期末未缴查补税额</td>
            <td class='text-center'>38=16+22+36-37</td>
            <td colspan="3">0.00</td>
            <td style="background-color:#d6ebff;"><input v-model="data['38_2']" /></td>
            <td class='text-center'>----</td>
            <td class='text-center'>----</td>
          </tr>
          <tr style="height:140px;">
            <td class="tdleft">授权声明</td>
            <td colspan="3" class="tdleft" style="padding:10px;">如果你已委托代理人申报，请填写下列资料：<br/>为代理一切税务事宜，现授权<br/>（地址）<br/>为本纳税人的代理申报人，任何与本申报表有关的往来文件，都可寄予此人。<br/><br/>
              <p class="tdleft" style="width:50%; float:right; text-align:left;">授权人签字：</p>
            </td>
            <td width="1%" class="tdleft">申报人声明</td>
            <td colspan="5" class="tdleft" style="padding:10px;">　　本纳税申报表是根据国家税法法律法规及相关规定填报的，我确定它是真实的、可靠的、完整的。<br/><br/><br/><br/><br/>
              <p style="width:70%; float:right; text-align:left;" class="tdleft">声明人签字：</p>
            </td>
          </tr>
        </table>
      </form>
    </div>
    <div style="margin-top: 15px" class="uk-text-center">
      <el-button type="primary" size="small" @click="resetData"><i class="uk-icon-refresh"></i> 数据还原</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuoShuiZengZhiBiao3',
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
  .GuoShuiZengZhiBiao3{
    padding: 20px 10px;
    margin: 0px auto;
    height: 600px;
    overflow-y: auto;
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
    text-align: center;
    padding: 3px 2px;
    text-align: right;
  }

  .tdleft{
    text-align: left;
  }
  .text-center{
    text-align: center;
  }
</style>
