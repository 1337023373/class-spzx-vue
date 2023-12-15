<template>
  <div>
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>
    <!--添加框-->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <el-form label-width="120px">
        <el-form-item label="菜单标题">
          <el-input v-model="sysMenu.title" />
        </el-form-item>
        <el-form-item label="路由名称">
          <el-input v-model="sysMenu.component" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="sysMenu.sortValue" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="sysMenu.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveOrUpdate">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column prop="title" label="菜单标题" />
      <el-table-column prop="component" label="路由名称" />
      <el-table-column prop="sortValue" label="排序" />
      <el-table-column prop="status" label="状态" #default="scope">
        {{ scope.row.status == 1 ? '正常' : '停用' }}
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="success" size="small" @click="addSonShow(scope.row)">
          添加下级节点
        </el-button>
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          修改
        </el-button>
        <el-button type="danger" size="small" @click="remove(scope.row.id)">
          删除
        </el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  addSysMenu,
  getSysMenu,
  RemoveSysMenuById,
  updateSysMenu,
} from '@/api/sysMenu'
import { ElMessage, ElMessageBox } from 'element-plus'
import edit from '@/views/test/Edit.vue'

// 定义表格数据模型
const list = ref([])

// 页面加载触发钩子函数
onMounted(() => {
  fetchData()
})

// 发送axios请求,拿到数据
const fetchData = async () => {
  const { code, data } = await getSysMenu()
  if (code == 200) {
    list.value = data
  }
}

// 动态展示数据
const dialogVisible = ref(false)
const dialogTitle = ref('添加')

// 点击添加
const addShow = () => {
  dialogVisible.value = true
  dialogTitle.value = '添加'
  // 注意这里的 parentId: 0,不能删除,因为添加和添加子节点公用的是一个,通过这个id进行判断的
  sysMenu.value = {
    parentId: 0,
    sortValue: 1,
    status: 1,
  }
}

// 设置添加框中的数据绑定
const sysMenu = ref({
  id: '',
  parentId: 0,
  title: '',
  url: '',
  component: '',
  icon: '',
  sortValue: 1,
  status: 1,
})

// 点击提交,通过是否有id来判断是添加还是更改
const saveOrUpdate = () => {
  if (sysMenu.value.id) {
    update()
  } else {
    add()
  }
}

//添加菜单
const add = async () => {
  const { code, message } = await addSysMenu(sysMenu.value)
  if (code == 200) {
    ElMessage.success('添加成功')
    dialogVisible.value = false
    fetchData()
  }
}

// 点击修改
const editShow = row => {
  dialogVisible.value = true
  sysMenu.value = row
  dialogTitle.value = '更新'
}
// 更新菜单
const update = async () => {
  const { code, message } = await updateSysMenu(sysMenu.value)
  if (code == 200) {
    ElMessage.success('添加成功')
    dialogVisible.value = false
    fetchData()
  }
}

// 添加子节点
const addSonShow = row => {
  sysMenu.value = {}
  dialogVisible.value = true
  if (!row.id) {
    dialogTitle.value = '添加'
  } else {
    dialogTitle.value = '添加下级节点'
    sysMenu.value.parentId = row.id
  }
}

// 删除
const remove = async id => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { code, message } = await RemoveSysMenuById(id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      } else {
        ElMessage.error(message)
      }
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
