<template>
  <div>
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="操作模块">
              <el-input
                  style="width: 100%"
                  v-model="searchObj.title"
                  placeholder="操作模块"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作人">
              <el-input
                  style="width: 100%"
                  v-model="searchObj.operName"
                  placeholder="操作人"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                  v-model="createTimes"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD"
                  style="margin-right: 10px; width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button
              type="primary"
              size="small"
              @click="fetchData()"
          >
            搜索
          </el-button>
          <el-button size="small" @click="resetData">
            重置
          </el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <el-table :data="list" stripe border style="width: 100%; margin-top: 10px">
      <el-table-column prop="title" label="系统模块"/>
      <el-table-column
          prop="businessType"
          label="操作类型"
      />
      <el-table-column
          prop="requestMethod"
          label="请求方式"
      />
      <el-table-column
          prop="operName"
          label="操作人员"
      />
      <el-table-column prop="operIp" label="操作IP" />
      <el-table-column prop="method" label="请求方法" />
      <el-table-column label="操作状态" #default="scope">
        {{ scope.row.status === 0 ? '成功' : '失败' }}
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" #default="scope">
        <el-button type="text" size="mini" @click="show(scope.row)">
          详情
        </el-button>
      </el-table-column>
    </el-table>

    <!--分页条-->
    <el-pagination
        v-model:current-page="pageParams.page"
        v-model:page-size="pageParams.limit"
        :page-sizes="[1, 2, 10, 20]"
        @size-change="fetchData"
        @current-change="fetchData"
        layout="total, sizes, prev, pager, next"
        :total="total"
    />

    <el-dialog title="详情" v-model="dialogVisible" width="70%">
      <el-form
          ref="flashPromotionForm"
          label-width="150px"
          size="small"
          style="padding-right: 40px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块">
              {{ sysOperLog.title }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址">
              {{ sysOperLog.operUrl }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录信息">
              {{ sysOperLog.operIp }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式">
              {{ sysOperLog.requestMethod }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="操作方法">
              {{ sysOperLog.method }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="请求参数">
              {{ sysOperLog.operParam }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="返回参数">
              {{ sysOperLog.jsonResult }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作状态">
              {{ sysOperLog.status === 0 ? '成功' : '失败' }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间">
              {{ sysOperLog.createTime }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { getPageList } from '@/api/sysOperLog'
import { ref, onMounted } from 'vue'

let searchObj = ref({
  title: '',
  operName: '',
  createTimeBegin: '',
  createTimeEnd: '',
})

let createTimes = ref([])

let resetData = () => {
  searchObj.value = {}
  createTimes.value = []
  fetchData()
}

let list = ref([])

let pageParams = ref({
  page: 1,
  limit: 2,
})

let total = ref(0)

onMounted(() => {
  fetchData()
})

// 加载banner列表数据
let fetchData = async () => {
  if (createTimes.value.length == 2) {
    searchObj.value.createTimeBegin = createTimes.value[0]
    searchObj.value.createTimeEnd = createTimes.value[1]
  }

  let { data } = await getPageList(
      pageParams.value.page,
      pageParams.value.limit,
      searchObj.value
  )

  list.value = data.list
  total.value = data.total
}

let dialogVisible = ref(false)

let sysOperLog = ref({
  title: '',
  operUrl: '',
  operIp: '',
  requestMethod: '',
  method: '',
  operParam: '',
  jsonResult: '',
})

let show = row => {
  dialogVisible.value = true
  //直接将当前行的数据赋给sysOprLog对象
  sysOperLog.value = row
}
</script>