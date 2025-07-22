"use client"

import { useState } from "react"
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
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (columnId: string) => {
    setExpandedItems(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    )
  }

  const isExpanded = (columnId: string) => expandedItems.includes(columnId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-96 shadow-xl settings-panel flex flex-col">
        <div className="flex-1 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Thiết lập bảng dữ liệu</h3>
              <p className="text-sm text-gray-500 mt-1">Tùy chỉnh hiển thị các cột</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Icons.X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {columns.map((column) => (
                <div key={column.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Collapsed Header */}
                  <div 
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => toggleExpanded(column.id)}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {/* Visibility Checkbox */}
                      <input
                        type="checkbox"
                        checked={column.visible}
                        onChange={(e) => {
                          e.stopPropagation()
                          onColumnChange(column.id, "visible", e.target.checked)
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                      />
                      
                      {/* Column Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{column.dataField}</div>
                        <div className="text-xs text-gray-500">Width: {column.width}px</div>
                      </div>

                      {/* Pin Icon */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onColumnChange(column.id, "pinned", !column.pinned)
                          }}
                          className={`p-1.5 rounded transition-colors ${
                            column.pinned 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-400 hover:text-blue-600'
                          }`}
                          title={column.pinned ? "Bỏ ghim" : "Ghim cột"}
                          disabled={!column.visible}
                        >
                          📌
                        </button>
                        
                        {/* Expand/Collapse Icon */}
                        <Icons.ChevronDown 
                          size={16} 
                          className={`text-gray-400 transition-transform ${
                            isExpanded(column.id) ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded(column.id) && (
                    <div className="p-3 border-t border-gray-200 bg-white space-y-3">
                      {/* Display Name and Width on same row */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={column.displayName}
                            onChange={(e) => onColumnChange(column.id, "displayName", e.target.value)}
                            placeholder="Tên hiển thị"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!column.visible}
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={column.width}
                            onChange={(e) => onColumnChange(column.id, "width", Number.parseInt(e.target.value) || 100)}
                            placeholder="Width"
                            min="50"
                            max="500"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!column.visible}
                          />
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Trường dữ liệu:</span> {column.dataField}
                        </div>
                        
                        {column.pinned && column.visible && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <div className="flex items-center space-x-1 text-xs text-blue-700">
                              <Icons.Info size={12} />
                              <span>Vị trí ghim: {stickyPositions[column.id] || 0}px</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <button
                onClick={onReset}
                className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đặt lại
              </button>
              <button 
                onClick={onClose} 
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}