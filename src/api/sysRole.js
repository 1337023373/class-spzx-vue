// 添加角色请求方法
import request from '@/utils/request'

export const SavaSysRole = data => {
  return request({
    url: '/admin/system/sysRole/saveSysRole',
    method: 'post',
    data,
  })
}

//查询角色,携带分页信息和用户信息
export const getPageList = (current, size, sysRoleDto) => {
  return request({
    url: `/admin/system/sysRole/${current}/${size}`,
    method: 'get',
    params: sysRoleDto,
  })
}

//添加
export const addSysRole = data => {
  return request({
    url: `/admin/system/sysRole/add`,
    method: 'post',
    data,
  })
}

//根据id查询角色信息
export const getById = id => {
  return request({
    url: `/admin/system/sysRole/getById/${id}`,
    method: 'get',
  })
}

//修改
export const updateSysRole = data => {
  return request({
    url: `/admin/system/sysRole/update`,
    method: 'put',
    data,
  })
}

//删除
export const DeleteSysRoleById = id => {
  return request({
    url: `/admin/system/sysRole/${id}`,
    method: 'delete',
    params: id,
  })
}

//带id去展示所有角色
export const GetAllRoleList = userId => {
  return request({
    url: `/admin/system/sysRole/fingAllRole/${userId}`,
    method: 'get',
    params: userId,
  })
}

// 保存并修改角色分配信息
export const getDoAssign = data => {
  return request({
    url: '/admin/system/sysRole/doAssign',
    method: 'post',
    data,
  })
}

//查询分配菜单
export const getRoleMenuById = roleId => {
  return request({
    url: `/admin/system/sysRoleMenu/getRoleMenuById/${roleId}`,
    method: 'get',
  })
}

//查询分配菜单
export const DoAssignMenuId = data => {
  return request({
    url: `/admin/system/sysRoleMenu/doAssignMenuId`,
    method: 'post',
    data,
  })
}
