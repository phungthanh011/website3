import { login } from "@/lib/login"
import type { EntityApiConfig, ApiResponse, BaseEntity } from "./types"

export class GenericEntityService<TEntity extends BaseEntity, TApiData = any> {
  constructor(private config: EntityApiConfig<TEntity, TApiData>) {}

  private async getAuthToken(): Promise<string> {
    const authConfig = this.config.authConfig || {
      username: "ameinvoice",
      password: "amnote123", 
      companyID: "2736",
      language: "VIET"
    }
    
    return await login(
      authConfig.username,
      authConfig.password,
      authConfig.companyID,
      authConfig.language
    )
  }

  async getAll(): Promise<TEntity[]> {
    try {
      const token = await this.getAuthToken()
      const response = await fetch(this.config.endpoints.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const rawData = await response.json()

      if (rawData && rawData.result) {
        return rawData.result.map(this.config.transformers.fromApi)
      }

      return []
    } catch (error) {
      console.error("Failed to fetch entities:", error)
      throw new Error("Không thể tải danh sách dữ liệu")
    }
  }

  async add(entity: TEntity): Promise<ApiResponse> {
    try {
      const token = await this.getAuthToken()
      const apiData = this.config.transformers.toApi(entity)

      const response = await fetch(this.config.endpoints.add, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.messages?.[0] || result.message || "Thêm dữ liệu thất bại!")
      }

      if (result.status === "success") {
        return {
          success: true,
          message: result.messages?.[0] || "Thêm dữ liệu thành công!",
          data: result.result,
        }
      } else {
        throw new Error(result.messages?.[0] || "Thêm dữ liệu thất bại.")
      }
    } catch (error: any) {
      console.error("Error adding entity:", error)
      return {
        success: false,
        message: error.message || "Đã xảy ra lỗi khi thêm dữ liệu.",
      }
    }
  }

  async update(entity: TEntity): Promise<ApiResponse> {
    try {
      const token = await this.getAuthToken()
      const apiData = this.config.transformers.toApi(entity)

      if (!entity.id) {
        throw new Error("Không tìm thấy ID để cập nhật.")
      }

      const response = await fetch(this.config.endpoints.update, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.messages?.[0] || result.message || "Cập nhật dữ liệu thất bại!")
      }

      if (result.status === "success") {
        return {
          success: true,
          message: result.messages?.[0] || "Cập nhật dữ liệu thành công!",
          data: result.result,
        }
      } else {
        throw new Error(result.messages?.[0] || "Cập nhật dữ liệu thất bại.")
      }
    } catch (error: any) {
      console.error("Error updating entity:", error)
      return {
        success: false,
        message: error.message || "Đã xảy ra lỗi khi cập nhật dữ liệu.",
      }
    }
  }

  async delete(id: string): Promise<ApiResponse> {
    try {
      const token = await this.getAuthToken()
      
      // For delete, we might need to send different data structure
      // This is configurable per entity
      const deleteData = this.config.transformers.toApi({ id } as TEntity)

      const response = await fetch(this.config.endpoints.delete, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deleteData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.messages?.[0] || result.message || "Xóa dữ liệu thất bại!")
      }

      if (result.status === "success") {
        return {
          success: true,
          message: result.messages?.[0] || "Xóa dữ liệu thành công!",
        }
      } else {
        throw new Error(result.messages?.[0] || "Xóa dữ liệu thất bại.")
      }
    } catch (error: any) {
      console.error("Error deleting entity:", error)
      return {
        success: false,
        message: error.message || "Đã xảy ra lỗi khi xóa dữ liệu.",
      }
    }
  }
}