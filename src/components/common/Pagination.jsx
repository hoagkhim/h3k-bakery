import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
    if (!totalItems && totalItems !== 0 && totalPages <= 1) return null; // Only for legacy fallbacks without proper props
    
    // Fallback variables for existing references
    const hasFullProps = totalItems !== undefined && itemsPerPage !== undefined;
    const startItem = hasFullProps ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = hasFullProps ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

    return (
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white shrink-0 mt-4 rounded-xl shadow-sm">
            {hasFullProps ? (
                <div className="text-sm font-medium text-gray-500">
                    Hiển thị {startItem} - {endItem} trong tổng số {totalItems} dữ liệu
                </div>
            ) : (
                <div className="text-sm font-medium text-gray-500">
                    Trang {currentPage} / {totalPages}
                </div>
            )}
            
            <div className="flex items-center gap-1">
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => onPageChange(currentPage - 1)} 
                    className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Hiển thị một lượng page vừa phải nếu có quá nhiều trang (tạm giữ logic đơn giản)
                    if (totalPages > 7) {
                        if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                            if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={page} className="px-1 text-gray-400">...</span>;
                            }
                            return null;
                        }
                    }

                    return (
                        <button 
                            key={page} 
                            onClick={() => onPageChange(page)} 
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page 
                                    ? 'bg-amber-600 text-white shadow-sm border-amber-600' 
                                    : 'border border-gray-200 text-gray-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button 
                    disabled={currentPage === totalPages || totalPages === 0} 
                    onClick={() => onPageChange(currentPage + 1)} 
                    className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
