import request from '@/utils/request'
import { getToken } from "@/utils/auth";

export function AttachmentForPage(attachmentQuery) {
    return request({
      url: '/admin/attachment',
      method: 'post',
      data:attachmentQuery
    })
  }
export function update(attachmentId,attachment) {
    return request({
      url: '/admin/attachment/'+attachmentId,
      method: 'put',
      data:attachment
    })
  }
export function listMediaTypes() {
    return request({
      url: '/admin/attachment/media_types',
      method: 'get',
    })
  }
export function listSuffix() {
    return request({
      url: '/admin/attachment/suffix',
      method: 'get',
    })
  }
export function listTypes() {
    return request({
      url: '/admin/attachment/list_types',
      method: 'get',
    })
  }
export function uploads(file) {
    return request({
      url: '/admin/attachment/uploads',
      method: 'post',
      data:file,
      timeout:8640000,//24小时
      headers:{"Content-Type": "multipart/form-data"}
    })
  }
  export function deleteByIds(ids) {
    return request({
      url: '/admin/attachment/'+ids,
      method: 'delete',
    })
  }

  