
import request from '@/utils/request'
 
export function getAllCategory() {
    return request({
      url: '/admin/category',
      method: 'get'
    })
  }
export function createPost(data) {
    return request({
      url: '/admin/post/createPost',
      method: 'post',
      data
    })
  }
export function postForPage(postQuery) {
    return request({
      url: '/admin/post',
      method: 'post',
      data:postQuery
    })
  }
export function postById(postId) {
    return request({
      url: '/admin/post/'+postId,
      method: 'get',
    })
  }
export function updateStatus(postId,status) {
    return request({
      url: '/admin/post/'+postId+'/status/'+status,
      method: 'put',
    })
  }


































// export function getMarkdownArticles() {
//   return request({
//     url: '/edu/markdown/articles',
//     method: 'get'
//   })
// }
// export function getMarkdownArticle(id) {
//   return request({
//     url: '/edu/markdown/article/'+id,
//     method: 'get'
//   })
// }
// export function saveMarkdownArticle(data) {
//   return request({
//     url: '/edu/markdown/article',
//     method: 'post',
//     data
//   })
// }
 
// /**
//  * 发布/取消发布
//  * @param data
//  */
// export function updateStatus(data) {
//   return request({
//     url: '/edu/markdown/article/status',
//     method: 'post',
//     data
//   })
// }
 
// /**
//  * 删除
//  * @param data
//  */
// export function del(data) {
//   return request({
//     url: '/edu/markdown/article',
//     method: 'delete',
//     data
//   })
// }
// export function uploadImg(data) {
//     return request({
//       url: '/edu/markdown/img',
//       method: 'put',
//       data
//     })
//   }