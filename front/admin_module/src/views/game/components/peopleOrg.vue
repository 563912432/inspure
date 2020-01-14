<template>
  <div class="people-org">
    <div class="search-more-content">
      <div v-for="(item,index) in orgForm" :key="index" class="mb-10" :class="index%2 ? 'text-right': ''">
        <!--<p class="w-150 inline-block text-right">{{ item.org_name }}：</p>-->
        <el-input v-model="orgSum[item.id].sum" size="small" clearable class="w-half" placeholder="请输入人数">
          <template slot="prepend">{{ item.org_name }}：</template>
          <template slot="append">人</template>
        </el-input>
      </div>
      <div class="text-right">
        <el-button size="small" class="mt-10" type="primary" @click="peopleSubmit">
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { orgList } from '@/api/game'
export default {
  name: 'PeopleOrg',
  data() {
    return {
      orgForm: [], // 机构名称
      orgSum: {} // 机构人数集合
    }
  },
  mounted() {
    this.getList() // 查询试卷列表
  },
  methods: {
    getList() {
      orgList().then(res => {
        this.orgForm = res.data.data // 企业集合

        var org = res.data.data
        for (var i = 0; i < org.length; i++) {
          this.$set(org[i], ['sum'], '')
          this.$set(this.orgSum, org[i].id, org[i]) // 组织结构
        }
      })
    },
    peopleSubmit() {
      this.$root.$emit('closeOrg', this.orgSum)
    }
  }
}
</script>

<style scoped>
  .people-org{
    padding: 10px;
  }
  .w-half{
    width: 50%;
  }
  .w-120{
    width: 120px;
  }
</style>
