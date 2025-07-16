import type { EntityPageConfig } from "@/lib/generic/types"
import { bankManagementColumns } from "./bankManagementConfig"
import { bankFormConfig, bankDeleteConfig, bankBulkDeleteConfig } from "./bankFormConfig"
import { bankPrintConfig } from "./bankPrintConfig"
import { bankImportConfig } from "./bankImportConfig"

// Define Bank entity type
interface BankAccount {
  id: string
  bankCode: string
  bankName: string
  accountNumber: string
  accountName: string
  balance: number
  createdDate: string
  status?: string
}

// Transform functions (mock for now since we don't have real API)
function transformApiDataToBank(apiData: any): BankAccount {
  return {
    id: apiData.id || apiData.ID,
    bankCode: apiData.bankCode || apiData.BANK_CODE,
    bankName: apiData.bankName || apiData.BANK_NAME,
    accountNumber: apiData.accountNumber || apiData.ACCOUNT_NUMBER,
    accountName: apiData.accountName || apiData.ACCOUNT_NAME,
    balance: apiData.balance || apiData.BALANCE || 0,
    createdDate: apiData.createdDate || apiData.CREATED_DATE || new Date().toISOString().split("T")[0],
    status: apiData.status || apiData.STATUS || "active",
  }
}

function transformBankToApiFormat(bank: BankAccount): any {
  return {
    ID: bank.id,
    BANK_CODE: bank.bankCode,
    BANK_NAME: bank.bankName,
    ACCOUNT_NUMBER: bank.accountNumber,
    ACCOUNT_NAME: bank.accountName,
    BALANCE: bank.balance,
    STATUS: bank.status || "active",
    CREATED_DATE: bank.createdDate,
  }
}

// Complete entity configuration
export const bankEntityConfig: EntityPageConfig<BankAccount> = {
  name: "bank",
  title: "Quản lý tài khoản ngân hàng",
  description: "Quản lý danh sách tài khoản ngân hàng",
  
  // API Configuration (mock endpoints for now)
  api: {
    endpoints: {
      getAll: "/api/bank/getAll",
      add: "/api/bank/add",
      update: "/api/bank/update",
      delete: "/api/bank/delete",
    },
    transformers: {
      fromApi: transformApiDataToBank,
      toApi: transformBankToApiFormat,
    },
  },

  // Table Configuration
  table: {
    columns: bankManagementColumns,
    searchFields: ["bankCode", "bankName", "accountNumber", "accountName"],
    enableTreeView: false,
    defaultSort: { field: "createdDate", order: "desc" },
  },

  // Form Configuration
  form: bankFormConfig,

  // Print Configuration
  print: bankPrintConfig,

  // Import Configuration
  import: bankImportConfig,

  // Delete Configuration
  delete: bankDeleteConfig,
  bulkDelete: bankBulkDeleteConfig,

  // Company Info
  companyInfo: {
    name: "Công ty TNHH ABC Technology",
    address: "123 Đường ABC, Quận Ba Đình, Hà Nội",
    taxCode: "0123456789",
  },
}