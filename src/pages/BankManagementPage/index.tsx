"use client"

import { useState, useCallback } from "react"
import { TablePage } from "@/components/table/TablePage"
import { bankManagementColumns } from "./bankManagementConfig"
import { bankImportConfig } from "./bankImportConfig"
import { bankPrintConfig } from "./bankPrintConfig"
// Add imports for the new form configs
import { bankFormConfig, bankDeleteConfig, bankBulkDeleteConfig } from "./bankFormConfig"
import { exportToExcel } from "@/lib/excelUtils" // Import the new utility function

interface BankAccount {
  id: string
  bankCode: string
  bankName: string
  accountNumber: string
  accountName: string
  balance: number
  createdDate: string
}

// Mock data generator
const generateBankData = (count: number): BankAccount[] => {
  const banks = ["Vietcombank", "BIDV", "Agribank", "Techcombank", "VPBank", "ACB", "MBBank", "Sacombank"]
  const data: BankAccount[] = []

  for (let i = 1; i <= count; i++) {
    const bank = banks[i % banks.length]
    data.push({
      id: i.toString(),
      bankCode: `${bank.substring(0, 3).toUpperCase()}${i.toString().padStart(3, "0")}`,
      bankName: bank,
      accountNumber: `${Math.floor(Math.random() * 900000000) + 100000000}`,
      accountName: `Tài khoản ${bank} ${i}`,
      balance: Math.floor(Math.random() * 10000000000),
      createdDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
    })
  }

  return data
}

export default function BankManagementPage() {
  const [data, setData] = useState<BankAccount[]>(() => generateBankData(500))

  const handleImport = useCallback(
    (rows: any[], method: "add" | "update" | "overwrite") => {
      console.log("Import bank data:", rows, "Method:", method)
      if (method === "overwrite") {
        setData(
          rows.map((row, index) => ({
            ...row,
            id: (index + 1).toString(),
            balance: Number(row.balance) || 0,
            createdDate: new Date().toISOString().split("T")[0],
          })),
        )
      } else if (method === "add") {
        const newItems = rows.map((row, index) => ({
          ...row,
          id: (data.length + index + 1).toString(),
          balance: Number(row.balance) || 0,
          createdDate: new Date().toISOString().split("T")[0],
        }))
        setData((prev) => [...prev, ...newItems])
      } else if (method === "update") {
        setData((prev) => {
          const updated = [...prev]
          rows.forEach((row) => {
            const index = updated.findIndex((item) => item.bankCode === row.bankCode)
            if (index !== -1) {
              updated[index] = { ...updated[index], ...row, balance: Number(row.balance) || 0 }
            }
          })
          return updated
        })
      }
    },
    [data.length],
  )

  const handlePrint = useCallback((lang: "vi" | "en" | "ko") => {
    console.log("Print bank list in language:", lang)
  }, [])

  // Update handlers to work with the form modal
  const handleAdd = useCallback((newItem: BankAccount) => {
    console.log("Add new bank account:", newItem)
    setData((prev) => [...prev, newItem])
  }, [])

  const handleEdit = useCallback((updatedItem: BankAccount) => {
    console.log("Edit bank account:", updatedItem)
    setData((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }, [])

  const handleDelete = useCallback((id: string) => {
    console.log("Delete bank account:", id)
    setData((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handleBulkDelete = useCallback((ids: string[]) => {
    console.log("Bulk delete bank accounts:", ids)
    setData((prev) => prev.filter((item) => !ids.includes(item.id)))
  }, [])

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setData(generateBankData(500))
  }, [])

  const handleExport = useCallback(() => {
    // Sử dụng hàm tiện ích exportToExcel
    exportToExcel(data, bankManagementColumns, "ngan-hang.xlsx", "NganHang")
    alert("Đã xuất dữ liệu ra file Excel thành công!")
  }, [data])

  return (
    <TablePage
      title="Quản lý tài khoản ngân hàng"
      description="Quản lý danh sách tài khoản ngân hàng"
      columns={bankManagementColumns}
      data={data}
      onImport={handleImport}
      onPrint={handlePrint}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
      onRefresh={handleRefresh}
      onExport={handleExport}
      searchFields={["bankCode", "bankName", "accountNumber", "accountName"]}
      enableTreeView={false}
      companyInfo={{
        name: "Công ty TNHH ABC Technology",
        address: "123 Đường ABC, Quận Ba Đình, Hà Nội",
        taxCode: "0123456789",
      }}
      excelImportConfig={bankImportConfig}
      printConfig={bankPrintConfig}
      formConfig={bankFormConfig}
      deleteConfig={bankDeleteConfig}
      bulkDeleteConfig={bankBulkDeleteConfig}
    />
  )
}
