import request from "@/utils/request";

const api_name = '/admin/product/productUnit';

// 展示商品的单位
export const FindAllProductUnit = () => {
    return request({
        url: `${api_name}/findAllProductUnit`,
        method: 'get'
    })
};