import request from '@/utils/request'

const api_name = '/admin/product/category'

export const FindCategoryByParentId = parentId => {
  return request({
    url: `${api_name}/getCategory/${parentId}`,
    method: 'get',
  })
}

export const ExportCategoryData = () => {
  return request({
    url: `${api_name}/exportData`,
    method: 'get',
    responseType: 'blob',
  })
}
