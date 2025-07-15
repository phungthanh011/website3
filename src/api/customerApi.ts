export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

// Mock API function for deleting customer
export async function deleteCustomerAPI(id: string): Promise<ApiResponse> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock success response
  return {
    success: true,
    message: `Đã xóa khách hàng ${id} thành công`
  }
}