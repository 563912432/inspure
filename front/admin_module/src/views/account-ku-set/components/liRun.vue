<template>
  <div>
    <el-table :data="data" border fit highlight-current-row :stripe="true" style="width: 100%" size="mini">
      <el-table-column prop="title" label="项目" width="" />
      <el-table-column prop="hang" label="行次" width="" align="center" />
      <el-table-column prop="jin_e" label="本月金额" />
      <el-table-column label="计分百分比" align="center">
        <template slot-scope="{ row }">
          <el-input v-model="row.score" size="mini" class="w-65" /> %
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'LiRun',
  props: {
    data: {
      type: Array,
      required: true,
      defaults: []
    }
  }
}
</script>

<style scoped>

</style>
