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
      <div className="bg-white h-full w-96 shadow-2xl settings-panel flex flex-col">
        <div className="flex-1 flex flex-col h-full">
          {/* Header với gradient đẹp */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-1">Thiết lập bảng</h3>
                <p className="text-blue-100 text-sm">Tùy chỉnh hiển thị các cột</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
              >
                <Icons.X size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Content với scroll đẹp */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-3">
              {columns.map((column, index) => (
                <div 
                  key={column.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  {/* Header Panel - Thiết kế đẹp hơn */}
                  <div 
                    className={`flex items-center justify-between p-4 cursor-pointer transition-all duration-200 ${
                      isExpanded(column.id) 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => toggleExpanded(column.id)}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {/* Checkbox với style đẹp */}
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={column.visible}
                          onChange={(e) => {
                            e.stopPropagation()
                            onColumnChange(column.id, "visible", e.target.checked)
                          }}
                          className="w-5 h-5 rounded-md border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
                        />
                        {column.visible && (
                          <Icons.Check 
                            size={12} 
                            className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                          />
                        )}
                      </div>
                      
                      {/* Column Info với typography đẹp */}
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold truncate transition-colors ${
                          column.visible ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {column.displayName}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                            {column.dataField}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="font-medium">{column.width}px</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center space-x-2 ml-3">
                      {/* Pin button với style đẹp */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onColumnChange(column.id, "pinned", !column.pinned)
                        }}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          column.pinned 
                            ? 'bg-blue-100 text-blue-600 shadow-sm' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-blue-500'
                        }`}
                        title={column.pinned ? "Bỏ ghim cột" : "Ghim cột bên trái"}
                        disabled={!column.visible}
                      >
                        <Icons.Pin size={14} className={column.pinned ? 'rotate-45' : ''} />
                      </button>
                      
                      {/* Expand icon với animation */}
                      <div className={`p-1 transition-transform duration-200 ${
                        isExpanded(column.id) ? 'rotate-180' : ''
                      }`}>
                        <Icons.ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content với animation */}
                  {isExpanded(column.id) && (
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
                      <div className="space-y-4">
                        {/* Display Name và Width trên cùng dòng */}
                        <div className="grid grid-cols-5 gap-3">
                          <div className="col-span-3">
                            <input
                              type="text"
                              value={column.displayName}
                              onChange={(e) => onColumnChange(column.id, "displayName", e.target.value)}
                              placeholder="Tên hiển thị"
                              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                              disabled={!column.visible}
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="relative">
                              <input
                                type="number"
                                value={column.width}
                                onChange={(e) => onColumnChange(column.id, "width", Number.parseInt(e.target.value) || 100)}
                                placeholder="Width"
                                min="50"
                                max="500"
                                className="w-full px-3 py-2.5 pr-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                                disabled={!column.visible}
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                px
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info với card đẹp */}
                        <div className="space-y-3">
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <div className="flex items-center space-x-2 text-xs">
                              <Icons.Database size={12} className="text-blue-500" />
                              <span className="text-gray-600">Trường dữ liệu:</span>
                              <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-800 font-mono">
                                {column.dataField}
                              </code>
                            </div>
                          </div>
                          
                          {column.pinned && column.visible && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-xs">
                                <Icons.MapPin size={12} className="text-blue-600" />
                                <span className="text-blue-700 font-medium">
                                  Vị trí ghim: {stickyPositions[column.id] || 0}px từ trái
                                </span>
                              </div>
                            </div>
                          )}

                          {!column.visible && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-xs">
                                <Icons.EyeOff size={12} className="text-amber-600" />
                                <span className="text-amber-700">Cột này đang bị ẩn</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer với gradient và shadow */}
          <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
            <div className="flex space-x-3">
              <button
                onClick={onReset}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Icons.RotateCcw size={14} />
                <span>Đặt lại</span>
              </button>
              <button 
                onClick={onClose} 
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Icons.Check size={14} />
                <span>Áp dụng</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}