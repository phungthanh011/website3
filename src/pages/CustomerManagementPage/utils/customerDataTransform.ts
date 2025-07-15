import type { Customer } from "@/types/customer"

/**
 * Transform raw API data to Customer interface
 */
export function transformApiDataToCustomer(apiData: any): Customer {
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

/**
 * Transform Customer interface to API format
 */
export function transformCustomerToApiFormat(customer: Customer): any {
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