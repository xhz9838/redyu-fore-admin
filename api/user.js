import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/admin/user/logout',
    method: 'post',
    params:{token}
  })
}
export function blogInformation() {
  return request({
    url: '/admin/user/blogInformation',
    method: 'get',
  })
}
