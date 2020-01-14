<template>
  <div class="moduleTikuDetail">
    <!--模块开启信息-->
    <div class="w-100p mb-12">
      <div class="mb-12 f-14">
        <span class="ft-weight-bold mr-20">模块开启信息</span>
        <span class="ml-10">商业方案：</span>
        <el-select v-model="moduleSolution.id" size="mini" placeholder="请选择" @change="selectFunSolution">
          <el-option label="全部" value="" />
          <el-option v-for="item in listFunSolution" :key="item.id" :label="item.solution_name" :value="item.id">{{ item.solution_name }}</el-option>
        </el-select>
        <span class="fr">
          <!--        <el-checkbox v-model="checked">只查看已开启信息</el-checkbox>-->
          <el-button size="small" type="primary" @click="save">保存</el-button>
          <el-button size="small" plain class="btn-plain" @click="goBack">返回</el-button>
        </span>
      </div>
      <el-table
        v-loading="listModuleLoading"
        size="mini"
        :data="listModule"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="模块名称" width="" prop="module_name" align="center" />
        <el-table-column label="启用状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-checkbox v-model="row.state" :true-label="1" :false-label="0" @change="changeFunState(row.state, row.module_id)">开启</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="开始日期" align="center">
          <template slot-scope="{row}">
            <el-date-picker
              v-model="row.start_at"
              style="width: 150px"
              value-format="yyyy-MM-dd"
              align="right"
              type="date"
              size="mini"
              placeholder="选择开始日期"
            />
          </template>
        </el-table-column>
        <el-table-column label="开启日期" width="" align="center">
          <template slot-scope="{row}">
            <el-select v-model="row.year" size="mini" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in openTime" :key="index" :label="item.value" :value="item.key" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="结束日期" width="" align="center">
          <template slot-scope="{row}">
            {{ calculate(row.start_at, row.year) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--题库开启信息-->
    <div class="w-100p mb-12">
      <div class="mb-12 f-14">
        <span class="ft-weight-bold mr-20">题库开启信息</span>
        <span class="ml-10">商业方案：</span>
        <el-select v-model="tiKuSolution.id" size="mini" placeholder="请选择" @change="selectTiKuSolution">
          <el-option label="全部" value="" />
          <el-option v-for="item in listTiKuSolution" :key="item.id" :label="item.solution_name" :value="item.id">{{ item.solution_name }}</el-option>
        </el-select>
      </div>
      <el-table
        v-loading="listTikuLoading"
        size="mini"
        :data="listTiku"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="模块名称" width="" prop="module_name" align="center" />
        <el-table-column label="启用状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-checkbox v-model="row.state" :true-label="1" :false-label="0" @change="changeTkState(row.state, row.module_id)">开启</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="开始日期" align="center">
          <template slot-scope="{row}">
            <el-date-picker
              v-model="row.start_at"
              style="width: 150px"
              value-format="yyyy-MM-dd"
              align="right"
              type="date"
              size="mini"
              placeholder="选择开始日期"
            />
          </template>
        </el-table-column>
        <el-table-column label="开启日期" width="" align="center">
          <template slot-scope="{row}">
            <el-select v-model="row.year" size="mini" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in openTime" :key="index" :label="item.value" :value="item.key" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="结束日期" width="" align="center">
          <template slot-scope="{row}">
            {{ calculate(row.start_at, row.year) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--实景实训开启信息-->
    <div class="w-100p">
      <div class="f-14 mb-12">
        <span class="ft-weight-bold mr-20">实景实训开启信息</span>
      </div>
      <el-table
        v-loading="listPracticalTrainLoading"
        size="mini"
        :data="listPracticalTrain"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="模块名称" width="" prop="module_name" align="center" />
        <el-table-column label="启用状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-checkbox v-model="row.state" :true-label="1" :false-label="0" @change="changeSystemState(row.state, row.module_id)">开启</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="开始日期" align="center">
          <template slot-scope="{row}">
            <el-date-picker
              v-model="row.start_at"
              style="width: 150px"
              value-format="yyyy-MM-dd"
              align="right"
              type="date"
              size="mini"
              placeholder="选择开始日期"
            />
          </template>
        </el-table-column>
        <el-table-column label="开启日期" width="" align="center">
          <template slot-scope="{row}">
            <el-select v-model="row.year" size="mini" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in openTime" :key="index" :label="item.value" :value="item.key" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="结束日期" width="" align="center">
          <template slot-scope="{row}">
            {{ calculate(row.start_at, row.year) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { handleOneSolution, fetchListFunModule, fetchListShiXunModule, fetchFunSolution, fetchTiKuSolution, fetchListTiKuModule, handleAddOrder, handleGetOrgOrder } from '@/api/organ'

export default {
  name: 'ModuleTikuDetail',
  data() {
    return {
      checked: false,
      module: {
        id: ''
      },
      listModuleLoading: false,
      listModule: [],
      listModuleForm: [],
      listTikuLoading: false,
      listTiku: [],
      listTikuQuery: {
        plan: ''
      },
      listPracticalTrainLoading: false,
      listPracticalTrain: [],
      listPracticalTrainQuery: {
        plan: ''
      },
      listSolution: [],
      listFunSolution: [],
      listTiKuSolution: [],
      haveOrders: [],
      moduleSolution: {
        id: ''
      },
      tiKuSolution: {
        id: ''
      },
      moduleSolutionLoading: false
    }
  },
  computed: {
    // 期限
    openTime() {
      return this.$store.getters.openTime
    }
  },
  created() {
    this.getModuleSolution()
    this.getTiKuSolution()
    this.getOrgOrder()
  },
  methods: {
    calculate(dataStr, num) {
      let numInt = 0
      let resultStr = ''
      if (dataStr) {
        if (num) {
          numInt = num
        }
        resultStr = (parseInt(dataStr.slice(0, 4)) + numInt) + dataStr.slice(4, dataStr.length)
      }
      return resultStr
    },
    // 获取企业已有订单
    getOrgOrder() {
      const id = this.$route.params.id
      handleGetOrgOrder({ id: id }).then(response => {
        this.haveOrders = response.msg
        this.getModuleList()
        this.getTikuList()
        this.getPracticalTrainList()
      })
    },
    // 功能模块
    getModuleSolution() {
      fetchFunSolution().then(response => {
        this.listFunSolution = response.data
      })
    },
    // 题库模块
    getTiKuSolution() {
      fetchTiKuSolution().then(response => {
        this.listTiKuSolution = response.data
      })
    },
    selectFunSolution() {
      if (this.moduleSolution.id) {
        this.moduleSolutionLoading = true
        handleOneSolution({ id: this.moduleSolution.id }).then(response => {
          this.listModule = []
          if (response.data.module && response.data.module.length > 0) {
            response.data.module.forEach(v => {
              this.listModule.push({ module_id: v.id, module_name: v.module_name, state: 0, start_at: '', year: '' })
            })
            this.listModule.forEach((v, i) => {
              if (this.haveOrders['func'].length > 0) {
                this.haveOrders['func'].forEach(value => {
                  if (value.module_id === v.module_id) {
                    v.state = value.state
                    v.start_at = value.start_at
                    v.year = value.year
                  }
                })
              }
            })
            this.moduleSolutionLoading = false
          }
        })
      } else {
        this.listModule = []
        this.getModuleList()
      }
    },
    // 题库模块
    selectTiKuSolution() {
      if (this.tiKuSolution.id) {
        this.listTikuLoading = true
        handleOneSolution({ id: this.tiKuSolution.id }).then(response => {
          this.listTiku = []
          if (response.data.module && response.data.module.length > 0) {
            response.data.module.forEach(v => {
              this.listTiku.push({ module_id: v.id, module_name: v.module_name, state: 0, start_at: '', year: '' })
            })
            this.listTiku.forEach((v, i) => {
              if (this.haveOrders['tk'].length > 0) {
                this.haveOrders['tk'].forEach(value => {
                  if (value.module_id === v.module_id) {
                    v.state = value.state
                    v.start_at = value.start_at
                    v.year = value.year
                  }
                })
              }
            })
            this.listTikuLoading = false
          }
        })
      } else {
        this.listTiku = []
        this.getTikuList()
      }
    },
    // 功能模块列表
    getModuleList() {
      this.listModuleLoading = true
      fetchListFunModule().then(response => {
        if (response.data && response.data.length > 0) {
          response.data.forEach(v => {
            this.listModule.push({ module_id: v.id, module_name: v.module_name, state: 0, start_at: '', year: '' })
          })
          this.listModule.forEach((v, i) => {
            if (this.haveOrders['func'] && this.haveOrders['func'].length > 0) {
              this.haveOrders['func'].forEach(value => {
                if (value.module_id === v.module_id) {
                  v.state = value.state
                  v.start_at = value.start_at
                  v.year = value.year
                }
              })
            }
          })
        }
        this.listModuleLoading = false
      })
    },
    // 题库模块
    getTikuList() {
      this.listTikuLoading = true
      fetchListTiKuModule().then(response => {
        if (response.data && response.data.length > 0) {
          response.data.forEach(v => {
            this.listTiku.push({ module_id: v.id, module_name: v.module_name, state: 0, start_at: '', year: '' })
          })
          this.listTiku.forEach((v, i) => {
            if (this.haveOrders['tk'] && this.haveOrders['tk'].length > 0) {
              this.haveOrders['tk'].forEach(value => {
                if (value.module_id === v.module_id) {
                  v.state = value.state
                  v.start_at = value.start_at
                  v.year = value.year
                }
              })
            }
          })
        }
        this.listTikuLoading = false
      })
    },
    // 实景实训模块
    getPracticalTrainList() {
      this.listPracticalTrainLoading = true
      fetchListShiXunModule().then(response => {
        for (var i in response.data) {
          this.listPracticalTrain.push({ module_id: i, module_name: response.data[i], state: 0, start_at: '', year: '' })
        }
        this.listPracticalTrain.forEach((v, i) => {
          if (this.haveOrders['system'] && this.haveOrders['system'].length > 0) {
            this.haveOrders['system'].forEach(value => {
              if (parseInt(value.module_id) === parseInt(v.module_id)) {
                v.state = value.state
                v.start_at = value.start_at
                v.year = value.year
              }
            })
          }
        })
        this.listPracticalTrainLoading = false
      })
    },
    changeFunState(state, module_id) {
      if (!state) {
        this.listModule.forEach((v) => {
          if (v.module_id === module_id) {
            v.start_at = ''
            v.year = ''
          }
        })
      }
    },
    changeTkState(state, module_id) {
      if (!state) {
        console.log(module_id)
        this.listTiku.forEach((v) => {
          if (v.module_id === module_id) {
            v.start_at = ''
            v.year = ''
          }
        })
      }
    },
    changeSystemState(state, module_id) {
      if (!state) {
        this.listPracticalTrain.forEach((v) => {
          if (v.module_id === module_id) {
            v.start_at = ''
            v.year = ''
          }
        })
      }
    },
    // 保存
    save() {
      const module = []
      const tk = []
      const system = []
      this.listModule.forEach(v => {
        if (v.state) {
          module.push({ module_id: v.module_id, state: v.state, start_at: v.start_at, year: v.year })
        }
      })
      this.listTiku.forEach(v => {
        if (v.state) {
          tk.push({ module_id: v.module_id, state: v.state, start_at: v.start_at, year: v.year })
        }
      })
      this.listPracticalTrain.forEach(v => {
        if (v.state) {
          system.push({ module_id: v.module_id, state: v.state, start_at: v.start_at, year: v.year })
        }
      })
      handleAddOrder({ org_id: this.$route.params.id, module: module, tk: tk, system: system }).then(response => {
        this.$message.success('保存成功')
      })
    },
    goBack() {
      this.$router.push('/organ/account')
    }
  }
}
</script>

<style lang="scss" scoped>
  .moduleTikuDetail {
    .header{
      height: 50px;
      line-height: 50px;
      border-bottom: solid 1px #dcdfe6;
      /*padding-right: 30px;*/
    }
  }
</style>
