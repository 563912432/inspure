<template>
  <div class="apply">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
      <div class="search-more fl mr-20" @click="searchState = !searchState">
        <span>高级搜索</span>
        <i :class="searchState?'el-icon-arrow-up':'el-icon-arrow-down'" />
      </div>
      <el-collapse-transition>
        <div v-show="searchState" class="search-more-content">
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">比赛名称：</span>
            <el-input v-model="listQuery.title" size="small" clearable placeholder="请输入比赛名称" class="w-190" />
          </div>
          <div class="mb-20 fl w-half text-right">
            <span class="w-80 inline-block text-right">状态：</span>
            <el-select v-model="listQuery.enable" placeholder="请选择比赛状态" size="small" clearable class="w-190">
              <el-option label="未发布" value="0" />
              <el-option label="已发布" value="1" />
              <el-option label="未开始" value="2" />
              <el-option label="已开始" value="3" />
              <el-option label="已结束" value="4" />
            </el-select>
          </div>
          <div class="mb-20 fl w-half">
            <span class="w-80 inline-block text-right">报名时间：</span>
            <el-date-picker
              v-model="listQuery.start_at"
              size="small"
              style="width: 190px;"
              type="datetime"
              clearable
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </div>
          <div class="text-right">
            <el-button size="mini" type="primary" @click="getList">
              查询
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="mb-12 h-30">
      <span class="fr">
        <el-button size="mini" type="primary" @click="addgame">
          参加比赛报名
        </el-button>
        <el-button size="mini" type="primary" @click="releaseSignup">
          发布比赛报名
        </el-button>
      </span>
    </div>
    <div class="con-table">
      <el-table
        size="mini"
        :data="gameData"
        border
        style="width: 100%"
        @selection-change="tableSelectionChange"
      >
        <el-table-column type="selection" width="35" align="center" />
        <el-table-column prop="title" label="比赛名称" />
        <el-table-column prop="enable" label="状态" width="60">
          <template slot-scope="{ row }">
            {{ row.enable === 0? '未发布': '已发布' }}
          </template>
        </el-table-column>
        <el-table-column prop="certificate" label="关联证书" width="">
          <template slot-scope="{ row }">
            {{ row.cert? row.cert.title: '' }}
          </template>
        </el-table-column>
        <el-table-column prop="exam" label="关联考试" width="">
          <template slot-scope="{ row }">
            <span v-if="row.cert">
              <p v-for="(item,index) in row.match" :key="index">{{ item.title }},</p>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="start_at" label="开始时间" width="" />
        <el-table-column prop="end_at" label="结束时间" width="" />
        <el-table-column prop="student_count" label="已报名人数" width="90" />
        <el-table-column prop="enable_at" label="发布时间" width="" />
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editGame(scope.row.id)">编辑</el-button>
            <el-button type="text" size="mini" @click="delGame(scope.row.id)">删除</el-button>
            <el-button type="text" size="mini" @click="toRegistrationLink(scope.row)">报名链接</el-button>
            <el-button type="text" size="mini" @click="toGameUser(scope.row)">比赛人员信息</el-button>
            <el-button type="text" size="mini" @click="toPlaces(scope.row.id)">场地安排</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getList" />
    </div>
    <!--比赛报名新增-->
    <div v-if="dialogGameApplyVisible">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogGameApplyVisible"
        :close-on-click-modal="false"
        :modal="false"
        title="新增比赛报名"
        width="600px"
        @dragDialog="gameApplyHandleDrag"
      >
        <div ref="top">
          <AddGameApply ref="gameApply" :apply-id="applyId" />
        </div>
      </el-dialog>
    </div>
    <!--报名链接弹窗-->
    <div v-if="dialogLinkVisible">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogLinkVisible"
        :close-on-click-modal="false"
        :modal="false"
        title="报名链接"
        width="600px"
        @dragDialog="gameLinkDrag"
      >
        <div ref="linktop">
          <RegistrationLink ref="linkname" />
        </div>
      </el-dialog>
    </div>
    <!--比赛人员信息弹窗-->
    <div v-if="dialogGameUserVisible">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogGameUserVisible"
        :close-on-click-modal="false"
        :modal="false"
        title="比赛人员信息"
        width="800px"
        @dragDialog="gameGameUserDrag"
      >
        <div ref="gameuser">
          <GameUser ref="gameUserInfo" />
        </div>
      </el-dialog>
    </div>
    <!--场地设置弹窗 PlacesSetting-->
    <div v-if="dialogPlacesVisible">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogPlacesVisible"
        :close-on-click-modal="false"
        :modal="false"
        title="场地安排"
        width="1100px"
        @dragDialog="gamePlacesDrag"
      >
        <div ref="placestop">
          <PlacesSetting ref="placesname" :apply-id="applyId" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { signupList, signupDel, signupEnable } from '@/api/game'
