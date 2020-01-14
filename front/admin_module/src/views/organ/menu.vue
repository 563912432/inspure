<template>
  <div class="orgMenu">
    <Header :title="title" />
    <div class="mb-12 h-30 text-right">
      <el-button size="mini" type="primary" @click="handleMenuCreate">添加菜单</el-button>
    </div>
    <div class="bg-white box-shadow">
      <!--table-->
      <el-table
        v-loading="listMenuLoading"
        size="mini"
        :data="listMenu"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="菜单名称" width="" prop="menu_title" align="center" />
        <el-table-column label="菜单路由地址" width="" prop="path" align="center" />
        <el-table-column label="菜单权限" width="" prop="auth" align="center" />
        <!--        <el-table-column label="菜单图标" width="120" prop="icon" align="center" />-->
        <!--        <el-table-column label="pid" width="80" prop="pid" align="center" />-->
        <!--        <el-table-column label="显示顺序" width="80" prop="sort" align="center" />-->
        <!--        <el-table-column label="是否是左侧菜单" width="" prop="show" align="center">-->
        <!--          <template slot-scope="{row}">-->
        <!--            &lt;!&ndash; :active-value绑定的是整数 &ndash;&gt;-->
        <!--            <el-switch-->
        <!--              v-model="row.show"-->
        <!--              disabled-->
        <!--              :active-value="1"-->
        <!--              :inactive-value="0"-->
        <!--            />-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="操作" width="" align="center">
          <template slot-scope="{row}">
            <el-button type="text" class="text-blue" size="mini" @click="handleUpdateMenu(row)">
              编辑
            </el-button>
            <el-button type="text" class="text-blue" size="mini" @click="handleDeleteMenu(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" class="text-center" :page.sync="pageQuery.page" :limit.sync="pageQuery.page_size" @pagination="getListMenu" />
    </div>

    <!--菜单弹窗-->
    <el-dialog v-el-drag-dialog class="menu-dialog" width="650px" :modal="false" :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogMenuVisible" :before-close="cancelMenuDialog" @dragDialog="handleMenuDrag">
      <el-form ref="menuForm" class="menu-form" :rules="menuRules" :model="menuFormData" label-position="left" label-width="120px">
        <el-form-item label="菜单名称" prop="menu_title">
          <el-input v-model="menuFormData.menu_title" clearable size="mini" class="" />
        </el-form-item>
        <el-form-item label="菜单路由地址" prop="path">
          <el-input v-model="menuFormData.path" clearable size="mini" class="" />
        </el-form-item>
        <el-form-item label="菜单权限地址" prop="auth">
          <el-input v-model="menuFormData.auth" clearable size="mini" class="" />
        </el-form-item>
        <!--        <el-form-item label="菜单图标" prop="icon">-->
        <!--          <el-input v-model="menuFormData.icon" clearable size="mini" class="" />-->
        <!--        </el-form-item>-->
        <el-form-item label="pid" prop="pid">
          <el-select v-model="menuFormData.pid" clearable placeholder="请选择上级菜单" size="mini" class="">
            <el-option label="顶层菜单" :value="0" />
            <el-option v-for="(item, index) in listMenu" :key="index" :label="item.menu_title" :value="item.id" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="显示顺序" prop="sort">-->
        <!--          <el-input v-model="menuFormData.sort" clearable size="mini" class="" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="是否是左侧菜单" prop="show">-->
        <!--          <el-switch-->
        <!--            v-model="menuFormData.show"-->
        <!--            active-color="#13ce66"-->
        <!--            inactive-color="#ff4949"-->
        <!--            :active-value="1"-->
        <!--            :inactive-value="0"-->
        <!--          />-->
        <!--        </el-form-item>-->
      </el-form>
      <div ref="menuDiv" slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveMenuForm('menuForm')">
          保存
        </el-button>
        <el-button size="mini" plain @click="cancelMenuDialog">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchListMenu, handleMenuAdd, handleMenuDel } from '@/api/organ'
import Header from '@/views/common/header'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'OrgMenu',
  components: { Header, Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      pageQuery: {
        page: 1,
        page_size: 10
      },
      listMenuLoading: false,
      listMenu: null,
      total: 0,
      textMap: {
        add: '新增菜单',
        update: '编辑菜单'
      },
      dialogStatus: '',
      dialogMenuVisible: false,
      menuFormData: {
        menu_title: '',
        auth: '',
        path: '',
        pid: 0,
        show: 1,
        sort: 0
      },
      menuRules: {
        menu_title: [{ required: true, message: '菜单名称必须填写', trigger: 'blur' }],
        pid: [{ required: true, message: '请选择上级菜单', trigger: 'change' }]
      },
      menuList: []
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  created() {
    this.getListMenu()
  },
  methods: {
    // 获取菜单数据
    getListMenu() {
      this.listMenuLoading = true
      fetchListMenu(this.pageQuery).then(response => {
        this.listMenu = response.data.data
        this.total = response.data.total
        this.listMenuLoading = false
      })
    },
    // 查询事件
    handleFilter() {},
    // 增加菜单
    handleMenuCreate() {
      this.menuFormData = {
        menu_title: '',
        auth: '',
        path: '',
        pid: 0,
        show: 1,
        sort: 0
      }
      this.dialogStatus = 'add'
      this.dialogMenuVisible = true
    },
    // 更新菜单信息
    handleUpdateMenu(row) {
      this.menuFormData = Object.assign({}, row) // copy obj
      // todo 根据type类型渲染不同的dom
      this.dialogStatus = 'update'
      this.dialogMenuVisible = true
      this.$nextTick(() => {
        this.$refs['menuForm'].clearValidate()
      })
    },
    // 删除菜单
    handleDeleteMenu(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleMenuDel({ id: id }).then(response => {
          this.$message.success('删除成功')
          this.getListMenu()
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    // 保存菜单
    saveMenuForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          handleMenuAdd(this.menuFormData).then(response => {
            if (this.menuFormData.id) {
              this.$message.success('编辑成功')
            } else {
              this.$message.success('新增成功')
            }
            this.dialogMenuVisible = false
            this.getListMenu()
          })
        }
      })
    },
    // 拖拽用户弹窗
    handleMenuDrag() {
      this.$refs.menuDiv.blur()
    },
    cancelMenuDialog() {
      // 关闭之前，初始化form
      this.$refs['menuForm'].clearValidate()
      this.dialogMenuVisible = false
    },
    resetMenuForm() {
      this.menuFormData = {}
    }
  }
}
</script>
<style>
  .menu-dialog .el-form-item {
    margin-bottom: 15px;
  }
</style>
<style lang="scss" scoped>
  .orgMenu {
    .filter-container{
      padding: 10px 30px;
    }
    .branch-set-div{
      width: 225px;
      height: 435px;
      overflow-y: auto;
      border: solid 1px #dcdfe6;
      margin-right: 20px;
      padding-bottom: 20px;
      .branch-set-title{
        background-color: #F5F7FA;
        border-bottom: solid 1px #dcdfe6;
        padding: 8px 10px;
        font-size: 13px;
      }
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        padding-top: 5px;
      }
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
    .menu-form{
      .menu-form-div{
        height: 210px;
        overflow-y: auto;
      }
    }
  }
</style>
