import { defineStore } from 'pinia'
import { store } from '@/store'
import { iconApi } from '@/api/common/icon'
import { IconState } from '@/api/common/icon/type'
import defaultIcons from '@/api/common/icon/default'
import { useStorage } from '@/hooks/web/useStorage'

const { setStorage, getStorage, removeStorage } = useStorage('localStorage')
const allIcons = {} as IconState

async function refreshIcons() {
  const storeIcons = getStorage('icons') as IconState
  const remoteIcons = storeIcons
    ? storeIcons
    : await iconApi()
        .then((res) => {
          return res.data as IconState
        })
        .catch(() => {
          console.error('图标请求失败,使用默认图标')
          return {} as IconState
        })
  Object.assign(allIcons, defaultIcons, remoteIcons)

  if (!storeIcons) {
    setStorage('icons', allIcons)
  }
}

await refreshIcons()

function buildIconMapping(target: Record<string, string>, icons: IconState) {
  for (const key in icons) {
    const allIcon = icons[key]
    for (let i = 0; i < allIcon.length; i++) {
      target[allIcon[i].id] = allIcon[i].icon
    }
  }
}

const allIconsMapping = {}

buildIconMapping(allIconsMapping, allIcons)

export const useIconState = defineStore('icon', {
  state: (): IconState => {
    return allIcons
  },
  getters: {
    getAll(): IconState {
      return allIcons
    },
    findById() {
      return function (id: string): string {
        return allIconsMapping[id]
      }
    }
  },
  actions: {
    addIcons(iconStates: IconState) {
      for (const key in iconStates) {
        const iconState = iconStates[key]
        if (allIcons.hasOwnProperty(key)) {
          // 合并
          Object.assign(allIcons[key], iconState)
        } else {
          // 没有就直接添加进去即可。
          allIcons[key] = iconState
        }
      }
      buildIconMapping(allIconsMapping, allIcons)
    },
    async refresh() {
      removeStorage('icons')
      await refreshIcons()
    }
  },
  persist: true
})

export const useIStoreWithOut = () => {
  return useIconState(store)
}
