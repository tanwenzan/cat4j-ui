import request from '@/axios'
import { IconState } from '@/api/common/icon/type'

export const iconApi = (): Promise<IResponse<IconState>> => {
  return request.get({ url: '/common/icon' })
}
