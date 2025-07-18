import { login } from "@/lib/login"
import type { Customer } from "@/types/customer"
import { transformApiDataToCustomer, transformCustomerToApiFormat } from "../utils/customerDataTransform"
import { CUSTOMER_API_ENDPOINTS } from "../constants/customerConstants"

class CustomerService {
  private async getAuthToken(): Promise<string> {
    return await login("ameinvoice", "amnote123", "2736", "VIET")
  }

  async getAllCustomers(): Promise<Customer[]> {
    try {
      const token = await this.getAuthToken()
      const response = await fetch(CUSTOMER_API_ENDPOINTS.GET_ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const rawData = await response.json()

      if (rawData && rawData.result) {
        return rawData.result.map(transformApiDataToCustomer)
      }

      return []
    } catch (error) {
      throw new Error("Không thể tải danh sách khách hàng")
    }
  }

  async addCustomer(customer: Customer): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const token = await this.getAuthToken()
      const apiData = transformCustomerToApiFormat(customer)

      const response = await fetch(CUSTOMER_API_ENDPOINTS.ADD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.messages?.[0] || result.message || "Thêm khách hàng thất bại!")
      }

      if (result.status === "success") {
        return {
          success: true,
          message: result.messages?.[0] || "Thêm khách hàng thành công!",
          data: result.result,
        }
      } else {
        throw new Error(result.messages?.[0] || "Thêm khách hàng thất bại.")
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Đã xảy ra lỗi khi thêm khách hàng.",
      }
    }
  }

  async updateCustomer(customer: Customer): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const token = await this.getAuthToken()
      const apiData = transformCustomerToApiFormat(customer)

      if (!apiData.CustomerCD) {
        throw new Error("Không tìm thấy Mã khách hàng để cập nhật.")
      }

      const response = await fetch(CUSTOMER_API_ENDPOINTS.UPDATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.messages?.[0] || result.message || "Cập nhật khách hàng thất bại!")
      }

      if (result.status === "success") {
        return {
          success: true,
          message: result.messages?.[0] || "Cập nhật khách hàng thành công!",
          data: result.result,
        }
      } else {
        throw new Error(result.messages?.[0] || "Cập nhật khách hàng thất bại.")
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Đã xảy ra lỗi khi cập nhật khách hàng.",
      }
    }
  }

  static async deleteCustomer(id: string): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock successful deletion
      return {
        success: true,
        message: `Đã xóa khách hàng ${id} thành công`
      }
    } catch (error) {
      return {
        success: false,
        message: "Xóa khách hàng thất bại!"
      }
    }
  }

  async deleteCustomer(customerId: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = await this.getAuthToken()
      const apiData = {
        Lag: "VIET",
        CustomerCD: customerId,
      }

      const response = await fetch(CUSTOMER_API_ENDPOINTS.DELETE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.messages?.[0] || result.message || "Xóa khách hàng thất bại!")
      }

      if (result.status === "success") {
        return {
          success: true,
          message: result.messages?.[0] || "Xóa khách hàng thành công!",
        }
      } else {
        throw new Error(result.messages?.[0] || "Xóa khách hàng thất bại.")
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Đã xảy ra lỗi khi xóa khách hàng.",
      }
    }
  }
}

export const customerService = new CustomerService()