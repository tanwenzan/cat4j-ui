import request from '@/axios'
import { MenuVO } from '@/api/menu/type'

export const menuPageApi = (data: MenuVO) => {
  return request.get({ url: '/menu', data: data })
}
