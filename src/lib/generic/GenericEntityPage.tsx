"use client"

import { useCallback } from "react"
import { TablePage } from "@/components/table/TablePage"
import { exportToExcel } from "@/lib/excelUtils"
import { useEntityData } from "./useEntityData"
import type { BaseEntity, EntityPageConfig } from "./types"

interface GenericEntityPageProps<TEntity extends BaseEntity> {
  config: EntityPageConfig<TEntity>
}

export function GenericEntityPage<TEntity extends BaseEntity>({
  config,
}: GenericEntityPageProps<TEntity>) {
  const { data, isLoading, handleRefresh, handleAdd, handleEdit, handleDelete } = useEntityData(config.api)

  const handleImport = useCallback((rows: any[], method: "add" | "update" | "overwrite") => {
    console.log(`Import ${config.name} data:`, rows, "Method:", method)
  }, [config.name])

  const handlePrint = useCallback((lang: "vi" | "en" | "ko") => {
    console.log(`Print ${config.name} list in language:`, lang)
  }, [config.name])

  const handleExport = useCallback(() => {
    exportToExcel(data, config.table.columns, `${config.name}.xlsx`, config.name)
    alert(`Đã xuất dữ liệu ${config.title} ra Excel thành công!`)
  }, [data, config])

  return (
    <TablePage
      title={config.title}
      description={config.description}
      columns={config.table.columns}
      data={data}
      isInitialLoading={isLoading}
      onImport={handleImport}
      onPrint={handlePrint}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRefresh={handleRefresh}
      onExport={handleExport}
      searchFields={config.table.searchFields}
      enableTreeView={config.table.enableTreeView}
      parentField={config.table.parentField}
      companyInfo={config.companyInfo}
      excelImportConfig={config.import}
      printConfig={config.print}
      formConfig={config.form}
      deleteConfig={config.delete}
      bulkDeleteConfig={config.bulkDelete}
    />
  )
}