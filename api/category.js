import request from '@/utils/request'
 
export function categoryListTree() {
    return request({
      url: '/admin/category/listAllTree',
      method: 'get'
    })
  }
export function categoryList() {
    return request({
      url: '/admin/category',
      method: 'get'
    })
  }
export function categoryListForPage(data) {
    return request({
      url: '/admin/category/listAllForPage',
      method: 'get',
      params: data
    })
  }
export function addCategory(category) {
    return request({
      url: '/admin/category/addCategory',
      method: 'post',
      data:category
    })
  }
export function updateCategory(category) {
    return request({
      url: '/admin/category/updateCategory',
      method: 'PUT',
      data:category
    })
  }
  export function findParentId(id) {
    return request({
      url: '/admin/category/findParentId/'+id,
      method: 'get',
      
    })
  }
  export function deleteCategory(id) {
    return request({
      url: '/admin/category/deleteCategory/'+id,
      method: 'delete',
      
    })
  }