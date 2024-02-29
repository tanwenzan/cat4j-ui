<script setup lang="ts">
import { computed, unref } from 'vue'
import { ElIcon } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { Icon } from '@iconify/vue'

import { useIconState } from '@/store/modules/icon'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('icon')

const iconState = useIconState()

const props = defineProps({
  // icon name
  icon: propTypes.string,
  // icon color
  color: propTypes.string,
  // icon size
  size: propTypes.number.def(16),
  hoverColor: propTypes.string
})

const isLocal = computed(() => props.icon.startsWith('svg-icon:'))

const isRemote = computed(() => props.icon.startsWith('remote:'))

const symbolId = computed(() => {
  return unref(isLocal)
    ? `#icon-${props.icon.split('svg-icon:')[1]}`
    : iconState.findById(props.icon.split('remote:')[1])
})

// 是否使用在线图标
const isUseOnline = computed(() => {
  return import.meta.env.VITE_USE_ONLINE_ICON === 'true'
})

const getIconifyStyle = computed(() => {
  const { color, size } = props
  return {
    fontSize: `${size}px`,
    color
  }
})
</script>

<template>
  <ElIcon :class="prefixCls" :size="size" :color="color">
    <svg v-if="isLocal" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>
    <span v-else-if="isRemote" v-html="symbolId"> </span>

    <template v-else>
      <Icon v-if="isUseOnline" :icon="icon" :style="getIconifyStyle" />
      <div v-else :class="`${icon} iconify`" :style="getIconifyStyle"></div>
    </template>
  </ElIcon>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-icon';

.@{prefix-cls},
.iconify {
  :deep(svg) {
    &:hover {
      // stylelint-disable-next-line
      color: v-bind(hoverColor) !important;
    }
  }
}

.iconify {
  &:hover {
    // stylelint-disable-next-line
    color: v-bind(hoverColor) !important;
  }
}
</style>
