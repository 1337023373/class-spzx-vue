<template>
  <div class="search-div">
    <!-- 搜索表单 -->
    <el-form label-width="70px" size="small">
      <el-form-item label="角色名称">
        <el-input
          v-model="queryDto.roleName"
          style="width: 100%"
          placeholder="角色名称"
        ></el-input>
      </el-form-item>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="searchSysRole">
          搜索
        </el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </el-row>
    </el-form>

    <!-- 添加按钮 -->
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>
    <!-- 添加角色表单对话框 -->
    <el-dialog v-model="dialogVisible" title="添加或修改角色" width="30%">
      <el-form label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole1.roleName" />
        </el-form-item>
        <el-form-item label="角色Code">
          <el-input v-model="sysRole1.roleCode" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--- 角色表格数据 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="roleCode" label="角色code" width="180" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          修改
        </el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row)">
          删除
        </el-button>

        <el-button
          type="warning"
          size="small"
          @click="showAssignMenu(scope.row)"
        >
          分配菜单
        </el-button>

        <!-- 分配菜单的对话框  -->
        <el-dialog v-model="dialogMenuVisible" title="分配菜单" width="40%">
          <el-form label-width="80px">
            <el-form-item label="角色名">
              <el-input disabled :value="sysRole1.roleName"></el-input>
            </el-form-item>
            <el-tree
              :data="sysMenuTreeList"
              ref="tree"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="defaultProps"
              :check-on-click-node="true"
            />
            <el-form-item>
              <el-button type="primary" @click="doAssign">提交</el-button>
              <el-button @click="dialogMenuVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-table-column>
    </el-table>

    <!--分页条-->
    <el-pagination
      v-model:current-page="pageParams.page"
      v-model:page-size="pageParams.limit"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="fetchData"
      @current-change="fetchData"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  addSysRole,
  DeleteSysRoleById,
  DoAssignMenuId,
  getById,
  getPageList,
  getRoleMenuById,
  updateSysRole,
} from '@/api/sysRole'
import sysRole from '@/views/system/sysRole.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

//分页数据
const pageParams = ref({
  page: 1, // 页码
  limit: 10, // 每页记录数
})

// 定义表格数据模型
let list = ref([])

// 设置输入框初始状态
let queryDto = ref({
  roleName: '',
})

// 页面最开始加载
onMounted(() => {
  fetchData()
})

// 控制对话框的关闭展示
const dialogVisible = ref(false)
// 设置表单的模型数据
let sysRole1 = ref({
  roleName: '',
  roleCode: '',
})
// 点击修改触发
let editShow = async row => {
  dialogVisible.value = true
  const { data } = await getById(row.id)
  sysRole1.value = data
}

let update = async () => {
  const { code, message } = await updateSysRole(sysRole1.value)
  if (code == 200) {
    ElMessage.success(message)
    fetchData()
  } else {
    ElMessage.error(message)
  }
}

// 点击添加触发,
let addShow = () => {
  dialogVisible.value = true
}
let add = async () => {
  const { code, message } = await addSysRole(sysRole1.value)
  // 成功打印信息,并刷新页面,重新查询一次
  if (code == 200) {
    ElMessage.success(message)
    fetchData()
  } else {
    ElMessage.error(message)
  }
}
// 点击提交触发axios
let submit = async () => {
  if (sysRole1.value.id) {
    update()
  } else {
    add()
  }

  //   并清空输入框且关闭
  sysRole1.value = {}
  dialogVisible.value = false
}

// 点击搜索时，触发钩子函数，并清空搜索框内容
let searchSysRole = () => {
  fetchData()
  queryDto.value.roleName = ''
}

//  发起axios请求
let fetchData = async () => {
  // 后端需要什么参数就传递什么参数
  const { data, code } = await getPageList(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  if (code == 200) {
    // 把后端的数据传给前端赋值
    list.value = data.list
    total.value = data.total
  }
}

// 删除数据
const deleteById = row => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { code } = await DeleteSysRoleById(row.id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}

// 分配菜单
const defaultProps = {
  children: 'children',
  label: 'title',
}
// 设置动态响应容器
const sysMenuTreeList = ref([])
const dialogMenuVisible = ref(false)
// 树对象变量
const tree = ref()
// 点击分配菜单
const showAssignMenu = async row => {
  dialogMenuVisible.value = true
  sysRole1.value = row
  //   这里不仅要展示所有数据,还需奥根据id把对应的已分配的菜单进行展示 .
  //   发送axios请求
  const { code, message, data } = await getRoleMenuById(row.id)
  if (code == 200) {
    // 前面的值是动态容器的,后面是根据后端的key值找到的值进行赋值
    sysMenuTreeList.value = data.sysMenusTreeList
    tree.value.setCheckedKeys(data.sysRoleMenuId)
    ElMessage.success('操作成功')
  }
}

const doAssign = async () => {
  const checkedNodes = tree.value.getCheckedNodes() // 获取选中的节点
  const checkedNodesIds = checkedNodes.map(node => {
    // 获取选中的节点的id
    return {
      id: node.id,
      isHalf: 0,
    }
  })

  // 获取半选中的节点数据，当一个节点的子节点被部分选中时，该节点会呈现出半选中的状态
  const halfCheckedNodes = tree.value.getHalfCheckedNodes()
  const halfCheckedNodesIds = halfCheckedNodes.map(node => {
    // 获取半选中节点的id
    return {
      id: node.id,
      isHalf: 1,
    }
  })

  // 将选中的节点id和半选中的节点的id进行合并
  const menuIds = [...checkedNodesIds, ...halfCheckedNodesIds]
  console.log(menuIds)

  // 构建请求数据
  const assignMenuDto = {
    roleId: sysRole1.value.id,
    menuIdList: menuIds,
  }
  console.log(assignMenuDto.roleId)

  // 发送请求
  await DoAssignMenuId(assignMenuDto)
  ElMessage.success('更新成功')
  dialogMenuVisible.value = false
}
//设置总记录数
const total = ref(0)
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
