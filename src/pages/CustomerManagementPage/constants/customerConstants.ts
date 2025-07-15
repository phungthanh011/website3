// API endpoints
export const CUSTOMER_API_ENDPOINTS = {
  GET_ALL: "http://118.69.170.50/API/api/CustomerInfo/getAllCustomer",
  ADD: "http://118.69.170.50/API/api/CustomerInfo/insert",
  UPDATE: "http://118.69.170.50/API/api/CustomerInfo/update",
  DELETE: "http://118.69.170.50/API/api/CustomerInfo/delete",
} as const

// Customer types
export const CUSTOMER_TYPES = {
  DOMESTIC: "1",
  OVERSEAS: "2",
} as const

// Category codes
export const CATEGORY_CODES = {
  CUSTOMER: "1",
  SUPPLIER: "2",
} as const

// Form validation patterns
export const VALIDATION_PATTERNS = {
  TAX_CODE: /^[0-9]{10}$/,
  PHONE: /^[0-9+\-\s()]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CUSTOMER_TYPE: /^[0-9]$/,
} as const

// Field max lengths
export const FIELD_MAX_LENGTHS = {
  NAME: 255,
  CODE: 50,
  TAX_CODE: 10,
  PHONE: 20,
  EMAIL: 255,
  ADDRESS: 500,
  NOTES: 500,
  ZIP_CODE: 10,
} as const

// Default values
export const DEFAULT_VALUES = {
  CUSTOMER_TYPE: CUSTOMER_TYPES.DOMESTIC,
  CATEGORY_CODE: CATEGORY_CODES.CUSTOMER,
  LANGUAGE: "VIET",
  PAYMENT_TERM: 0,
} as const