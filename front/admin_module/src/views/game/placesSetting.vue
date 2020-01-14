<template>
  <div class="places">
    <div class="mb-12 h-30 lh-30">
      <!--<span class="fl">-->
      <!--未安排人数: 3人-->
      <!--</span>-->
      <span class="fr">
        <el-button size="mini" @click="addClassroom">
          添加教室
        </el-button>
        <el-button size="mini" @click="randomRow">
          随机安排考试人员
        </el-button>
      </span>
    </div>
    <div class="con-table">
      <el-table
        size="mini"
        :data="Object.keys(roomsData).slice((pageQuery.page - 1) * pageQuery.page_size, pageQuery.page * pageQuery.page_size)"
        border
        style="width: 100%"
        @selection-change="tableSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column label="教室" width="100">
          <template slot-scope="{ row }">
            {{ roomsData[row].title }}
          </template>
        </el-table-column>
        <el-table-column prop="user" label="考试人员">
          <template v-if="arranged[row]" slot-scope="{ row }">
            <el-tag
              v-for="(tag,index) in arranged[row]"
              :key="index"
              closable
              class="mz-5 fl"
              @close="removeStudent(row, index)"
            >
              {{ tag.username }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="人数" width="60">
          <template slot-scope="{ row }">
            <span :class="arranged[row]? arranged[row].length > roomsData[row].exam_seat? 'color-red': '': ''">{{ arranged[row]? arranged[row].length: 0 }}</span> / {{ roomsData[row].exam_seat }}
          </template>
        </el-table-column>
        <el-table-column prop="invigilation" label="考务人员" width="200">
          <template slot-scope="{ row }">
            <el-tag
              v-for="tag in roomsData[row].teacher"
              :key="tag"
              closable
              class="mb-5"
              :disable-transitions="false"
              @close="handleClose(tag, row)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="roomsData[row].inputVisible"
              :ref="roomsData[row].refTeacher"
              v-model="inputValue"
              class="input-new-tag"
              size="mini"
              style="width: 100px;"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              @click="planStudent(row)"
            >安排考试人员</el-button>
            <el-button
              size="mini"
              @click="delRoom(row)"
            >删除教室</el-button>
            <el-button v-if="!roomsData[row].inputVisible" size="mini" @click="showInput(roomsData[row].refTeacher, row)">新增监考</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" />
      <div class="text-right">
        <el-button size="mini" type="primary" @click="savePlaces">
          保存安排
        </el-button>
      </div>
    </div>
    <!--教室选择-->
    <div v-if="classroomShow">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="classroomShow"
        :close-on-click-modal="false"
        :modal="false"
        title="教室选择"
        width="500px"
        @dragDialog="gameClassroomDrag"
      >
        <div ref="classroomtop">
          <AddClassroom ref="classroom" :rooms="roomsData" />
        </div>
      </el-dialog>
    </div>
    <!--考生安排-->
    <div v-if="planStuShow">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="planStuShow"
        :close-on-click-modal="false"
        :modal="false"
        title="考生安排"
        width="700px"
        @dragDialog="gamePlanStuDrag"
      >
        <div ref="planStuTop">
          <PlanStu ref="planStu" :room-id="roomId" :appid="appid" :plan-item="planItem" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { randomArrangement, configAdd, getArrange } from '@/api/game'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import AddClassroom from './components/addClassroom'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PlanStu from './components/planStu'
export default {
  name: 'PlacesSetting',
  components: { AddClassroom, Pagination, PlanStu },
  directives: { elDragDialog },
  props: {
    // 报名 ID
    applyId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      checkeds: [], // 选中的教室
      classroomShow: false,
      planStuShow: false,
      // 分页控件数据
      total: 0, // 分页总条数
      pageQuery: {
        page: 1,
        page_size: 10
      },
      planItem: {
        un_arrange: [], // 未安排考生的集合
        arranged: [] // 已安排考生的集合
      },
      appid: 0,
      roomId: '0', // 选中教室Id
      roomsData: {}, // 已选教室集合
      arranged: {}, // 已安排考生集合
      un_arrange: [], // 未安排考生集合
      inputValue: '' // 监考老师名称临时存放
    }
  },
  mounted() {
    this.getList() // 插叙是否已经安排场地
    // 教室勾选后确认
    this.$root.$on('checkRoom', res => {
      this.classroomShow = false // 关闭教室选择弹窗
      this.roomsData = res
      // 分页信息
      this.total = Object.keys(res).length // 场地总条数
      this.$forceUpdate()
    })
    // 安排学生后确认
    this.$root.$on('saveStuCheck', res => {
      // 待安排学生更新
      this.un_arrange = res.no_check_ids
      // 考场内增加考生
      for (var i = 0; i < res.students.length; i++) {
        if (!this.arranged[res.roomId]) {
          this.arranged[res.roomId] = []
        }
        this.arranged[res.roomId].push(res.students[i])
      }

      this.planStuShow = false // 关闭弹窗
    })
  },
  methods: {
    // 查询场地信息
    getList() {
      getArrange(this.applyId).then(res => {
        if (Object.keys(res.data).length !== 0) {
          for (var i in res.data) {
            // 教室结构重组
            this.roomsData[i] = {
              title: res.data[i].place.room_name,
              exam_seat: res.data[i].place.exam_seat,
              teacher: res.data[i].teacher,
              refTeacher: i + 'teacher',
              inputVisible: false
            }
            // 已选考生重组
            this.$set(this.arranged, i, res.data[i].student)
          }
          this.$forceUpdate()
        }
      })
    },

    // 教室列表多选
    tableSelectionChange(val) {
      this.checkeds = val
    },

    // 添加教室
    addClassroom() {
      this.classroomShow = true
    },

    // 教室弹窗拖拽
    gameClassroomDrag() {
      this.$refs.classroomtop.blur()
    },

    // 考生安排弹窗拖拽
    gamePlanStuDrag() {
      this.$refs.planStuTop.blur()
    },

    // 随机安排考试人员
    randomRow() {
      // 检测教室是否为空
      if (Object.keys(this.roomsData).length !== 0) {
        // 处理教室结构为随机安排所需结构  教室id：考试容量
        var roomConfig = {}
        for (var i in this.roomsData) {
          roomConfig[i] = this.roomsData[i].exam_seat
        }
        // 组件随机安排的结构
        var data = {
          id: this.applyId,
          config: roomConfig
        }

        randomArrangement(data).then(res => {
          this.arranged = res.data.arranged
          this.un_arrange = res.data.un_arrange
        })
      } else {
        this.$message.error('请先添加教室')
      }
    },

    // 删除学生进入待安排区
    removeStudent(roomid, key) {
      this.un_arrange.push(this.arranged[roomid][key].stu_id) // 待安排集合内存入删除的考生信息
      this.arranged[roomid].splice(key, 1) // 删除已安排考生信息
      this.$forceUpdate()
    },

    // 安排待选区的考生
    planStudent(id) {
      // id 教室id
      this.planStuShow = true
      setTimeout(() => {
        this.roomId = id // 教室id
        this.appid = this.applyId // 报名ID
        this.planItem.un_arrange = this.un_arrange // 未安排考生集合
        this.planItem.arranged = this.arranged // 已安排考生集合
      })
    },

    // 删除教室
    delRoom(roomid) {
      for (var i in this.roomsData) {
        // 删除当前教室
        if (i === roomid) {
          // 判断当前教室是否分配考生
          if (this.arranged[i] && this.arranged[i].length !== 0) {
            for (var k in this.arranged[i]) {
              // 把当前教室下绑定的考生转存至待安排集合内
              this.un_arrange.push(this.arranged[i][k].stu_id)
            }
          }
          this.$delete(this.arranged, i)
          this.$delete(this.roomsData, i)
        }
      }
    },

    // 保存场地安排
    savePlaces() {
      var data = {
        config: {}
      }

      // 添加监考人员
      for (var i in this.roomsData) {
        data.config[i] = {}
        data.config[i].teacher = this.roomsData[i].teacher
      }
      // 添加考试学生
      for (var k in this.arranged) {
        data.config[k].student_id = []
        for (var s = 0; s < this.arranged[k].length; s++) {
          data.config[k].student_id.push(this.arranged[k][s].stu_id)
        }
      }
      // 判断是否手动安排学生
      if (Object.keys(this.un_arrange).length !== 0) {
        this.$confirm('还有考生未被安排场地是否继续保存', '提示', {
          confirmButtonText: '确定保存',
          cancelButtonText: '取消保存',
          type: 'warning'
        }).then(() => {
          // console.log(data.config)
          configAdd({ id: this.applyId, config: data.config }).then(res => {
            this.$message.success('保存成功')
            this.$root.$emit('savePlaces')
          })
        }).catch(() => {})
      } else {
        configAdd({ id: this.applyId, config: data.config }).then(res => {
          this.$message.success('保存成功')
          this.$root.$emit('savePlaces')
        })
      }
    },

    // 监考老师控制部分
    handleClose(tag, roomid) {
      this.roomsData[roomid].teacher.splice(this.roomsData[roomid].teacher.indexOf(tag), 1)
    },

    showInput(data, roomid) {
      this.roomsData[roomid].inputVisible = true
      this.$nextTick(_ => {
        setTimeout(() => {
          this.$refs[data].focus()
        })
      })
    },

    handleInputConfirm(roomid) {
      var inputValue = this.inputValue
      if (inputValue) {
        if (this.roomsData[roomid].teacher.indexOf(inputValue) < 0) {
          this.roomsData[roomid].teacher.push(inputValue)
        }
      }
      this.roomsData[roomid].inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style>
  .places .el-table .cell{
    padding: 0px;
  }
  .places .el-table td div{
    width: 100%;
  }
  .places .el-input--mini .el-input__inner{
    border: 0px;
  }
  .places .el-tag + .el-tag {
    margin-left: 10px;
  }
  /*.places .button-new-tag {*/
    /*margin-left: 10px;*/
    /*height: 32px;*/
    /*line-height: 30px;*/
    /*padding-top: 0;*/
    /*padding-bottom: 0;*/
  /*}*/
  .places .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
<style scoped>
  .lh-30{
    line-height: 30px;
  }
  .color-red {
    color: red;
  }
  .mz-5 {
    margin: 0 0 5px 5px;
  }
  .mb-5{
    margin-bottom: 5px;
  }
</style>
