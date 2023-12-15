import request from '@/utils/request'

//展示所有数据
export const getSysMenu = () => {
  return request({
    url: `/admin/system/sysMenu/showAll`,
    method: 'get',
  })
}

//添加菜单
export const addSysMenu = data => {
  return request({
    url: `/admin/system/sysMenu/addSysMenu`,
    method: 'post',
    data,
  })
}

//更新数据
export const updateSysMenu = data => {
  return request({
    url: `/admin/system/sysMenu/updateSysMenu`,
    method: 'put',
    data,
  })
}

export const RemoveSysMenuById = id => {
  return request({
    url: `/admin/system/sysMenu/removeSysMenu/${id}`,
    method: 'delete',
    params: 'id',
  })
}
