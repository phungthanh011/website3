import type { Customer } from "@/types/customer"
import type { EntityPageConfig } from "@/lib/generic/types"
import { customerColumns } from "./customerConfig"
import { customerFormConfig, customerDeleteConfig, customerBulkDeleteConfig } from "./customerFormConfig"
import { customerPrintConfig } from "./customerPrintConfig"
import { customerImportConfig } from "./customerImportConfig"

// Transform functions
function transformApiDataToCustomer(apiData: any): Customer {
  return {
    id: apiData.CUSTOMER_CD,
    customerUserCode: apiData.CUSTOMER_USER_CD || "",
    customerType: apiData.CUSTOMER_TYPE || "",
    categoryCode: apiData.CATEGORY_CD || null,
    categoryNameKor: apiData.CATEGORY_NAME_KOR || null,
    categoryNameEng: apiData.CATEGORY_NAME_ENG || null,
    categoryNameViet: apiData.CATEGORY_NAME_VIET || null,
    customerTypeNameKor: apiData.CUSTOMER_TYPE_NAME_KOR || "",
    customerTypeNameEng: apiData.CUSTOMER_TYPE_NAME_ENG || "",
    customerTypeNameViet: apiData.CUSTOMER_TYPE_NAME_VIET || "",
    nameVi: apiData.CUSTOMER_NM || "",
    nameEn: apiData.CUSTOMER_NM_EN || "",
    nameKo: apiData.CUSTOMER_NM_KOR || "",
    buyerName: apiData.BUYER_NM || "",
    taxCode: apiData.TAX_CD || "",
    email: apiData.EMAIL || "",
    bankCode: apiData.BANK_CD || null,
    bankName: apiData.BANK_NM || null,
    accountNumber: apiData.ACCOUNT_NUM || null,
    citadCode: apiData.CITAD_CODE || null,
    tel: apiData.TEL || "",
    fax: apiData.FAX || "",
    ownerName: apiData.OWNER_NM || "",
    brn: apiData.BRN || "",
    businessType: apiData.BUSINESS_TYPE || "",
    kindBusiness: apiData.KIND_BUSINESS || "",
    notes: apiData.NOTE || "",
    addressName: apiData.ADDRESS_NM || "",
    addressDo: apiData.ADDRESS_DO || "",
    address: apiData.ADDRESS || "",
    inquiryIn: apiData.INQUIRY_IN || "",
    individual: apiData.INDIVIDUAL || "",
    nationality: apiData.NATIONALITY || "",
    idNumber: apiData.IDNUMBER || "",
    placeIssue: apiData.PLACE_ISSUE || "",
    dateIssue: apiData.DATE_ISSUE || "",
    customerReceive: apiData.CUSTOMER_RECEIVE || "",
    addressReceive: apiData.ADDRESS_RECEIVE || "",
    taxCodeReceive: apiData.TAX_CD_RECEIVE || "",
    paymentTerm: apiData.PAYMENT_TERM || 0,
    createdDate: new Date().toISOString().split("T")[0],
    zipCode: apiData.ZIP_CD || "",
  }
}

function transformCustomerToApiFormat(customer: Customer): any {
  return {
    Lag: "VIET",
    CategoryCD: customer.categoryCode,
    CustomerType: customer.customerType,
    CustomerNM: customer.nameVi,
    CustomerNM_EN: customer.nameEn,
    CustomerNM_KOR: customer.nameKo,
    BuyerNM: customer.buyerName,
    CustomerUserCD: customer.customerUserCode,
    TaxCD: customer.taxCode,
    BankCD: customer.bankCode || "",
    OwnerNM: customer.ownerName,
    BusinessType: customer.businessType,
    KindBusiness: customer.kindBusiness,
    Tel: customer.tel,
    Fax: customer.fax,
    ZipCD: customer.zipCode,
    Address: customer.address,
    Email: customer.email,
    ...(customer.id && { CustomerCD: customer.id }),
  }
}

// Complete entity configuration
export const customerEntityConfig: EntityPageConfig<Customer> = {
  name: "customer",
  title: "Quản lý khách hàng",
  description: "Quản lý danh sách thông tin khách hàng",
  
  // API Configuration
  api: {
    endpoints: {
      getAll: "http://118.69.170.50/API/api/CustomerInfo/getAllCustomer",
      add: "http://118.69.170.50/API/api/CustomerInfo/insert",
      update: "http://118.69.170.50/API/api/CustomerInfo/update",
      delete: "http://118.69.170.50/API/api/CustomerInfo/delete",
    },
    transformers: {
      fromApi: transformApiDataToCustomer,
      toApi: transformCustomerToApiFormat,
    },
    authConfig: {
      username: "ameinvoice",
      password: "amnote123",
      companyID: "2736",
      language: "VIET",
    },
  },

  // Table Configuration
  table: {
    columns: customerColumns,
    searchFields: ["id", "nameVi", "nameEn", "nameKo", "taxCode", "email", "tel", "address"],
    enableTreeView: false,
    defaultSort: { field: "createdDate", order: "desc" },
  },

  // Form Configuration
  form: customerFormConfig,

  // Print Configuration
  print: customerPrintConfig,

  // Import Configuration
  import: customerImportConfig,

  // Delete Configuration
  delete: customerDeleteConfig,
  bulkDelete: customerBulkDeleteConfig,

  // Company Info
  companyInfo: {
    name: "Công ty TNHH ABC Technology",
    address: "123 Đường ABC, Quận Ba Đình, Hà Nội",
    taxCode: "0123456789",
  },
}