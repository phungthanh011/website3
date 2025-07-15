"use client"

import * as Icons from "lucide-react"
import type { ColumnConfig } from "@/types/table"

interface TableSettingsProps {
  columns: ColumnConfig[]
  onColumnChange: (columnId: string, field: keyof ColumnConfig, value: any) => void
  onClose: () => void
  onReset: () => void
  stickyPositions: { [key: string]: number }
}

export function TableSettings({ columns, onColumnChange, onClose, onReset, stickyPositions }: TableSettingsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-96 shadow-xl settings-panel flex flex-col">
        <div className="flex-1 flex flex-col h-full">
          <div className="flex justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Thiết lập bảng dữ liệu
              <div className="text-sm text-gray-400">Tùy chỉnh hiển thị các cột trong bảng dữ liệu</div>
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <Icons.X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {columns.map((column) => (
                <div key={column.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={column.visible}
                      onChange={(e) => onColumnChange(column.id, "visible", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{column.dataField}</div>
                      <div className="text-sm text-gray-500">Tên cột dữ liệu</div>
                    </div>
                    {column.pinned && (
                      <div className="flex items-center text-blue-600">
                        <Icons.Pin size={14} />
                        <span className="text-xs ml-1">Đã ghim</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên cột hiển thị</label>
                      <input
                        type="text"
                        value={column.displayName}
                        onChange={(e) => onColumnChange(column.id, "displayName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!column.visible}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                      <input
                        type="number"
                        value={column.width}
                        onChange={(e) => onColumnChange(column.id, "width", Number.parseInt(e.target.value) || 100)}
                        min="50"
                        max="500"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!column.visible}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={column.pinned}
                      onChange={(e) => onColumnChange(column.id, "pinned", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={!column.visible}
                    />
                    <label className="text-sm text-gray-700">Ghim cột bên trái</label>
                  </div>

                  {column.pinned && column.visible && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <div className="text-xs text-blue-700">
                        <Icons.Info size={12} className="inline mr-1" />
                        Vị trí sticky: {stickyPositions[column.id]}px từ trái
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex space-x-3">
            <button
              onClick={onReset}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Đặt lại mặc định
            </button>
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
