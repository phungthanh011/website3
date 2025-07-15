import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Search, Filter, Building2, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';
  
interface Company {
  id: string;
  companyCode: string;
  companyName: string;
  companyType: string;
  accountNumber: string;
  taxCode: string;
  province: string;
  address: string;
  stockCalculationMode: string;
  directorName?: string;
  business?: string;
  businessCondition?: string;
  businessType?: string;
  telephone?: string;
  fax?: string;
  businessOpening?: string;
}

const companyTypes = [
  'Công ty TNHH',
  'Công ty Cổ phần',
  'Doanh nghiệp tư nhân',
  'Công ty Hợp danh',
  'Doanh nghiệp nhà nước'
];

const provinces = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông'
];

const stockCalculationModes = [
  'FIFO (First In First Out)',
  'LIFO (Last In First Out)',
  'Bình quân gia quyền',
  'Giá thực tế đích danh'
];

const businessTypes = [
  'Sản xuất',
  'Thương mại',
  'Dịch vụ',
  'Xây dựng',
  'Vận tải',
  'Tài chính - Ngân hàng',
  'Công nghệ thông tin',
  'Khác'
];

const mockCompanies: Company[] = [
  {
    id: '1',
    companyCode: 'ABC001',
    companyName: 'Công ty TNHH ABC Technology',
    companyType: 'Công ty TNHH',
    accountNumber: '1234567890',
    taxCode: '0123456789',
    province: 'Hà Nội',
    address: '123 Đường ABC, Quận Ba Đình, Hà Nội',
    stockCalculationMode: 'FIFO (First In First Out)',
    directorName: 'Nguyễn Văn A',
    business: 'Phát triển phần mềm',
    businessCondition: 'Hoạt động bình thường',
    businessType: 'Công nghệ thông tin',
    telephone: '024-1234-5678',
    fax: '024-1234-5679',
    businessOpening: '2020-01-15'
  },
  {
    id: '2',
    companyCode: 'XYZ002',
    companyName: 'Công ty Cổ phần XYZ Trading',
    companyType: 'Công ty Cổ phần',
    accountNumber: '9876543210',
    taxCode: '9876543210',
    province: 'TP. Hồ Chí Minh',
    address: '456 Đường XYZ, Quận 1, TP. Hồ Chí Minh',
    stockCalculationMode: 'Bình quân gia quyền',
    directorName: 'Trần Thị B',
    business: 'Xuất nhập khẩu',
    businessCondition: 'Hoạt động tốt',
    businessType: 'Thương mại',
    telephone: '028-9876-5432',
    fax: '028-9876-5433',
    businessOpening: '2018-06-20'
  }
];

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'view' | 'edit'>('add');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.companyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.taxCode.includes(searchTerm)
  );

  const openModal = (mode: 'add' | 'view' | 'edit', company?: Company) => {
    setModalMode(mode);
    setSelectedCompany(company || null);
    setFormData(company || {});
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
    setFormData({});
    setCurrentStep(1);
  };

  const handleInputChange = (field: keyof Company, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const requiredFields = ['companyCode', 'companyName', 'companyType', 'accountNumber', 'taxCode', 'province', 'address', 'stockCalculationMode'];
    return requiredFields.every(field => formData[field as keyof Company]?.toString().trim());
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newCompany: Company = {
        id: Date.now().toString(),
        companyCode: formData.companyCode || '',
        companyName: formData.companyName || '',
        companyType: formData.companyType || '',
        accountNumber: formData.accountNumber || '',
        taxCode: formData.taxCode || '',
        province: formData.province || '',
        address: formData.address || '',
        stockCalculationMode: formData.stockCalculationMode || '',
        directorName: formData.directorName,
        business: formData.business,
        businessCondition: formData.businessCondition,
        businessType: formData.businessType,
        telephone: formData.telephone,
        fax: formData.fax,
        businessOpening: formData.businessOpening
      };
      setCompanies(prev => [...prev, newCompany]);
    } else if (modalMode === 'edit' && selectedCompany) {
      setCompanies(prev => prev.map(company => 
        company.id === selectedCompany.id 
          ? { ...company, ...formData }
          : company
      ));
    }
    closeModal();
  };

  const handleDelete = (companyId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công ty này?')) {
      setCompanies(prev => prev.filter(company => company.id !== companyId));
    }
  };

  const isViewMode = modalMode === 'view';
  const canProceedToStep2 = validateStep1();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className=" sm:flex  items-center justify-between mb-6">
          <div className="flex items-center space-x-4 pb-3 md:pb-0">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quản lý Công ty</h2>
              <p className="text-gray-600 mt-1">Quản lý thông tin các công ty trong hệ thống</p>
            </div>
          </div>
          <button
            onClick={() => openModal('add')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Thêm công ty</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên công ty, mã công ty hoặc mã số thuế..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} className="text-gray-400" />
            <span className="text-gray-700">Lọc</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Mã công ty</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tên công ty</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Loại hình</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Mã số thuế</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tỉnh/Thành phố</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Phương thức tính kho</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{company.companyCode}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{company.companyName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {company.companyType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900">{company.taxCode}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900">{company.province}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900">{company.stockCalculationMode}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openModal('view', company)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openModal('edit', company)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-8">
              <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Không tìm thấy công ty nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {modalMode === 'add' && 'Thêm công ty mới'}
                  {modalMode === 'view' && 'Thông tin công ty'}
                  {modalMode === 'edit' && 'Chỉnh sửa thông tin công ty'}
                </h3>
                {!isViewMode && (
                  <div className="flex items-center mt-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        1
                      </div>
                      <span className={`text-sm hidden md:block ${currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                        Thông tin bắt buộc
                      </span>
                    </div>
                    <div className={`w-8 h-0.5 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        2
                      </div>
                      <span className={`text-sm hidden md:block ${currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                        Thông tin bổ sung
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Step 1: Required Information */}
              {(currentStep === 1 || isViewMode) && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 hidden md:flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Thông tin bắt buộc
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mã công ty <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.companyCode || ''}
                          onChange={(e) => handleInputChange('companyCode', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Nhập mã công ty"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên công ty <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.companyName || ''}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Nhập tên công ty"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại hình công ty <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.companyType || ''}
                          onChange={(e) => handleInputChange('companyType', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        >
                          <option value="">Chọn loại hình công ty</option>
                          {companyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số tài khoản <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.accountNumber || ''}
                          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Nhập số tài khoản"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mã số thuế <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.taxCode || ''}
                          onChange={(e) => handleInputChange('taxCode', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Nhập mã số thuế"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.province || ''}
                          onChange={(e) => handleInputChange('province', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          {provinces.map(province => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={isViewMode}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Nhập địa chỉ công ty"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phương thức tính kho <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.stockCalculationMode || ''}
                          onChange={(e) => handleInputChange('stockCalculationMode', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        >
                          <option value="">Chọn phương thức tính kho</option>
                          {stockCalculationModes.map(mode => (
                            <option key={mode} value={mode}>{mode}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Additional Information */}
              {(currentStep === 2 || isViewMode) && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Thông tin bổ sung
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên giám đốc
                        </label>
                        <input
                          type="text"
                          value={formData.directorName || ''}
                          onChange={(e) => handleInputChange('directorName', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Nhập tên giám đốc"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngành nghề kinh doanh
                        </label>
                        <input
                          type="text"
                          value={formData.business || ''}
                          onChange={(e) => handleInputChange('business', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Nhập ngành nghề kinh doanh"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Điều kiện kinh doanh
                        </label>
                        <input
                          type="text"
                          value={formData.businessCondition || ''}
                          onChange={(e) => handleInputChange('businessCondition', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Nhập điều kiện kinh doanh"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại hình kinh doanh
                        </label>
                        <select
                          value={formData.businessType || ''}
                          onChange={(e) => handleInputChange('businessType', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        >
                          <option value="">Chọn loại hình kinh doanh</option>
                          {businessTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          value={formData.telephone || ''}
                          onChange={(e) => handleInputChange('telephone', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số fax
                        </label>
                        <input
                          type="tel"
                          value={formData.fax || ''}
                          onChange={(e) => handleInputChange('fax', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Nhập số fax"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày thành lập
                        </label>
                        <input
                          type="date"
                          value={formData.businessOpening || ''}
                          onChange={(e) => handleInputChange('businessOpening', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                {!isViewMode && currentStep === 2 && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span>Quay lại</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isViewMode ? 'Đóng' : 'Hủy'}
                </button>
                
                {!isViewMode && (
                  <>
                    {currentStep === 1 && (
                      <button
                        onClick={handleNext}
                        disabled={!canProceedToStep2}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          canProceedToStep2
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span>Tiếp theo</span>
                        <ChevronRight size={16} />
                      </button>
                    )}
                    
                    {currentStep === 2 && (
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save size={16} />
                        <span>{modalMode === 'add' ? 'Thêm' : 'Lưu'}</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}