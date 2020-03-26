
import request from '@/utils/request'
 
export function commentForPage(commentQuery) {
    return request({
      url: '/admin/comment/comments',
      method: 'post',
      data:commentQuery
    })
  }
export function updateStatusByCid(id,status) {
    return request({
      url: '/admin/comment/updateStatusByCid/'+id+"/"+status,
      method: 'put',
    })
  }
export function deleteComment(id) {
    return request({
      url: '/admin/comment/deleteComment/'+id,
      method: 'delete',
    })
  }
export function delManyComment(ids) {
    return request({
      url: '/admin/comment/deleteComment',
      method: 'post',
      data:ids
    })
  }