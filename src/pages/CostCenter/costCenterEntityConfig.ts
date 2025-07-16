import type { EntityPageConfig } from "@/lib/generic/types"
import { costObjectColumns } from "./costObjectConfig"
import { costObjectFormConfig, costObjectDeleteConfig, costObjectBulkDeleteConfig } from "./costObjectFormConfig"
import { costObjectPrintConfig } from "./costObjectPrintConfig"
import { costObjectImportConfig } from "./costObjectImportConfig"

// Define CostCenter entity type
interface CostCenter {
  id: string
  code: string
  nameVi: string
  nameEn: string
  nameKo: string
  parentObject: string
  notes: string
  createdDate: string
  status: "active" | "inactive"
}

// Transform functions (mock for now since we don't have real API)
function transformApiDataToCostCenter(apiData: any): CostCenter {
  return {
    id: apiData.id || apiData.ID,
    code: apiData.code || apiData.CODE,
    nameVi: apiData.nameVi || apiData.NAME_VI,
    nameEn: apiData.nameEn || apiData.NAME_EN,
    nameKo: apiData.nameKo || apiData.NAME_KO,
    parentObject: apiData.parentObject || apiData.PARENT_OBJECT || "0",
    notes: apiData.notes || apiData.NOTES || "",
    createdDate: apiData.createdDate || apiData.CREATED_DATE || new Date().toISOString().split("T")[0],
    status: apiData.status || apiData.STATUS || "active",
  }
}

function transformCostCenterToApiFormat(costCenter: CostCenter): any {
  return {
    ID: costCenter.id,
    CODE: costCenter.code,
    NAME_VI: costCenter.nameVi,
    NAME_EN: costCenter.nameEn,
    NAME_KO: costCenter.nameKo,
    PARENT_OBJECT: costCenter.parentObject,
    NOTES: costCenter.notes,
    STATUS: costCenter.status,
    CREATED_DATE: costCenter.createdDate,
  }
}

// Complete entity configuration
export const costCenterEntityConfig: EntityPageConfig<CostCenter> = {
  name: "cost-center",
  title: "Đối tượng tập hợp chi phí",
  description: "Quản lý các đối tượng tập hợp chi phí",
  
  // API Configuration (mock endpoints for now)
  api: {
    endpoints: {
      getAll: "/api/cost-center/getAll",
      add: "/api/cost-center/add",
      update: "/api/cost-center/update",
      delete: "/api/cost-center/delete",
    },
    transformers: {
      fromApi: transformApiDataToCostCenter,
      toApi: transformCostCenterToApiFormat,
    },
  },

  // Table Configuration
  table: {
    columns: costObjectColumns,
    searchFields: ["code", "nameVi", "nameEn", "nameKo"],
    enableTreeView: true,
    parentField: "parentObject",
    defaultSort: { field: "createdDate", order: "desc" },
  },

  // Form Configuration
  form: costObjectFormConfig,

  // Print Configuration
  print: costObjectPrintConfig,

  // Import Configuration
  import: costObjectImportConfig,

  // Delete Configuration
  delete: costObjectDeleteConfig,
  bulkDelete: costObjectBulkDeleteConfig,

  // Company Info
  companyInfo: {
    name: "Công ty TNHH ABC Technology",
    address: "123 Đường ABC, Quận Ba Đình, Hà Nội",
    taxCode: "0123456789",
  },
}