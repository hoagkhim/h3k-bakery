import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-2 p-3 bg-white border-t border-amber-100 shrink-0">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-50 transition-colors"
            >
                &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
                        currentPage === page
                            ? 'bg-amber-800 text-white border-amber-800'
                            : 'border-amber-200 text-amber-700 hover:bg-amber-50'
                    }`}
                >
                    {page}
                </button>
            ))}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-50 transition-colors"
            >
                &gt;
            </button>
        </div>
    );
}
