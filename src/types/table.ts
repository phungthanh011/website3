import type { Customer } from "@/types/customer";

export interface ColumnConfig {
  id: string
  dataField: string
  displayName: string
  width: number
  visible: boolean
  pinned: boolean
  originalOrder: number
}

export interface BaseTableItem {
  id: string
  [key: string]: any
}

export interface TablePageProps<T extends BaseTableItem> {
  title: string
  description?: string
  columns: ColumnConfig[]
  data: T[]
  onImport?: (data: any[], method: "add" | "update" | "overwrite") => void
  onPrint?: (lang: "vi" | "en" | "ko") => void
  onAdd?: (newItem: Customer) => void
  onEdit?: (item: T) => void
  onDelete?: (id: string) => Promise<{ success: boolean; message: string }>
  onBulkDelete?: (ids: string[]) => void
  onRefresh?: () => Promise<void>
  onExport?: () => void
  searchFields?: string[]
  enableTreeView?: boolean
  parentField?: string
  childrenField?: string
  companyInfo?: {
    name: string
    address: string
    taxCode: string
  }
}
