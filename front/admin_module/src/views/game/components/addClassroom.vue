<template>
  <div>
    <div class="mb-20">
      <span class="w-80 inline-block text-right">教室名称：</span>
      <el-input v-model="listQuery.room_name" size="small" clearable placeholder="请输入教室名称" class="w-190">
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
    </div>
    <div class="con-table">
      <el-table
        ref="topicLists"
        size="mini"
        :data="list"
        border
        style="width: 100%"
        @select="tableSelectionChange"
        @select-all="selectAllRows"
      >
        <el-table-column type="selection" width="35" align="center" />
        <el-table-column prop="room_name" label="教室名称" />
        <el-table-column prop="seat" label="教室容量" width="80" />
      </el-table>
      <!--分页-->
      <pagination :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
    <div class="text-right mt-10">
      <el-button size="mini" type="primary" @click="saveCheck">保存</el-button>
    </div>
  </div>
</template>

<script>
import { placesList } from '@/api/game'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'AddClassroom',
  components: { Pagination },
  // 已有教室
  props: {
    rooms: {
      type: Object,
      required: true,
      defaults: {}
    }
  },
  data() {
    return {
      listQuery: {
        room_name: ''
      },
      // 分页控件数据
      total: 0, // 分页总条数
      pageQuery: {
        page: 1,
        page_size: 10
      },
      list: [],
      checkeds: [], // 已勾选集合
      checkItems: []
    }
  },
  mounted() {
    this.getChecks()
  },
  methods: {
    getList() {
      placesList(this.listQuery, this.pageQuery).then(res => {
        this.list = res.data.data
        this.total = res.data.total

        this.list.forEach(row => {
          if ((this.checkeds).indexOf(String(row.id)) > -1) {
            setTimeout(() => {
              this.$refs.topicLists.toggleRowSelection(row, true)
              this.checkItems.push(row)
            })
          }
        })
      })
    },
    // 单条选中
    tableSelectionChange(selection, row) {
      if ((this.checkeds).indexOf(row.id) < 0) {
        this.checkeds.push(row.id)
        this.checkItems.push(row)
      } else {
        var index = (this.checkeds).indexOf(row.id)
        this.checkeds.splice(index, 1)
        this.checkItems.splice(index, 1)
      }
    },
    // 全选
    selectAllRows(selection) {
      if (selection.length === 0) {
        // 取消全选
        this.list.forEach(value => {
          const index = this.checkeds.indexOf(value.id)
          if (index > -1) {
            this.checkeds.splice(index, 1)
            this.checkItems.splice(index, 1)
          }
        })
      } else {
        // 全选
        this.list.forEach(value => {
          if (this.checkeds.indexOf(value.id) === -1) {
            this.checkeds.push(value.id)
            this.checkItems.push(value)
          }
        })
      }
    },
    // 保存
    saveCheck() {
      var roomsData = {} // 已选择教室结构 教室id：{title：教室名称，exam_seat：考试容量}
      var rooms = this.checkItems
      for (var i in rooms) {
        roomsData[rooms[i].id] = {
          title: rooms[i].room_name,
          exam_seat: rooms[i].exam_seat,
          teacher: [], // 监考老师
          refTeacher: rooms[i].id + 'teacher',
          inputVisible: false // input状态
        }
      }
      this.$root.$emit('checkRoom', roomsData)
    },
    // 还原已勾选的教室
    getChecks() {
      this.checkeds = Object.keys(this.rooms)
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
