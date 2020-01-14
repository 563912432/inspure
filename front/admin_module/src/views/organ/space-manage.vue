<template>
  <div class="place">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
      <el-input v-model="listQuery.room_name" size="mini" clearable placeholder="请输入场地名称" class="w-190 mr-20">
        <el-button slot="append" icon="el-icon-search" @click="getListPlace" />
      </el-input>
      <el-select v-model="listQuery.room_type_id" clearable placeholder="请选择场地类型" size="mini" @change="getListPlace">
        <el-option v-for="(item, index) in listPlaceType" :key="index" :label="item.type_name" :value="item.id" />
      </el-select>
    </div>
    <div class="mb-12">
      <el-button size="small" plain @click="placeTypeSet">场地类型设置</el-button>
      <span class="fr">
        <el-button size="small" type="primary" @click="handlePlaceCreate">增加场地</el-button>
        <el-button size="small" plain @click="handlePlaceImport">导入场地</el-button>
        <el-button size="small" plain @click="handlePlaceDel">批量删除</el-button>
      </span>
    </div>
    <div class="box-shadow bg-white">
      <!--table-->
      <el-table
        v-loading="listPlaceLoading"
        size="mini"
        :data="listPlace"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="场地名称" width="" show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-button type="text" class="text-blue" size="mini" @click="handleUpdatePlace(row)">
              {{ row.room_name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="所属机构" width="" prop="belong_org" show-overflow-tooltip />
        <el-table-column label="场地类型" width="" prop="place_type_name" align="center" />
        <el-table-column label="场地容量" width="120" prop="seat" align="center" />
        <el-table-column label="场地考试容量" width="120" prop="exam_seat" align="center" />
        <el-table-column label="是否启用" width="100" align="center">
          <template slot-scope="{row}">
            <el-tooltip :content="row.enable?'开启': '关闭'" placement="top">
              <el-switch
                v-model="row.enable"
                active-color="#55A625"
                inactive-color="#999999"
                :active-value="1"
                :inactive-value="0"
                @change="changeStatus(row.id, row.enable)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" class="text-center" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.limit" @pagination="getListPlace" />
    </div>

    <!--部门类型设置-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="场地类型设置"
      :visible.sync="dialogPlaceTypeVisible"
      :close-on-click-modal="false"
      width="450px"
      center
      @dragDialog="handlePlaceTypeDrag"
    >
      <div ref="placeTypeDiv" style="height: 350px;overflow-y: auto;margin-bottom: 10px">
        <PlaceType />
      </div>
    </el-dialog>
    <!--场地弹窗-->
    <el-dialog v-el-drag-dialog class="place-dialog" width="650px" :modal="false" :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogPlaceVisible" @dragDialog="handlePlaceDrag">
      <el-form ref="placeForm" class="place-form" :rules="placeRules" :model="placeFormData" label-position="left" label-width="95px">
        <el-form-item label="名称" prop="room_name">
          <el-input v-model="placeFormData.room_name" size="mini" />
        </el-form-item>
        <el-form-item label="所属机构" prop="belong_org">
          <el-input v-model="placeFormData.belong_org" size="mini" />
        </el-form-item>
        <el-form-item label="场地类型" prop="room_type_id">
          <el-select v-model="placeFormData.room_type_id" clearable placeholder="请选择场地类型" size="mini">
            <el-option v-for="(item, index) in listPlaceType" :key="index" :label="item.type_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="场地容量" prop="seat">
          <el-input v-model="placeFormData.seat" type="number" size="mini" />
        </el-form-item>
        <el-form-item label="考试容量" prop="exam_seat">
          <el-input v-model="placeFormData.exam_seat" type="number" size="mini" />
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-radio-group v-model="placeFormData.enable">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div ref="placeDiv" slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="savePlaceForm('placeForm')">
          确定
        </el-button>
        <el-button size="small" plain @click="cancelPlaceDialog">
          取消
        </el-button>
      </div>
    </el-dialog>
    <!--导入场地弹窗-->
    <el-dialog
      v-el-drag-dialog
      :modal="false"
      title="导入场地"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      center
      width="450px"
      :before-close="closeUploadDialog"
      @dragDialog="handleUploadDialogDrag"
    >
      <div ref="uploadDiv" class="text-center" style="padding: 50px 0">
        <el-upload
          ref="upload"
          :limit="1"
          class="upload-demo"
          drag
          :action="host + 'batchUploadExam'"
          :headers="headers"
          :before-upload="beforeUploadDocument"
          :on-success="handleUploadFileSuccess"
          :on-error="handleUploadFileError"
          :show-file-list="true"
          :auto-upload="true"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            <div class="mb-10">只能上传excel文件，单个文件上传不得超过5M</div>
            <div>请下载示例文件，按要求格式进行上传 <a :href="host + 'static/importExam.xlsx'">示例文件</a></div>
          </div>
        </el-upload>
      </div>
    </el-dialog>
    <!--场地状态-->
    <el-dialog v-el-drag-dialog class="show-dialog" width="280px" :modal="false" :close-on-click-modal="false" title="变更场地使用状态" :visible.sync="dialogShowVisible" @dragDialog="handleShowDrag">
      <el-form ref="showForm" class="show-form" :model="placeFormData" label-position="left" label-width="85px">
        <el-form-item label="启用状态" prop="isUse" class="fl">
          <el-select v-model="placeFormData.isShow" placeholder="请选择场地启用状态" size="mini">
            <el-option v-for="(item, index) in isShowList" :key="index" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div ref="showDiv" slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="cancelIsShowDialog">
          返回
        </el-button>
        <el-button type="primary" size="small" @click="savePlaceForm('showForm')">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchListPlace, fetchListPlaceType, handlePlaceAdd, handleUnable, handlePlaceDel } from '@/api/organ'
import Header from '@/views/common/header-span'
import waves from '@/directive/waves' // waves directive
import PlaceType from './components/placeType' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'Place',
  components: { Header, Pagination, PlaceType },
  directives: { waves, elDragDialog },
  data() {
    return {
      listQuery: {
        room_name: '',
        room_type_id: ''
      },
      pageQuery: {
        page: 1,
        limit: 10
      },
      listPlaceLoading: false,
      listPlace: [],
      total: 10,
      textMap: {
        add: '新增场地',
        update: '编辑场地'
      },
      dialogStatus: '',
      dialogPlaceVisible: false,
      listPlaceType: [],
      placeData: [],
      placeFormData: {},
      placeRules: {
        room_name: [{ required: true, message: '场地名称必须填写', trigger: 'blur' }],
        belong_org: [{ required: true, message: '所属机构必须填写', trigger: 'blur' }],
        room_type_id: [{ required: true, message: '请选择场地类型', trigger: 'change' }],
        seat: [{ required: true, message: '场地容量必须填写', trigger: 'blur' }],
        exam_seat: [{ required: true, message: '考试场地容量必须填写', trigger: 'blur' }],
        enable: [{ required: true, message: '请选择是否启用', trigger: 'change' }]
      },
      uploadDialogVisible: false,
      dialogShowVisible: false,
      dialogPlaceTypeVisible: false,
      multipleSelection: [] // 多选的选项
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    },
    sexList() {
      return this.$store.getters.sexList
    },
    isShowList() {
      return this.$store.getters.inSchoolList
    },
    host() {
      return window.host
    },
    headers() {
      return {
        // token: this.$store.state.access_token_place
        token: '12313123123123123123'
      }
    }
  },
  created() {
    this.getListPlace()
    this.getPlaceTypeList()
  },
  methods: {
    // 取场地类型列表
    getPlaceTypeList() {
      fetchListPlaceType().then(response => {
        this.listPlaceType = response.data
      })
    },
    // 获取场地列表
    getListPlace() {
      this.listPlaceLoading = true
      fetchListPlace(this.listQuery, this.pageQuery).then(response => {
        this.listPlace = response.data.data
        this.total = response.data.total
        this.listPlaceLoading = false
      }).catch(() => {
        this.listPlaceLoading = false
      })
    },
    resetPlaceForm() {
      this.placeFormData = {
        room_name: '',
        room_type_id: '',
        belong_org: '',
        seat: '',
        exam_seat: '',
        enable: 1
      }
    },
    // 增加场地
    handlePlaceCreate() {
      this.resetPlaceForm()
      this.dialogStatus = 'add'
      this.dialogPlaceVisible = true
      this.$nextTick(() => {
        this.$refs['placeForm'].clearValidate()
      })
    },
    // 场地启停用
    changeStatus(id, enable) {
      handleUnable({ id: id, enable: enable }).then(response => {
        this.$message.success('状态保存成功')
        this.getListPlace()
      })
    },
    // 导入场地
    handlePlaceImport() {
      this.uploadDialogVisible = true
    },
    // 批量删除
    handlePlaceDel() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('确定要删除当前场地吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let tmpString = ''
          for (const i in this.multipleSelection) {
            tmpString += this.multipleSelection[i].id + ','
          }
          tmpString = tmpString.substring(0, tmpString.lastIndexOf(','))
          handlePlaceDel({ id: tmpString }).then((response) => {
            this.$message.success('删除成功')
            this.getListPlace()
          })
        }).catch(() => {
          console.log('cancel')
        })
      } else {
        this.$message({
          message: '请选择要删除的用户',
          type: 'warning',
          duration: 2000
        })
      }
    },
    // 场地类型
    placeTypeSet() {
      this.dialogPlaceTypeVisible = true
    },
    // 场地类型弹窗
    handlePlaceTypeDrag() {
      this.$refs.placeTypeDiv.blur()
    },
    // 表格选项
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    // 更新场地信息
    handleUpdatePlace(row) {
      this.placeFormData = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogPlaceVisible = true
      this.$nextTick(() => {
        this.$refs['placeForm'].clearValidate()
      })
    },
    // 保存场地
    savePlaceForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          handlePlaceAdd(this.placeFormData).then(response => {
            let message = ''
            if (this.placeFormData.id) {
              message = '编辑成功'
            } else {
              message = '新增成功'
            }
            this.$message.success(message)
            this.dialogPlaceVisible = false
            this.getListPlace()
          })
        }
      })
    },
    // 拖拽用户弹窗
    handlePlaceDrag() {
      this.$refs.placeDiv.blur()
    },
    cancelPlaceDialog() {
      // 关闭之前，初始化form
      this.$refs['placeForm'].clearValidate()
      this.dialogPlaceVisible = false
    },
    // 关闭批量上传dialog
    closeUploadDialog() {
      this.uploadDialogVisible = false
    },
    // 上传之前
    beforeUploadDocument(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      // 验证单次文件上传大小 不能超过5M
      if (!isLt5M) {
        this.$message.error('文件大小不得超过5M')
        return false
      }
      // 验证文件类型
      let fileType = file.type
      console.log(fileType)
      if (fileType === '') {
        const fileInfo = file.name.split('.')
        if (fileInfo.length < 2) {
          this.$message.error('不支持的文件格式，请重新选择')
          return false
        }
        fileType = fileInfo[fileInfo.length - 1]
        if (this.allDocumentFileExt.indexOf(fileType) === -1) {
          this.$message.error('不支持的文件格式，请重新选择')
          return false
        }
      } else {
        if (this.allowUploadFileType.indexOf(fileType) === -1) {
          this.$message.error('不支持的文件格式，请重新选择')
          return false
        }
      }
    },
    handleUploadFileSuccess(res, file) {
      if (res.status === 1) {
        this.$message.success('题目批量导入成功')
        this.closeUploadDialog()
        this.getList()
      } else {
        this.$refs.upload.clearFiles()
        this.$message.error(res.info)
      }
    },
    handleUploadFileError() {
      this.$refs.upload.clearFiles()
      this.$message.error('批量导入失败')
    },
    handleUploadDialogDrag() {
      this.$refs.uploadDiv.blur()
    },
    handleShowDrag() {
      this.$refs.ShowDiv.blur()
    },
    cancelIsShowDialog() {
      this.dialogShowVisible = false
    },
    handleUsePlaceDrag() {
      this.$refs.usePlaceDiv.blur()
    }
  }
}
</script>
<style lang="scss" scoped>
  .place {
    .filter-container{
      /*padding: 30px;*/
    }
    .tree-icon-blue{
      color: #84CDED;
      font-weight: bold
    }
    .tree-icon-orange{
      color: #F5CD1D;
      font-weight: bold
    }
    .tree-icon-red{
      color: #F85832;
      font-weight: bold
    }
    .tree-icon-green{
      color: #7CCB40;
    }
    .place-form{
      .place-form-div{
        height: 210px;
        overflow-y: auto;
      }
    }
  }
</style>
