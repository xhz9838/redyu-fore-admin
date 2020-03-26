import request from '@/utils/request'
 
export function tagList() {
    return request({
      url: '/admin/tag',
      method: 'get'
    })
  }
  export function tagListAndCount(more = true) {
    return request({
      url: '/admin/tag',
      method: 'get',
      params: {
        more: more
      },
    })
  }
export function createTag(tag) {
    return request({
      url: '/admin/tag/createTag',
      method: 'post',
      data: tag 
    })
  }
export function updateTag(tag) {
    return request({
      url: '/admin/tag/updateTag',
      method: 'put',
      data: tag 
    })
  }
export function deleteTag(id) {
    return request({
      url: '/admin/tag/deleteTag/'+id,
      method: 'delete',
    })
  }