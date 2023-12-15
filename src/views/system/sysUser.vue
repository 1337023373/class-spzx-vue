<template>
  <!---搜索表单-->
  <div class="search-div">
    <el-form label-width="70px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="关键字">
            <el-input
              v-model="queryDto.keyword"
              style="width: 100%"
              placeholder="用户名、姓名、手机号码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="createTimes"
              type="daterange"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="searchSysUser">
          搜索
        </el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </el-row>
    </el-form>
  </div>

  <!--添加按钮-->
  <div class="tools-div">
    <el-button type="success" size="small" @click="addShow">添 加</el-button>
  </div>

  <el-dialog v-model="dialogVisible" title="添加或修改" width="40%">
    <el-form label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="sysUser.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" show-password v-model="sysUser.password" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="sysUser.name" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="sysUser.phone" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8501/admin/system/file/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="headers"
        >
          <img v-if="sysUser.avatar" :src="sysUser.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="sysUser.description" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!---数据表格-->
  <el-table :data="list" style="width: 100%">
    <el-table-column prop="username" label="用户名" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="phone" label="手机" />
    <el-table-column prop="avatar" label="头像" #default="scope">
      <img :src="scope.row.avatar" width="50" />
    </el-table-column>
    <el-table-column prop="description" label="描述" />
    <el-table-column prop="status" label="状态" #default="scope">
      {{ scope.row.status == 1 ? '正常' : '停用' }}
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button type="primary" size="small" @click="editSysUser(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteById(scope.row)">
        删除
      </el-button>
      <el-button type="warning" size="small" @click="showAssignRole(scope.row)">
        分配角色
      </el-button>

      <el-dialog v-model="dialogRoleVisible" title="分配角色" width="40%">
        <el-form label-width="80px">
          <el-form-item label="用户名">
            <el-input disabled :value="sysUser.username"></el-input>
          </el-form-item>

          <el-form-item label="角色列表">
            <el-checkbox-group v-model="userRoleIds">
              <el-checkbox
                v-for="role in allRoles"
                :key="role.id"
                :label="role.id"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="doAssign">提交</el-button>
            <el-button @click="dialogRoleVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="pageParams.page"
    v-model:page-size="pageParams.limit"
    @size-change="fetchData"
    @current-change="fetchData"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  addSysUser,
  getPageList,
  showSysUserById,
  updateSysUser,
  DeleteSysUserById,
} from '@/api/sysUsere'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useApp } from '@/pinia/modules/app'
import { GetAllRoleList, getDoAssign } from '@/api/sysRole'

// 表格数据模型
const list = ref([])
const pageParams = ref({
  page: 1, // 页码
  limit: 10, // 每页记录数
})
// 这里就是后端需要的数据,对应sysuserdto,所以封装一个对象,把数据填入
const queryDto = ref({
  keyword: '',
  createTimeBegin: '',
  createTimeEnd: '',
})

// 钩子函数，页面加载时就触发
onMounted(() => {
  fetchData()
})

// 点击搜索,清空输入框,并发请求
const searchSysUser = () => {
  console.log(queryDto.value.keyword)
  fetchData()
}
// 创建时间的数组,因为有两个数据,所以做成了数组
const createTimes = ref([])
// 点击重置，清空输入框,清空创建时间
const resetData = () => {
  queryDto.value.keyword = ''
  createTimes.value = []
}
// 发送axios请求
const fetchData = async () => {
  if (createTimes.value.length == 2) {
    queryDto.value.createTimeBegin = createTimes.value[0]
    queryDto.value.createTimeEnd = createTimes.value[1]
  }
  const { data, code } = await getPageList(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  if (code == 200) {
    list.value = data.list
    total.value = data.total
  }
}

// 添加表单对话框显示隐藏控制变量
const dialogVisible = ref(false)
const addShow = () => {
  dialogVisible.value = true
}

// 定义提交表单数据模型
const defaultForm = {
  username: '',
  password: '',
  name: '',
  phone: '',
  avatar: '',
  description: '',
}
// 把数据动态绑定到sysuser对象中,传递到后端
const sysUser = ref(defaultForm)

let add = async () => {
  const { code, message } = await addSysUser(sysUser.value)
  if (code == 200) {
    dialogVisible.value = false
    ElMessage.success('操作成功')
    fetchData()
  } else {
    ElMessage.error(message)
  }
}

// 修改按钮点击事件处理函数
const editSysUser = async row => {
  dialogVisible.value = true
  const { data } = await showSysUserById(row.id)
  sysUser.value = data
}

// 更新的axios请求
const update = async () => {
  const { code, message } = await updateSysUser(sysUser.value)
  if (code == 200) {
    dialogVisible.value = false
    ElMessage.success('操作成功')
    fetchData()
  } else {
    ElMessage.error(message)
  }
}
// 点击提交,根据当前行,是否有id进行判断,是添加还是更新
const submit = () => {
  if (sysUser.value.id) {
    console.log(sysUser.value.id)
    update()
  } else {
    console.log(sysUser.value.id)
    add()
  }
}

// 删除角色
const deleteById = row => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { code } = await DeleteSysUserById(row.id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      }
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}

const headers = {
  token: useApp().authorization.token, // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
}

// 图像上传成功以后的事件处理函数
const handleAvatarSuccess = (response, uploadFile) => {
  sysUser.value.avatar = response.data
}

// 角色列表
const userRoleIds = ref([])
const allRoles = ref([])
const dialogRoleVisible = ref(false)
const showAssignRole = async row => {
  dialogRoleVisible.value = true
  // 展示所点击的哪一行的rolename,
  sysUser.value = row
  const { code, data } = await GetAllRoleList(row.id)
  console.log(row.id)
  if (code == 200) {
    userRoleIds.value = data.userRoleIds
    // 这是的allroles作为遍历的键值,后端传回来的名字也应该对应
    allRoles.value = data.allRoles
  }
}

// 点击提交，把勾选的id传递过去，直接删除并添加新的数据，并关闭弹框
// 需要把数据进行封装传递给后端，对应后端的封装类是AssginRoleDto

const doAssign = async () => {
  // 封装参数
  let AssginRoleDto = {
    userId: sysUser.value.id,
    roleIdList: userRoleIds.value,
  }
  const { code, message } = await getDoAssign(AssginRoleDto)
  if (code == 200) {
    dialogRoleVisible.value = false
    ElMessage.success('操作成功')
    console.log(dialogRoleVisible.value.vaule)
    fetchData()
  }
}
// 分页条数据模型
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
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
