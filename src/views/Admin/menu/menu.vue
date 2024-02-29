<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { menuPageApi } from '@/api/menu'
import { ref, unref, onMounted, reactive } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { MenuVO } from '@/api/menu/type'
import { Table, TableColumn } from '@/components/Table'
import { useI18n } from 'vue-i18n'
import { ElLink } from 'element-plus'
import { Icon } from '@/components/Icon'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { hasPermi } from '@/components/Permission'

const { t } = useI18n()

// table元素
const tableRef = ref()
// table高度
const tableHeight = ref()

onMounted(() => {
  // 设置表格初始高度为 innerHeight-offsetTop-表格底部与浏览器底部距离85
  tableHeight.value =
    tableRef.value.$el.offsetParent.clientHeight -
    tableRef.value.$el.offsetTop * 2 -
    tableRef.value.$el.offsetParent.offsetTop * 2
  window.onresize = () => {
    tableHeight.value =
      tableRef.value.$el.offsetParent.clientHeight -
      tableRef.value.$el.offsetTop * 2 -
      -tableRef.value.$el.offsetParent.offsetTop * 2
  }
})

const { tableRegister, tableState } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const queryData: MenuVO = {
      parentId: '',
      code: '',
      name: '',
      permission: '',
      type: '',
      menuType: '',
      current: unref(currentPage),
      size: unref(pageSize),
      asc: '',
      desc: ''
    }
    const res = await menuPageApi(queryData)
    return {
      list: res.data.records,
      total: res.data.total
    }
  }
})

const { loading, dataList, total, currentPage, pageSize } = tableState

const columns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index'
  },
  {
    field: 'id',
    hidden: true
  },
  {
    field: 'name',
    label: t('columns.menu.name'),
    minWidth: 150,
    formatter: (record: Recordable, __: TableColumn, cellValue: string) => {
      return (
        <template>
          <template v-if="hasPermi('menu.edit')">
            <ElLink type="primary">
              <Icon icon={record.icon} style="padding-right:5px;" /> {t(cellValue)}
            </ElLink>
          </template>
          <template v-else>
            <Icon icon={record.icon} style="padding-right:5px;" /> {t(cellValue)}
          </template>
        </template>
      )
    }
  },
  {
    field: 'code',
    minWidth: 150,
    label: t('columns.menu.code')
  },
  {
    field: 'permission',
    minWidth: 150,
    label: t('columns.menu.permission')
  },
  {
    field: 'path',
    minWidth: 400,
    label: t('columns.menu.path')
  },
  {
    field: 'icon',
    hidden: true
  }
])

defineOptions({
  name: 'MenuConfig'
})
const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: t('columns.menu.name'),
    component: 'Input'
  }
])
</script>
<template>
  <ContentWrap>
    <!-- 查询card -->
    <el-card shadow="always">
      <Search :schema="schema" />
    </el-card>
    <Table
      ref="tableRef"
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="columns"
      :data="dataList"
      row-key="name"
      :loading="loading"
      :height="tableHeight"
      sortable
      :pagination="{
        total: total,
        layout: '->, prev, pager, next, jumper, total'
      }"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @register="tableRegister"
      tooltip-effect="dark"
    />
  </ContentWrap>
</template>
