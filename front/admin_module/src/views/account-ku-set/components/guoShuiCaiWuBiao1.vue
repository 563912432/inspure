<template>
  <div class="GuoShuiCaiWuBiao1" style="height: 600px;overflow-y: auto">
    <!--资产负债表(已修改)-->
    <p style="font-size:24px; font-weight:bold;text-align: center;">资产负债表</p>
    <p style="width:100%; height:25px; text-align:right;">会小企01表</p>
    <p style="width:33%; float:left; height:25px;line-height: 25px; text-align:left; display: flex"><span style="width: 100px">编制单位:</span><input v-model="data.firm_name"></p>
    <p style="width:34%; float:left; height:25px;">20xx年12月31日</p>
    <p style="width:33%; float:right; height:25px; text-align:right;">单位:元</p>
    <form class="presetForm">
      <table cellpadding="0" cellspacing="0" border="1" width="100%">
        <tr height="40">
          <td width="25%" style="text-align:center;">资产</td>
          <td width="30" style="text-align:center;">行次</td>
          <td style="text-align:center;">期末余额</td>
          <td style="text-align:center;">年初余额</td>
          <td width="25%" style="text-align:center;">负债和所有者权益</td>
          <td width="30" style="text-align:center;">行次</td>
          <td style="text-align:center;">期末余额</td>
          <td style="text-align:center;">年初余额</td>
        </tr>
        <tr height="30">
          <td colspan="4">流动资产:</td>
          <td colspan="4">流动负债:</td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;货币资金</td>
          <td style="text-align:center;">1</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['1_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;短期借款</td>
          <td style="text-align:center;">31</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['1_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;短期投资</td>
          <td style="text-align:center;">2</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['2_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;应付票据</td>
          <td style="text-align:center;">32</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['2_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;应收票据</td>
          <td style="text-align:center;">3</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['3_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;应付账款</td>
          <td style="text-align:center;">33</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['3_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;应收账款</td>
          <td style="text-align:center;">4</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['4_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;预收账款</td>
          <td style="text-align:center;">34</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['4_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;预付账款</td>
          <td style="text-align:center;">5</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['5_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;应付职工薪酬</td>
          <td style="text-align:center;">35</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['5_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;应收股利</td>
          <td style="text-align:center;">6</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['6_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;应交税费</td>
          <td style="text-align:center;">36</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['6_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;应收利息</td>
          <td style="text-align:center;">7</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['7_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;应付利息</td>
          <td style="text-align:center;">37</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['7_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;其他应收款</td>
          <td style="text-align:center;">8</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['8_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;应付利润</td>
          <td style="text-align:center;">38</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['8_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;存货</td>
          <td style="text-align:center;">9</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['9_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;其他应付款</td>
          <td style="text-align:center;">39</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['9_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;其中：原材料</td>
          <td style="text-align:center;">10</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['10_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;其他流动负债</td>
          <td style="text-align:center;">40</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['10_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在产品</td>
          <td style="text-align:center;">11</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['11_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;流动负债合计</td>
          <td style="text-align:center;">41</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['11_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库存商品</td>
          <td style="text-align:center;">12</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['12_2']"></td>
          <td colspan="4">非流动负债:</td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;周转材料</td>
          <td style="text-align:center;">13</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['13_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;长期借款</td>
          <td style="text-align:center;">42</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['13_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;其他流动资产</td>
          <td style="text-align:center;">14</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['14_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;长期应付款</td>
          <td style="text-align:center;">43</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['14_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;流动资产合计</td>
          <td style="text-align:center;">15</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['15_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;递延收益</td>
          <td style="text-align:center;">44</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['15_4']"></td>
        </tr>
        <tr height="30">
          <td colspan="4">非流动资产:</td>
          <td>&nbsp;&nbsp;&nbsp;其他非流动负债</td>
          <td style="text-align:center;">45</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['16_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;长期债券投资</td>
          <td style="text-align:center;">16</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['17_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;非流动负债合计</td>
          <td style="text-align:center;">46</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['17_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;长期股权投资</td>
          <td style="text-align:center;">17</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['18_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;负债合计</td>
          <td style="text-align:center;">47</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['18_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;固定资产原价</td>
          <td style="text-align:center;">18</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['19_2']"></td>
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;减:累计折旧</td>
          <td style="text-align:center;">19</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['20_2']"></td>
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;固定资产账面价值</td>
          <td style="text-align:center;">20</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['21_2']"></td>
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;在建工程</td>
          <td style="text-align:center;">21</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['22_2']"></td>
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;工程物资</td>
          <td style="text-align:center;">22</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['23_2']"></td>
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;固定资产清理</td>
          <td style="text-align:center;">23</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['24_2']"></td>
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;生产性生物资产</td>
          <td style="text-align:center;">24</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['25_2']"></td>
          <td colspan="4">所有者权益(或股东权益):</td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;无形资产</td>
          <td style="text-align:center;">25</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['26_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;实收资本(或股本)</td>
          <td style="text-align:center;">48</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['26_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;开发支出</td>
          <td style="text-align:center;">26</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['27_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;资本公积</td>
          <td style="text-align:center;">49</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['27_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;长期待摊费用</td>
          <td style="text-align:center;">27</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['28_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;盈余公积</td>
          <td style="text-align:center;">50</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['28_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;其他非流动资产</td>
          <td style="text-align:center;">28</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['29_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;未分配利润</td>
          <td style="text-align:center;">51</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['29_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;非流动资产合计</td>
          <td style="text-align:center;">29</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['30_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所有者权益(或股东权益)合计</td>
          <td style="text-align:center;">52</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['30_4']"></td>
        </tr>
        <tr height="30">
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资产总计</td>
          <td style="text-align:center;">30</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['31_2']"></td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;负债和所有者权益(或股东权益)总计</td>
          <td style="text-align:center;">53</td>
          <td style="text-align: right">0.00</td>
          <td style="background-color:#d6ebff;"><input v-model="data['31_4']"></td>
        </tr>
      </table>
    </form>
    <div style="margin-top: 15px" class="uk-text-center">
      <el-button type="primary" size="small" @click="resetData"><i class="uk-icon-refresh" /> 数据还原</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'GuoShuiCaiWuBiao1',
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
  table, table tr th, table tr td {
    font-family: '宋体';
    border: 1px solid #333;
  }
  table td {
    text-align: left;
  }

  table {
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
  }

  .GuoShuiCaiWuBiao1{
    position: relative;
    padding: 10px;
    height: 100%;
    overflow: auto;
  }
  #zzsjmssbmxb_ycA
  {
    width:400px;
    height:auto;
    position:absolute;
    top:234px;
    left:1px;
    background-color:#FFFED6;
    border-right:1px #000 solid;
    display:none;
  }
  #zzsjmssbmxb_ycA div
  {
    border-bottom:1px #000 solid;
    cursor:pointer;
  }
  #zzsjmssbmxb_ycB
  {
    display:none;
    width:400px;
    height:auto;
    position:absolute;
    top:483px;
    left:0px;
    background-color:#FFFED6;
  }
  #zzsjmssbmxb_ycB div
  {
    cursor:pointer;
    border-bottom:1px #000 solid;
    border-left:1px #000 solid;
    border-right:1px #000 solid;
  }
  .zzsjmssbmxb_ycA:hover,
  .zzsjmssbmxb_ycB:hover{
    background-color: #09f;
    color: #fff;
  }

</style>