import Header from '@/views/common/header-span'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import AddGameApply from './components/addGameApply'
import RegistrationLink from './components/registrationLink'
import GameUser from './components/gameUser'
import PlacesSetting from './placesSetting'

export default {
  name: 'Apply',
  components: { Header, Pagination, AddGameApply, RegistrationLink, GameUser, PlacesSetting },
  directives: { elDragDialog },
  data() {
    return {
      searchState: false,
      listQuery: {
        title: '',
        enable: '',
        start_at: ''
      },
      gameData: [],
      // 分页控件数据
      total: 0, // 分页总条数
      pageQuery: {
        page: 1,
        page_size: 10
      },
      // 弹窗控件部分
      dialogGameApplyVisible: false, // 新增比赛报名弹窗
      dialogLinkVisible: false, // 报名链接弹窗依据
      dialogGameUserVisible: false, // 比赛人员信息弹窗
      dialogPlacesVisible: false, // 场地安排弹窗
      applyId: 0, // 报名ID
      multipleSelection: [] // 勾选集合
    }
  },
  computed: {
    title() {
      return '报名管理'
    }
  },
  mounted() {
    this.getList() // 查询报名列表
    this.$root.$on('saveSuccess', res => {
      this.dialogGameApplyVisible = false
      this.getList()
    })
    // 场地发布成功
    this.$root.$on('savePlaces', res => {
      this.dialogPlacesVisible = false
      this.getList()
    })
  },
  methods: {
    getList() {
      signupList(this.listQuery, this.pageQuery).then(res => {
        this.gameData = res.data.data
      })
    },
    // 参加比赛报名新增
    addgame() {
      this.applyId = 0 // 初始化报名id
      this.dialogGameApplyVisible = true
      setTimeout(() => {
        this.$refs.gameApply.getCertList()
      })
    },
    // 比赛报名新增拖拽
    gameApplyHandleDrag() {
      this.$refs.top.blur()
    },
    // 比赛链接拖拽
    gameLinkDrag() {
      this.$refs.linktop.blur()
    },
    // 比赛人员信息弹窗拖拽
    gameGameUserDrag() {
      this.$refs.gameuser.blur()
    },
    // 场地安排弹窗
    gamePlacesDrag() {
      this.$refs.placestop.blur()
    },
    // 报名信息编辑
    editGame(id) {
      this.dialogGameApplyVisible = true
      this.applyId = id
    },
    // 报名信息删除
    delGame(id) {
      this.$confirm('删除报名信息确认', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消删除',
        type: 'warning'
      }).then(() => {
        signupDel({ id: id }).then(res => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    // 报名链接弹窗
    toRegistrationLink(row) {
      this.dialogLinkVisible = true
      setTimeout(() => {
        this.$refs.linkname.gameName = row.gamename // 这句很重要
        this.$refs.linkname.gameId = row.id // 这句很重要
      })
    },
    // 人员信息展示
    toGameUser(row) {
      this.dialogGameUserVisible = true
      setTimeout(() => {
        this.$refs.gameUserInfo.gameName = row.gamename // 这句很重要
        this.$refs.gameUserInfo.gameId = row.id // 这句很重要
      })
    },
    // 发布报名
    releaseSignup() {
      var data = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        data.push(String(this.multipleSelection[i].id))
      }
      signupEnable({ id: data }).then(res => {
        this.$message.success('发布成功')
        this.getList()
      })
    },
    // 场地安排
    toPlaces(id) {
      this.dialogPlacesVisible = true
      this.applyId = id
    },
    // 表格勾选
    tableSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style>
  .apply .el-table .cell{
    text-align: center;
  }
  .apply .el-table--border th:first-child .cell,
  .apply .el-table--border td:first-child .cell {
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
  }
  .apply .el-dialog__body{
    padding: 7px;
  }
</style>
<style scoped>
  .apply .w-half{
    width: 50%;
  }
</style>
