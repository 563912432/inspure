<template>
  <div class="certificate">
    <div class="filter-container">
      <Header :title="title" class="fl mr-20" />
      <el-input v-model="listQuery.title" size="mini" clearable placeholder="请输入证书名称" class="w-190">
        <el-button slot="append" icon="el-icon-search" @click="getCertList" />
      </el-input>
      <el-input v-model="listQuery.category" size="mini" clearable placeholder="请输入证书类型" class="w-190">
        <el-button slot="append" icon="el-icon-search" @click="getCertList" />
      </el-input>
    </div>
    <div class="mb-12">
      <el-button size="mini" plain icon="el-icon-setting" @click="dialogProveTypeVisible = !dialogProveTypeVisible">
        证书类型设置
      </el-button>
      <span class="fr">
        <el-button size="mini" type="primary" @click="addProve">
          增加证书
        </el-button>
        <el-button size="mini" plain @click="batchProveDel">
          批量删除
        </el-button>
        <el-button size="mini" plain @click="batchEnable">
          批量启用
        </el-button>
      </span>
    </div>
    <div class="con-table">
      <el-table
        v-loading="listLoading"
        size="mini"
        :data="proveData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="35" align="center" />
        <el-table-column prop="title" label="证书名称" />
        <el-table-column prop="category" label="证书类型" width="">
          <template slot-scope="scope">
            {{ scope.row.category.category_title }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="lookTemplate">查看证书模板</el-button>
            <el-button type="text" size="mini" @click="editProve(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="proveDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="启用状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enable"
              :active-value="1"
              :inactive-value="0"
              @change="saveEnable(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <Pagination :total="total" class="text-center" :page-sizes="[10, 20, 35, 50]" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getCertList" />
    </div>
    <!--证书类型设置-->
    <div class="certificate-dialog">
      <el-dialog v-el-drag-dialog :visible.sync="dialogProveTypeVisible" :close-on-click-modal="false" :modal="false" title="证书类型设置" width="500px" @dragDialog="handleDrag">
        <div ref="top">
          <div class="industryType">
            <div style="height: 350px;overflow-y: auto">
              <el-table
                v-loading="listProveTypeLoading"
                class="mb-10"
                size="mini"
                :data="listProveType"
                border
                fit
                highlight-current-row
                style="width: 100%;"
              >
                <el-table-column label="编号" type="index" width="80" align="center" />
                <el-table-column label="证书类型" prop="category_title" width="" align="center">
                  <template slot-scope="{row}">
                    <template v-if="row.edit">
                      <el-input v-model="row.category_title" size="mini" />
                    </template>
                    <span v-else>{{ row.category_title }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                  <template slot-scope="{ row }">
                    <el-button v-if="row.edit" type="text" size="mini" @click="saveEdit(row)">保存</el-button>
                    <el-button v-if="row.edit" type="text" size="mini" @click="row.edit = false">取消</el-button>
                    <el-button v-else type="text" size="mini" @click="row.edit = true">编辑</el-button>
                    <el-button type="text" size="mini" @click="industryTypeDel(row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--证书模板查看-->
    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogLookTemplateVisible"
      :close-on-click-modal="false"
      :modal="false"
      title="查看证书"
      width="800px"
      @dragDialog="lookTemplatehandleDrag"
    >
      <div ref="lookTemplateTop">
        <LookTemplate />
      </div>
    </el-dialog>
    <!--证书新增-->
    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogAddProveVisible"
      :close-on-click-modal="false"
      :modal="false"
      :title="proveTitle"
      width="700px"
      @dragDialog="addProveHandleDrag"
    >
      <div ref="proveId">
        <AddProve ref="child" @fatherMethod="getCertList" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from '@/views/common/header-span'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import LookTemplate from './components/lookTemplate'
import AddProve from './components/addProve'
import { getCertCategoryList, certCategoryAdd, certCategoryDel, certList, certDel, certEnable } from '@/api/game'

export default {
  name: 'Certificate',
  components: { Header, Pagination, LookTemplate, AddProve },
  directives: { elDragDialog },
  data() {
    return {
      listLoading: false,
      listQuery: {
        title: '', // 证书名称
        category: '' // 证书类型
      },
      proveData: [],
      // 分页控件数据
      total: 0, // 分页总条数
      pageQuery: {
        page: 1,
        page_size: 10
      },
      dialogProveTypeVisible: false,
      listProveTypeLoading: false,
      dialogLookTemplateVisible: false, // 查看证书模板
      dialogAddProveVisible: false, // 证书新增
      listProveType: [],
      multipleSelection: [], // 列表批量勾选项
      proveTitle: '' // 证书新增/编辑
    }
  },
  computed: {
    title() {
      return '证书管理'
    }
  },
  created() {
    this.getIndustryTypeList() // 证书类型弹窗内初始化
    this.getCertList() // 获取证书分页列表
  },
  methods: {
    // 获取证书分页列表
    getCertList() {
      this.listLoading = true

      certList(this.listQuery, this.pageQuery).then(res => {
        this.proveData = res.data.data
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 证书删除
    proveDel(row) {
      this.$confirm('确定要删除当前的行业类型吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        certDel({ id: row.id }).then(res => {
          this.$message.success('删除成功')
          this.getCertList()
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    // 证书编辑
    editProve(row) {
      this.proveTitle = '证书编辑'
      this.dialogAddProveVisible = true
      setTimeout(() => {
        this.$refs.child.proveid = row.id // 这句很重要
      })
    },
    // 批量删除
    batchProveDel() {
      this.$confirm('确定要删除当前的行业类型吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        certDel({ id: this.multipleSelection }).then(res => {
          this.$message.success('删除成功')
          this.getCertList()
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    // 批量启用
    batchEnable() {
      var data = {}
      data['id'] = this.multipleSelection.toString()
      data['enable'] = 1
      certEnable(data).then(res => {
        this.$message.success('操作成功')
        this.getCertList()
      })
    },
    // 弹窗拖拽
    handleDrag() {
      this.$refs.top.blur()
    },
    // 证书模板查看拖拽
    lookTemplatehandleDrag() {
      this.$refs.lookTemplateTop.blur()
    },
    // 证书新增弹窗
    addProveHandleDrag() {
      this.$refs.proveId.blur()
    },
    // 证书类型弹窗内-保存
    saveEdit(row) {
      if (row.provetype === '') {
        this.$message.warning('请填写行业内容')
      } else {
        var data = {}
        if (row.id === undefined || row.id === null) {
          // 新增
          data = { category_title: row.category_title }
          certCategoryAdd(data).then(response => {
            setTimeout(() => {
              this.getIndustryTypeList()
              this.$message.success('新增成功')
            })
          })
        } else {
          // 编辑
          data = { id: row.id, category_title: row.category_title }
          certCategoryAdd(data).then(response => {
            setTimeout(() => {
              this.getIndustryTypeList()
              this.$message.success('修改成功')
            })
          })
        }
      }
    },
    // 证书类型弹窗内初始化
    getIndustryTypeList() {
      // 调取接口获取证书类型
      getCertCategoryList().then(response => {
        this.listProveType = response.data
        // 增加编辑行
        this.listIndustryType = this.listProveType
        // 添个字段判断是否处于编辑的状态中
        this.listIndustryType.map(v => {
          this.$set(v, 'edit', false)
          return v
        })
        this.listIndustryType.push({
          category_title: '',
          edit: true
        })
        this.listIndustryTypeLoading = false
      })
    },
    // 删除证书类型
    industryTypeDel(id) {
      if (id !== undefined) {
        this.$confirm('确定要删除当前的行业类型吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          certCategoryDel({ id: [id] }).then(response => {
            this.$message.success('删除成功')
            this.getIndustryTypeList()
          })
        }).catch(() => {
          console.log('cancel')
        })
      }
    },
    // 新增证书
    addProve() {
      this.proveTitle = '证书新增'
      this.dialogAddProveVisible = true
      setTimeout(() => {
        this.$refs.child.proveid = '' // 这句很重要
      })
    },
    // 查看证书模板
    lookTemplate() {
      this.dialogLookTemplateVisible = true
      console.log(' 查看证书模板')
    },
    // 证书启用状态变更
    saveEnable(row) {
      var data = {}
      data['id'] = row.id
      data['enable'] = row.enable
      certEnable(data).then(res => {
        this.$message.success('操作成功')
      })
    },
    // 表格勾选事件
    handleSelectionChange(val) {
      var attr = []
      for (var i = 0; i < val.length; i++) {
        attr.push(val[i].id)
      }
      this.multipleSelection = attr
    }
  }
}
</script>

<style>
  .certificate .el-table .cell{
    text-align: center;
  }
  .certificate .el-table--border th:first-child .cell,
  .certificate .el-table--border td:first-child .cell {
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
  }
  /*.certificate .el-dialog__body{*/
    /*padding: 7px;*/
  /*}*/
</style>
<style scoped>
  .certificate{
    width: 100%;
    height: 100%;
    font-size: 13px;
  }
</style>
