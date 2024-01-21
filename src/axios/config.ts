import { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { NO_AUTH_CODE, SUCCESS_CODE } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'
import { useUserStore } from '@/store/modules/user'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  }
  const userStore = useUserStore()
  // 将token添加到请求头中, 如果token存在的话
  if (userStore.getToken) {
    config.headers[userStore.getTokenKey] = userStore.getToken
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  }
  const code = response.data.code
  if (code === SUCCESS_CODE) {
    return response.data
  } else if (code === NO_AUTH_CODE) {
    ElMessage.error(t('common.noAuth'))
    const userStore = useUserStoreWithOut()
    userStore.logout()
  } else {
    ElMessage.error(response?.data?.message)
  }
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
