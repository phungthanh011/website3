"use client"

import { useCallback } from "react"
import { TablePage } from "@/components/table/TablePage"
import { customerColumns } from "./customerConfig"
import { customerFormConfig, customerDeleteConfig, customerBulkDeleteConfig } from "./customerFormConfig"
import { customerPrintConfig } from "./customerPrintConfig"
import { customerImportConfig } from "./customerImportConfig"
import { exportToExcel } from "@/lib/excelUtils"
import { useCustomerData } from "./hooks/useCustomerData"

export default function CustomerManagementPage() {
  const { data, isLoading, handleRefresh, handleAdd, handleEdit, handleDelete } = useCustomerData()

  const handleImport = useCallback((rows: any[], method: "add" | "update" | "overwrite") => {
    console.log("Import customer data:", rows, "Method:", method)
  }, [])

  const handlePrint = useCallback((lang: "vi" | "en" | "ko") => {
    console.log("Print customer list in language:", lang)
  }, [])

  const handleExport = useCallback(() => {
    exportToExcel(data, customerColumns, "danh-sach-khach-hang.xlsx", "KhachHang")
    alert("Đã xuất dữ liệu khách hàng ra Excel thành công!")
  }, [data])

  return (
    <TablePage
      title="Quản lý khách hàng"
      description="Quản lý danh sách thông tin khách hàng"
      columns={customerColumns}
      data={data}
      isInitialLoading={isLoading}
      onImport={handleImport}
      onPrint={handlePrint}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onRefresh={handleRefresh}
      onExport={handleExport}
      searchFields={["id", "nameVi", "nameEn", "nameKo", "taxCode", "email", "tel", "address"]}
      enableTreeView={false}
      companyInfo={{
        name: "Công ty TNHH ABC Technology",
        address: "123 Đường ABC, Quận Ba Đình, Hà Nội",
        taxCode: "0123456789",
      }}
      excelImportConfig={customerImportConfig}
      printConfig={customerPrintConfig}
      formConfig={customerFormConfig}
      deleteConfig={customerDeleteConfig}
      bulkDeleteConfig={customerBulkDeleteConfig}
    />
  )
}