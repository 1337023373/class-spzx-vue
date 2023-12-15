import request from '@/utils/request'

//带条件的分页查询,形参的位置也需要同后端一致
export const getPageList = (current, size, SysUserDto) => {
  return request({
    // 这里的路径顺序要和后端的一致,不然拿不到数据
    url: `/admin/system/sysUser/${current}/${size}`,
    method: 'get',
    params: SysUserDto,
  })
}

//添加用户
export const addSysUser = SysUser => {
  return request({
    url: '/admin/system/sysUser/add',
    method: 'post',
    data: SysUser,
  })
}
//根据id查询用户,并展示到更新框中
export const showSysUserById = id => {
  return request({
    url: `/admin/system/sysUser/${id}`,
    method: 'get',
    params: id,
  })
}

//修改用户,根据id去更新
export const updateSysUser = data => {
  return request({
    url: `/admin/system/sysUser/update`,
    method: 'put',
    data,
  })
}

//通过id删除用户
export const DeleteSysUserById = id => {
  return request({
    url: `/admin/system/sysUser/${id}`,
    method: 'delete',
    params: id,
  })
}
