// Generic types for entity system
export interface ApiEndpoints {
  getAll: string
  add: string
  update: string
  delete: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export interface DataTransformers<TEntity, TApiData = any> {
  toApi: (entity: TEntity) => TApiData
  fromApi: (apiData: TApiData) => TEntity
}

export interface EntityApiConfig<TEntity, TApiData = any> {
  endpoints: ApiEndpoints
  transformers: DataTransformers<TEntity, TApiData>
  authConfig?: {
    username: string
    password: string
    companyID: string
    language: string
  }
}

export interface BaseEntity {
  id: string
  [key: string]: any
}

// Generic entity page configuration
export interface EntityPageConfig<TEntity extends BaseEntity> {
  name: string
  title: string
  description: string
  api: EntityApiConfig<TEntity>
  table: {
    columns: import("@/types/table").ColumnConfig[]
    searchFields: string[]
    enableTreeView?: boolean
    parentField?: string
    defaultSort?: { field: keyof TEntity; order: "asc" | "desc" }
  }
  form: import("@/types/form").FormConfig
  print: import("@/types/modal").PrintConfig
  import: import("@/types/modal").ExcelImportConfig
  delete: import("@/types/form").DeleteConfig
  bulkDelete: import("@/types/form").DeleteConfig
  companyInfo?: {
    name: string
    address: string
    taxCode: string
  }
}