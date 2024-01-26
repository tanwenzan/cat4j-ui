import { ElSubMenu, ElMenuItem } from 'element-plus'
import { isUrl } from '@/utils/is'
import { useRenderMenuTitle } from './useRenderMenuTitle'
import { useDesign } from '@/hooks/web/useDesign'
import { pathResolve } from '@/utils/routerHelper'

const { renderMenuTitle } = useRenderMenuTitle()

export const useRenderMenuItem = (
  // allRouters: AppRouteRecordRaw[] = [],
  menuMode: 'vertical' | 'horizontal'
) => {
  const renderMenuItem = (routers: AppRouteRecordRaw[], parentPath = '/') => {
    return routers
      .filter((v) => !v.meta?.hidden)
      .map((v) => {
        const meta = v.meta ?? {}
        const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path)

        if (!v.children && !meta?.alwaysShow) {
          return (
            <ElMenuItem index={fullPath}>
              {{
                default: () => renderMenuTitle(meta)
              }}
            </ElMenuItem>
          )
        } else {
          const { getPrefixCls } = useDesign()

          const preFixCls = getPrefixCls('menu-popper')
          return (
            <ElSubMenu
              index={fullPath}
              popperClass={
                menuMode === 'vertical' ? `${preFixCls}--vertical` : `${preFixCls}--horizontal`
              }
            >
              {{
                title: () => renderMenuTitle(meta),
                default: () => renderMenuItem(v.children!, fullPath)
              }}
            </ElSubMenu>
          )
        }
      })
  }

  return {
    renderMenuItem
  }
}
