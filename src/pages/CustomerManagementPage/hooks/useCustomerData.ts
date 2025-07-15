import { useState, useCallback, useEffect } from "react"
import type { Customer } from "@/types/customer"
import { customerService } from "../services/customerService"

export function useCustomerData() {
  const [data, setData] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditLoading, setIsEditLoading] = useState(false)

  // Fetch data from API
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true)
    try {
      const customers = await customerService.getAllCustomers()
      setData(customers)
    } catch (error) {
      console.error("Failed to fetch customer data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await fetchCustomers()
  }, [fetchCustomers])

  // Add customer handler
  const handleAdd = useCallback(async (newItem: Customer) => {
    try {
      const result = await customerService.addCustomer(newItem)
      if (result && result.success) {
        setIsEditLoading(true)
        await handleRefresh()
        setIsEditLoading(false)
        return { success: true, message: result.message || "Thêm mới khách hàng thành công!" }
      } else {
        return { success: false, message: result?.message || "Thêm mới khách hàng thất bại!" }
      }
    } catch (error) {
      console.error("Failed to add customer:", error)
      return { success: false, message: "Thêm mới khách hàng thất bại!" }
    }
  }, [handleRefresh])

  // Edit customer handler
  const handleEdit = useCallback(async (updatedItem: Customer) => {
    setIsEditLoading(true)
    try {
      const result = await customerService.updateCustomer(updatedItem)
      if (result.success) {
        await handleRefresh()
        setIsEditLoading(false)
        return { success: true, message: result.message || "Cập nhật khách hàng thành công!" }
      } else {
        setIsEditLoading(false)
        return { success: false, message: result.message || "Cập nhật khách hàng thất bại!" }
      }
    } catch (error) {
      setIsEditLoading(false)
      console.error("Failed to edit customer:", error)
      return { success: false, message: "Cập nhật khách hàng thất bại!" }
    }
  }, [handleRefresh])

  // Delete customer handler
  const handleDelete = useCallback(async (id: string) => {
    try {
      const result = await customerService.deleteCustomer(id)
      if (result.success) {
        await handleRefresh()
        return { success: true, message: result.message || "Xóa khách hàng thành công!" }
      } else {
        return { success: false, message: result.message || "Xóa khách hàng thất bại!" }
      }
    } catch (error) {
      console.error("Failed to delete customer:", error)
      return { success: false, message: "Xóa khách hàng thất bại!" }
    }
  }, [handleRefresh])

  return {
    data,
    isLoading: isLoading || isEditLoading,
    handleRefresh,
    handleAdd,
    handleEdit,
    handleDelete,
  }
}