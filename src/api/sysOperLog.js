import request from '@/utils/request'

const api_name = "/admin/system/sysOperLog"


//分页及带条件查询的函数
export const getPageList = (current, size, searchObj) => {
    return request({
        url: `${api_name}/${current}/${size}`,
        method: "get",
        params: searchObj
    });
}
