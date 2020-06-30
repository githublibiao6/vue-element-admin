<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-input
          v-model="filterText"
          placeholder="输入关键字进行过滤"
        />

        <el-tree
          ref="tree"
          class="filter-tree"
          :data="treeList"
          :props="defaultProps"
          highlight-current
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="nodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => edit(node, data)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
            新增字典
          </el-button>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="success" icon="el-icon-circle-plus-outline" @click="teamCreate">
            新增字典项
          </el-button>
        </div>
        <!-- default-expand-all -->
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          row-key="menuId"
          border
          stripe
          fit
          lazy
          highlight-current-row
          :load="load"
          style="width: 100%;"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <!-- @sort-change="sortChange" -->
          <el-table-column type="index" width="90" label="序号" />
          <el-table-column label="字典项" prop="id" align="center" width="220px" :class-name="getSortClass('id')">
            <template slot-scope="{row}">
              <span>{{ row.dicValue }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字典值" align="center">
            <template slot-scope="{row}">
              <span>{{ row.dicText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" align="center">
            <template slot-scope="{row}">
              <span>{{ row.comments }}</span>
            </template>
          </el-table-column>
          <el-table-column label="显示顺序" width="140px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="180px" align="center">
            <template slot-scope="{row}">
              <!-- <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" width="180px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.modifyTime }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="showReviewer" :label="$t('table.reviewer')" width="110px" align="center">
            <template slot-scope="{row}">
              <span style="color:red;">{{ row.reviewer }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240px" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini" @click="handleTeamUpdate(row)">
                编辑
              </el-button>
              <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      </el-col>
    </el-row>
    <!-- 弹出框  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="字典描述">
          <el-input v-model="temp.comments" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createDictionary():updateDictionary()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogTeamStatus]" :visible.sync="dialogTeamVisible">
      <el-form ref="teamForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="所属字典" prop="name">
          <el-input v-model="temp.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="字典项" prop="dic_value">
          <el-input v-model="teamTemp.dicValue" />
        </el-form-item>
        <el-form-item label="字典值" prop="dic_text">
          <el-input v-model="teamTemp.dicText" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="teamTemp.sort" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="teamTemp.comments" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTeamVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogTeamStatus==='create'?createTeam():updateTeam()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchDicList, createDictionary, createTeam, updateDictionary, updateTeam, removeDictionary, removeTeam } from '@/api/system/dictionary'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const menuTypeOptions = [
  { key: '1', display_name: '菜单' },
  { key: '2', display_name: '按钮' },
  { key: '3', display_name: '其他' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = menuTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 上面是树形
      dic_id: null,
      list: null,
      treeList: null,
      tableKey: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      menuTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: ''
      },
      teamTemp: {
        id: undefined
      },
      dialogFormVisible: false,
      dialogTeamVisible: false,
      dialogStatus: '',
      dialogTeamStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  // 页面初始化
  created() {
    this.getList()
    this.getTreeList()
  },
  methods: {
    load(tree, treeNode, resolve) {
      // resolve([])
      resolve(tree.children)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick(data, node, e) {
      if (node.level !== 1) {
        this.dic_id = data.id
        this.listQuery.dic_id = this.dic_id
        this.temp.name = data.label
        this.getList()
      } else {
        this.dic_id = null
      }
    },
    // 字典编辑
    edit(node, data) {
      // this.temp = Object.assign({}, data) // copy obj
      this.temp = Object.assign({}, data)
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 字典删除
    remove(node, data) {
      this.$confirm('确认删除字典？', '提示', {
        /* 是否区分取消和关闭 */
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        removeDictionary(data).then((res) => {
          // this.list.unshift(this.temp)
          // this.dialogFormVisible = false
          var type = 'success'
          var msg = '操作成功'
          if (!res.success) {
            type = 'error'
            msg = '操作失败'
          } else {
            this.getTreeList()
          }
          this.$notify({
            title: msg,
            message: res.message,
            type: type,
            duration: 2000,
            showClose: false
          })
        })
      })
    },
    // 字典项查询
    getList() {
      this.listLoading = true
      fetchDicList(this.listQuery).then(response => {
        if (response.data != null) {
          this.list = response.data.items
          this.total = response.data.total
        }
        this.listLoading = false
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    // 字典树
    getTreeList() {
      fetchList().then(response => {
        this.treeList = response.data
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: ''
      }
    },
    resetTeamTemp() {
      this.temp = {
        id: undefined,
        dicValue: '',
        dicText: '',
        comments: ''
      }
    },
    showMsg() {
      this.$message('请选择一个字典')
    },
    // 弹出新增字典
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 弹出新增字典项
    teamCreate() {
      if (this.dic_id == null) {
        this.showMsg()
      } else {
        // this.resetTemp()
        this.dialogTeamStatus = 'create'
        this.dialogTeamVisible = true
        this.$nextTick(() => {
          this.$refs['teamForm'].clearValidate()
        })
      }
    },
    // 新增字典
    createDictionary() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createDictionary(this.temp).then((res) => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            var type = 'success'
            var msg = '操作成功'
            if (!res.success) {
              type = 'error'
              msg = '操作失败'
            } else {
              this.getTreeList()
            }
            this.$notify({
              title: msg,
              message: res.message,
              type: type,
              duration: 2000,
              showClose: false
            })
          })
        }
      })
    },
    // 新增字典项
    createTeam() {
      this.$refs['teamForm'].validate((valid) => {
        if (valid) {
          // mock a id
          // this.temp.id = parseInt(Math.random() * 100) + 1024
          // this.temp.author = 'vue-element-admin'
          this.resetTeamTemp()
          this.teamTemp.dic_id = this.dic_id
          createTeam(this.teamTemp).then((res) => {
            // this.list.unshift(this.temp)
            this.dialogTeamVisible = false
            var type = 'success'
            var msg = '操作成功'
            if (!res.success) {
              type = 'error'
              msg = '操作失败'
            } else {
              this.getList()
            }
            this.$notify({
              title: msg,
              message: res.message,
              type: type,
              duration: 2000,
              showClose: false
            })
          })
        }
      })
    },
    // 更新字典
    updateDictionary() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateDictionary(tempData).then((res) => {
            this.dialogFormVisible = false
            if (res.success) {
              this.$notify({
                title: '成功',
                message: res.message,
                type: 'success',
                duration: 2000
              })
              this.getTreeList()
            } else {
              this.$notify({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    //  更新字典项
    updateTeam() {
      this.$refs['teamForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.teamTemp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateTeam(tempData).then((res) => {
            this.dialogTeamVisible = false
            if (res.success) {
              this.$notify({
                title: '成功',
                message: res.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleTeamUpdate(row) {
      this.teamTemp = Object.assign({}, row) // copy obj
      this.teamTemp.timestamp = new Date(this.teamTemp.timestamp)
      this.dialogTeamStatus = 'update'
      this.dialogTeamVisible = true
      this.$nextTick(() => {
        this.$refs['teamForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$confirm('确认删除？', '提示', {
        distinguishCancelAndClose: true, /* 是否区分取消和关闭 */
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => { // 这里加个 async，可以查下相关文档 async...await
        removeTeam({ id: row.id }).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      }).catch(action => {
        this.$message({
          type: 'info',
          message: action === 'cancel'
            ? '取消删除'
            : '取消操作'
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['menuId', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 25px;
  }
</style>
