import { useState, useCallback, useEffect } from "react"
import type { BaseEntity, EntityApiConfig, ApiResponse } from "./types"
import { GenericEntityService } from "./GenericEntityService"

export function useEntityData<TEntity extends BaseEntity>(
  config: EntityApiConfig<TEntity>
) {
  const [data, setData] = useState<TEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditLoading, setIsEditLoading] = useState(false)

  // Create service instance
  const service = new GenericEntityService(config)

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const entities = await service.getAll()
      setData(entities)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [service])

  // Initial load
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await fetchData()
  }, [fetchData])

  // Add entity handler
  const handleAdd = useCallback(async (newItem: TEntity): Promise<ApiResponse> => {
    try {
      const result = await service.add(newItem)
      if (result && result.success) {
        setIsEditLoading(true)
        await handleRefresh()
        setIsEditLoading(false)
        return { success: true, message: result.message || "Thêm mới thành công!" }
      } else {
        return { success: false, message: result?.message || "Thêm mới thất bại!" }
      }
    } catch (error) {
      console.error("Failed to add entity:", error)
      return { success: false, message: "Thêm mới thất bại!" }
    }
  }, [service, handleRefresh])

  // Edit entity handler
  const handleEdit = useCallback(async (updatedItem: TEntity): Promise<ApiResponse> => {
    setIsEditLoading(true)
    try {
      const result = await service.update(updatedItem)
      if (result.success) {
        await handleRefresh()
        setIsEditLoading(false)
        return { success: true, message: result.message || "Cập nhật thành công!" }
      } else {
        setIsEditLoading(false)
        return { success: false, message: result.message || "Cập nhật thất bại!" }
      }
    } catch (error) {
      setIsEditLoading(false)
      console.error("Failed to edit entity:", error)
      return { success: false, message: "Cập nhật thất bại!" }
    }
  }, [service, handleRefresh])

  // Delete entity handler
  const handleDelete = useCallback(async (id: string): Promise<ApiResponse> => {
    try {
      const result = await service.delete(id)
      if (result.success) {
        await handleRefresh()
        return { success: true, message: result.message || "Xóa thành công!" }
      } else {
        return { success: false, message: result.message || "Xóa thất bại!" }
      }
    } catch (error) {
      console.error("Failed to delete entity:", error)
      return { success: false, message: "Xóa thất bại!" }
    }
  }, [service, handleRefresh])

  return {
    data,
    isLoading: isLoading || isEditLoading,
    handleRefresh,
    handleAdd,
    handleEdit,
    handleDelete,
  }
}