import request from '@/axios'
import type { UserType } from './types'
import { Md5 } from 'ts-md5'

interface RoleParams {
  userId: string
}

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  // 使用JSON进行深拷贝，然后再操作新对象
  const newData: any = JSON.parse(JSON.stringify(data))
  newData.loginType = 1
  const md5: any = new Md5()
  md5.appendAsciiStr(newData.passWord)
  // 对密码进行MD5加密
  newData.passWord = md5.end()
  return request.post({ url: '/auth/login', data: newData })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/user/loginOut' })
}

export const getRoleByUserIdApi = (
  userId: string
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/user/getRole/' + userId })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}
