<template>
  <div>
    <el-table :data="data" border fit highlight-current-row :stripe="true" style="width: 100%" size="mini">
      <el-table-column prop="zc" label="资产" width="" />
      <el-table-column prop="zh" label="行次" width="" align="center" />
      <el-table-column prop="zy" label="月末余额" />
      <el-table-column label="计分百分比" align="center">
        <template slot-scope="{ row }">
          <el-input v-model="row.zs" size="mini" class="w-65" /> %
        </template>
      </el-table-column>
      <el-table-column prop="fz" label="负债和所有者权益" />
      <el-table-column prop="fh" label="行次" align="center" />
      <el-table-column prop="fy" label="月末余额" />
      <el-table-column label="计分百分比" align="center">
        <template slot-scope="{ row }">
          <el-input v-model="row.fs" size="mini" class="w-65" /> %
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ZiChan',
  props: {
    data: {
      type: Array,
      required: true,
      defaults: []
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  .height-40 {
    height: 40px;
    padding: 0;
    margin: 0;
  }
  .line-height-40 {
    line-height: 40px;
  }
</style>
