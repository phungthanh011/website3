"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import * as Icons from "lucide-react"
import { useTableState } from "@/hooks/useTableState"
import { TableToolbar } from "./TableToolbar"
import { DataTable } from "./DataTable"
import { TableSettings } from "./TableSettings"
import Pagination from "@/components/table/Pagination"
import ExcelImportModal from "@/components/modals/ExcelImportModal"
import PrintModal from "@/components/modals/PrintModal"
import FormModal from "@/components/forms/FormModal"
import DeleteModal from "@/components/modals/DeleteModal"
import { Toast } from "@/components/ui/toast" // Import the new Toast component
import type { TablePageProps, BaseTableItem } from "@/types/table"
import type { ExcelImportConfig, PrintConfig } from "@/types/modal"
import type { FormConfig, DeleteConfig } from "@/types/form"

// Update the interface to include the new config props
export interface TablePagePropsWithConfigs<T extends BaseTableItem> extends TablePageProps<T> {
  excelImportConfig?: ExcelImportConfig
  printConfig?: PrintConfig
  formConfig?: FormConfig
  deleteConfig?: DeleteConfig
  bulkDeleteConfig?: DeleteConfig
  isInitialLoading?: boolean // Add new prop for initial loading
}

export function TablePage<T extends BaseTableItem>({
  title,
  description,
  columns,
  data: initialData, // Rename data to initialData as TablePage will manage its own data state
  onImport,
  onPrint,
  onAdd, // This prop now expects to return { success: boolean, message: string }
  onEdit, // This prop now expects to return { success: boolean, message: string }
  onDelete,
  onRefresh,
  onExport,
  searchFields,
  enableTreeView = false,
  parentField = "parentObject",
  companyInfo,
  excelImportConfig,
  printConfig,
  formConfig,
  deleteConfig,
  bulkDeleteConfig,
  isInitialLoading = false, // Default to false
}: TablePagePropsWithConfigs<T>) {
  const localStorageKey = `${title.replace(/\s+/g, "")}TableColumnConfigs`

  // Internal state for data, managed by TablePage
  const [tableData, setTableData] = useState<T[]>(initialData)

  // Re-initialize tableData if initialData changes (e.g., from parent refresh)
  useEffect(() => {
    setTableData(initialData)
  }, [initialData])

  const {
    data: filteredData, // This is the data after search filtering
    flattenedItems,
    paginationData,
    childrenMap,
    searchTerm,
    isSearching,
    isRefreshing,
    setIsRefreshing,
    selectedItems,
    expandedParents,
    currentPage,
    itemsPerPage,
    columnConfigs,
    setColumnConfigs,
    getOrderedColumns,
    stickyPositions,
    handleSearch,
    toggleExpand,
    handleSelectAll,
    handleSelectOne,
    handlePageChange,
    handleItemsPerPageChange,
    handleColumnConfigChange,
    setSelectedItems,
  } = useTableState({
    data: tableData, // Pass the internally managed data
    columns,
    searchFields,
    enableTreeView,
    parentField,
    localStorageKey,
    defaultSort: { field: "createdDate", order: "desc" },
  })

  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [deletingItem, setDeletingItem] = useState<T | null>(null)

  // Toast state for undo
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const { totalPages, startIndex, endIndex, displayed } = paginationData

  // Get item name for delete modal and toast
  const getItemName = useCallback((item: T | null | undefined): string => {
    // Defensive check for item itself
    if (!item) {
      return "mục không tên"
    }

    const nameFields = ["code", "nameVi", "nameEn", "nameKo", "bankCode", "accountName", "name"]
    for (const field of nameFields) {
      const value = (item as any)[field]
      // Ensure value is not null or undefined, and is a non-empty string after trimming
      if (value != null) {
        // Check for null or undefined
        const stringValue = String(value).trim()
        if (stringValue !== "") {
          return stringValue
        }
      }
    }

    // Fallback to item.id if no suitable name field found
    // item.id is typed as string, but we'll be defensive against runtime issues
    if (item.id != null) {
      // Check item.id for null or undefined
      const stringId = String(item.id).trim()
      if (stringId !== "") {
        return stringId
      }
    }

    // Final fallback if nothing useful is found
    return "mục không tên"
  }, [])

  // Prepare form config with dynamic options (for parent selection in tree view)
  const preparedFormConfig = useMemo(() => {
    if (!formConfig) return undefined

    const config = { ...formConfig }

    // Update parent field options for tree view
    if (enableTreeView && parentField) {
      const parentFieldConfig = config.fields.find((field) => field.name === parentField)
      if (parentFieldConfig && parentFieldConfig.type === "select") {
        const parentOptions = [
          { value: "0", label: "Không có cha (đối tượng gốc)" },
          ...tableData // Use tableData for options
            .filter((item) => item.id !== editingItem?.id) // Exclude current item in edit mode
            .map((item) => ({
              value: item.id,
              label: `${(item as any).code} - ${(item as any).nameVi || (item as any).name || item.id}`,
            })),
        ]
        parentFieldConfig.options = parentOptions
      }
    }

    return config
  }, [formConfig, tableData, enableTreeView, parentField, editingItem]) // Depend on tableData

  const handleRefreshData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      if (onRefresh) {
        await onRefresh()
      }
    } finally {
      setIsRefreshing(false)
    }
  }, [onRefresh, setIsRefreshing])

  const handleBulkDeleteInternal = useCallback(() => {
    if (bulkDeleteConfig && selectedItems.length > 0) {
      setIsBulkDeleteModalOpen(true)
    }
  }, [bulkDeleteConfig, selectedItems])

  const handlePrintInternal = useCallback(
    (lang: "vi" | "en" | "ko") => {
      setIsPrintModalOpen(true)
      if (onPrint) {
        onPrint(lang)
      }
    },
    [onPrint],
  )

  // Form handlers
  const handleAddClick = useCallback(() => {
    if (formConfig) {
      setFormMode("add")
      setEditingItem(null)
      setIsFormModalOpen(true)
    }
  }, [formConfig])

  const handleEditClick = useCallback(
    (item: T) => {
      if (formConfig) {
        setFormMode("edit")
        setEditingItem(item)
        setIsFormModalOpen(true)
      }
    },
    [formConfig],
  )

  const handleDeleteClick = useCallback(
    (item: T) => {
      if (deleteConfig) {
        setDeletingItem(item)
        setIsDeleteModalOpen(true)
      }
    },
    [deleteConfig],
  )

  const handleFormSubmit = useCallback(
    async (formData: any) => {
      let result: { success: boolean; message: string } | undefined

      if (formMode === "add" && onAdd) {
        // Gọi onAdd và kiểm tra kết quả trả về
        const addResult = await onAdd(formData)
        if (addResult && addResult.success) {
          setToastMessage(addResult.message)
          setShowToast(true)
          setIsFormModalOpen(false)
          setTableData((prev) => [...prev, { ...formData }]) // Có thể bổ sung id nếu addResult trả về
        } else {
          setToastMessage(addResult?.message || "Thêm mới khách hàng thất bại!")
          setShowToast(true)
          // Không cập nhật tableData khi thất bại
          return
        }
        return
      } else if (formMode === "edit" && editingItem && onEdit) {
        const editResult = await onEdit({ ...editingItem, ...formData } as T)
        if (editResult && editResult.success) {
          setToastMessage(editResult.message)
          setShowToast(true)
          setIsFormModalOpen(false)
          setTableData((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, ...formData } : item))
        } else {
          setToastMessage(editResult?.message || "Cập nhật khách hàng thất bại!")
          setShowToast(true)
          return
        }
        return
      }

      setToastMessage("Thao tác hoàn tất nhưng không có phản hồi cụ thể.")
      setShowToast(true)
      setIsFormModalOpen(false)
    },
    [formMode, editingItem, onAdd, onEdit, setIsFormModalOpen],
  )

  // Xử lý xóa thực tế qua API
  const handleDeleteConfirm = useCallback(async () => {
    if (deletingItem) {
      if (!onDelete) {
        throw new Error("Chức năng xóa chưa được cấu hình")
      }
      
      // Check if the item has children
      const hasChildren = childrenMap[deletingItem.id]?.length > 0
      if (hasChildren) {
        throw new Error("Không thể xóa đối tượng cha khi còn đối tượng con. Vui lòng xóa các đối tượng con trước.")
      }
      
      // Call the onDelete prop passed from parent
      const result = await onDelete(deletingItem.id)
      if (result.success) {
        setTableData((prev) => prev.filter((item) => item.id !== deletingItem.id))
        setDeletingItem(null)
        setToastMessage(result.message || "Đã xóa thành công")
        setShowToast(true)
      } else {
        setToastMessage(result.message || "Xóa khách hàng thất bại!")
        setShowToast(true)
      }
    }
  }, [deletingItem, tableData, childrenMap, onDelete])

  // Remove undo logic from handleBulkDeleteConfirm
  const handleBulkDeleteConfirm = useCallback(async () => {
    if (selectedItems.length > 0) {
      const selectedItemsSet = new Set(selectedItems)
      let hasUnselectedChildren = false
      for (const itemId of selectedItems) {
        const children = childrenMap[itemId]
        if (children && children.length > 0) {
          const anyChildNotSelected = children.some((child) => !selectedItemsSet.has(child.id))
          if (anyChildNotSelected) {
            hasUnselectedChildren = true
            break
          }
        }
      }
      if (hasUnselectedChildren) {
        throw new Error(
          "Không thể xóa các đối tượng cha khi có đối tượng con chưa được chọn. Vui lòng chọn tất cả đối tượng con hoặc xóa chúng trước.",
        )
      }
      // Perform deletion
      setTableData((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
      setSelectedItems([])

      // Show toast
      let successMsg: string
      if (selectedItems.length === 1) {
        const singleItem = tableData.find((item) => item.id === selectedItems[0])
        successMsg = bulkDeleteConfig?.singleMessage
          ? bulkDeleteConfig.singleMessage.replace("{item}", getItemName(singleItem))
          : `Đã xóa \"${getItemName(singleItem)}\" thành công`
      } else {
        successMsg = bulkDeleteConfig?.multipleMessage
          ? bulkDeleteConfig.multipleMessage.replace("{count}", selectedItems.length.toString())
          : `Đã xóa ${selectedItems.length} mục đã chọn thành công`
      }
      setToastMessage(successMsg)
      setShowToast(true)
    }
  }, [selectedItems, tableData, childrenMap, bulkDeleteConfig, setSelectedItems])

  // Remove undo logic from handleToastClose
  const handleToastClose = useCallback(() => {
    setShowToast(false)
    setToastMessage("")
  }, [])

  return (
    <div className="space-y-0">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">
              {description} ({tableData.length.toLocaleString()} bản ghi) {/* Use tableData.length */}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {onPrint && (
            <button
              onClick={() => handlePrintInternal("vi")}
              className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
            >
              <Icons.Printer size={16} /> <span className="hidden sm:block">In ấn</span>
            </button>
          )}

          {onImport && excelImportConfig && (
            <button
              onClick={() => setIsExcelModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-green-700"
            >
              <Icons.Upload size={16} /> <span className="hidden sm:block">Nhập Excel</span>
              {/* Nút nhập Excel được kích hoạt thông qua prop excelImportConfig */}
            </button>
          )}

          {formConfig && ( // Logic gọi API cho thêm mới/chỉnh sửa nên được xử lý ở hàm `onAdd` hoặc `onEdit` được truyền từ component cha (ví dụ: `app/customer/page.tsx`)
            <button
              onClick={handleAddClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-blue-700"
            >
              <Icons.Plus size={16} /> <span className="hidden sm:block">Thêm mới</span>
            </button>
          )}
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl shadow border">
        <TableToolbar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          isRefreshing={isRefreshing}
          onRefresh={handleRefreshData}
          onExport={onExport}
          onSettings={() => setShowSettingsPanel(true)}
          selectedCount={selectedItems.length}
          onBulkDelete={bulkDeleteConfig ? handleBulkDeleteInternal : undefined}
        />

        <DataTable
          data={displayed}
          columns={getOrderedColumns}
          stickyPositions={stickyPositions}
          selectedItems={selectedItems}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          isLoading={isRefreshing || isInitialLoading} // Combine initial loading with refreshing
          isSearching={isSearching}
          itemsPerPage={itemsPerPage}
          enableTreeView={enableTreeView}
          childrenMap={childrenMap}
          expandedParents={expandedParents}
          onToggleExpand={toggleExpand}
          parentField={parentField}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={flattenedItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>

      {/* SETTINGS PANEL */}
      {showSettingsPanel && (
        <TableSettings
          columns={columnConfigs}
          onColumnChange={handleColumnConfigChange}
          onClose={() => setShowSettingsPanel(false)}
          onReset={() => setColumnConfigs(columns)}
          stickyPositions={stickyPositions}
        />
      )}

      {/* MODALS */}
      {onImport && excelImportConfig && (
        <ExcelImportModal
          isOpen={isExcelModalOpen}
          onClose={() => setIsExcelModalOpen(false)}
          onImport={(importedData, method) => {
            // Handle import logic here to update tableData
            if (method === "overwrite") {
              setTableData(importedData)
            } else if (method === "add") {
              setTableData((prev) => [...prev, ...importedData])
            } else if (method === "update") {
              setTableData((prev) => {
                const updated = [...prev]
                importedData.forEach((row: any) => {
                  const index = updated.findIndex((item) => item.code === row.code || item.bankCode === row.bankCode) // Assuming 'code' or 'bankCode' is the unique identifier
                  if (index !== -1) {
                    updated[index] = { ...updated[index], ...row }
                  } else {
                    // If in update mode and item not found, add it (optional, depends on desired behavior)
                    // For now, only update existing.
                  }
                })
                return updated
              })
            }
            // Optionally, trigger a refresh of the table state if needed
            handleRefreshData()
          }}
          existingData={tableData} // Pass tableData for validation
          config={excelImportConfig}
        />
      )}

      {onPrint && printConfig && (
        <PrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          data={tableData} // Pass tableData for printing
          config={printConfig}
          companyInfo={companyInfo}
        />
      )}

      {preparedFormConfig && (
        <FormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit} // This will now call onAdd/onEdit from parent
          config={preparedFormConfig}
          initialData={editingItem || {}}
          existingData={tableData} // Pass tableData for validation
          mode={formMode}
        />
      )}

      {deleteConfig && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          config={deleteConfig}
          itemName={deletingItem ? getItemName(deletingItem) : undefined}
          onSuccess={(message) => {
            setToastMessage(message)
            setShowToast(true)
          }}
        />
      )}

      {bulkDeleteConfig && (
        <DeleteModal
          isOpen={isBulkDeleteModalOpen}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          onConfirm={handleBulkDeleteConfirm}
          config={bulkDeleteConfig}
          itemCount={selectedItems.length}
          customMessage={
            selectedItems.length === 1
              ? "Đã xóa 1 đối tượng thành công" // Thông báo tùy chỉnh khi chỉ có 1 mục được chọn
              : undefined // Để DeleteModal tự xử lý cho trường hợp nhiều mục
          }
          onSuccess={(message) => {
            setToastMessage(message)
            setShowToast(true)
          }}
        />
      )}

      {/* Undo Toast */}
      {showToast && (
        <Toast message={toastMessage} onClose={handleToastClose} duration={5000} />
      )}
    </div>
  )
}
