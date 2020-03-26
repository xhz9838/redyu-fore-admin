// 1 导入axios
import axios from 'axios'
// 1.1 导入element message组件
import { Message } from 'element-ui'
// 1.2 导入mockjs
// import Mock from 'mockjs'


// 2 设置相关参数：基本路径、超时时间 等
axios.defaults.baseURL = 'http://localhost:10010/api'
axios.defaults.timeout = 3000

// 3 配置拦截器
axios.interceptors.request.use(request=>{
    let token = sessionStorage.getItem('token')
    if(token){
        request.headers.authorization = token
    }
    return request
},error=>{})
axios.interceptors.response.use(response => {
    
    // 放行
    return response
}, error => {
    // 错误提示
    console.info(error)
    Message.error(error.message)
    return Promise.reject(error)
})

// 4 模拟数据
// Mock.mock('请求路径','请求方式',需要数据)
// 4.1 登录模拟数据
/*
Mock.mock('http://localhost:20001/api/v1/access_token','post',)
*/


// 5 所有请求（每一个都是一个功能）
export function test(){
    return axios.get('/test')
}
// 注册
export function Userzhuce(user){
    return axios.post('/zc',user)
}

// 登录
// 注册
export function UserLogin(user){
    return axios.post("/",user)
}
