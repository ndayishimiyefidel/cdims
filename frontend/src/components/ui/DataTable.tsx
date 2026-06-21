import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Printer,
  Columns,
  CheckSquare,
  Square,
  FileSpreadsheet,
  FileText,
  Eye,
  EyeOff,
  X,
  FileDown,
  Loader2,
} from 'lucide-react';
import { Pagination } from './Pagination';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { SearchInput } from './SearchInput';

// Lazy dynamic imports for export libraries
let jsPDFPromise: Promise<any> | null = null;
let autoTablePromise: Promise<any> | null = null;
let XLSXPromise: Promise<any> | null = null;

const loadJsPDF = () => {
  if (!jsPDFPromise) {
    jsPDFPromise = import('jspdf').then(m => m.default || m);
  }
  return jsPDFPromise;
};

const loadAutoTable = () => {
  if (!autoTablePromise) {
    autoTablePromise = import('jspdf-autotable').then(m => m.default || m);
  }
  return autoTablePromise;
};

const loadXLSX = () => {
  if (!XLSXPromise) {
    XLSXPromise = import('xlsx').then(m => m.default || m);
  }
  return XLSXPromise;
};

// Load image from URL to base64 for PDF embedding
const imgToBase64 = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

export type SortDirection = 'asc' | 'desc';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  hidden?: boolean;
  exportable?: boolean;
  width?: string;
  minWidth?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  getValue?: (row: T) => any;
}

export interface ExportMeta {
  systemName?: string;
  systemContact?: string;
  systemAddress?: string;
  generatedBy?: string;
  logoUrl?: string;
}

export interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  searchable?: boolean;
  searchPlaceholder?: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  bulkActions?: {
    label: string;
    icon?: React.ElementType;
    variant?: 'danger' | 'primary' | 'default';
    onClick: (selectedIds: (string | number)[]) => void;
  }[];
  exportable?: boolean;
  exportFilename?: string;
  exportMeta?: ExportMeta;
  onExportCSV?: (rows: T[]) => void;
  onExportExcel?: (rows: T[]) => void;
  sortable?: boolean;
  defaultSortColumn?: string;
  defaultSortDirection?: SortDirection;
  onSort?: (column: string, direction: SortDirection) => void;
  columnVisibility?: boolean;
  stickyHeader?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T) => void;
}

function DataTable<T extends Record<string, any>>({
  columns: rawColumns,
  data,
  keyExtractor,
  loading = false,
  error = null,
  onRetry,
  pagination,
  searchable = false,
  searchPlaceholder = 'Search records...',
  searchTerm = '',
  onSearchChange,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  bulkActions = [],
  exportable = false,
  exportFilename = 'export',
  exportMeta,
  onExportCSV,
  onExportExcel,
  sortable = false,
  defaultSortColumn,
  defaultSortDirection,
  onSort,
  columnVisibility = false,
  stickyHeader = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no records to display.',
  emptyAction,
  className = '',
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const [internalSortColumn, setInternalSortColumn] = useState<string | undefined>(defaultSortColumn);
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>(defaultSortDirection || 'asc');
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(rawColumns.filter(c => !c.hidden).map(c => c.key))
  );
  const columnMenuRef = useRef<HTMLDivElement>(null);
  const columnBtnRef = useRef<HTMLButtonElement>(null);

  // Filter to only visible columns
  const columns = rawColumns.filter(c => visibleColumns.has(c.key));
  // Columns usable in exports (exclude non-exportable columns)
  const exportColumns = columns.filter(c => c.exportable !== false);

  // Sort data internally based on sort state
  const sortedData = useMemo(() => {
    if (!internalSortColumn || !sortable) return data;

    return [...data].sort((a, b) => {
      const col = rawColumns.find(c => c.key === internalSortColumn);
      if (!col) return 0;

      const aVal = col.getValue ? col.getValue(a) : a[internalSortColumn];
      const bVal = col.getValue ? col.getValue(b) : b[internalSortColumn];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison: number;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return internalSortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, internalSortColumn, internalSortDirection, sortable, rawColumns]);

  // Paginate data based on pagination state
  const currentPage = pagination?.page ?? 1;
  const currentPageSize = pagination?.pageSize ?? 10;
  const displayData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * currentPageSize;
    const end = start + currentPageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, currentPageSize]);

  const handleSort = useCallback((columnKey: string) => {
    const direction = internalSortColumn === columnKey && internalSortDirection === 'asc' ? 'desc' : 'asc';
    setInternalSortColumn(columnKey);
    setInternalSortDirection(direction);
    onSort?.(columnKey, direction);
  }, [internalSortColumn, internalSortDirection, onSort]);

  const toggleColumn = useCallback((columnKey: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(columnKey)) {
        next.delete(columnKey);
      } else {
        next.add(columnKey);
      }
      return next;
    });
  }, []);

  const toggleAllRows = useCallback(() => {
    if (!onSelectionChange) return;
    const visibleData = displayData;
    if (selectedRows.size === visibleData.length) {
      onSelectionChange(new Set());
    } else {
      // Select all visible (current page) items
      onSelectionChange(new Set(visibleData.map(d => keyExtractor(d))));
    }
  }, [keyExtractor, selectedRows, onSelectionChange, displayData]);

  const toggleRow = useCallback((id: string | number) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  }, [selectedRows, onSelectionChange]);

  // Close column menu on click outside and Escape key
  useEffect(() => {
    if (!showColumnMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        columnMenuRef.current &&
        !columnMenuRef.current.contains(e.target as Node) &&
        columnBtnRef.current &&
        !columnBtnRef.current.contains(e.target as Node)
      ) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnMenu]);

  // Reset to page 1 when current page becomes empty after filter/sort/pageSize change
  useEffect(() => {
    if (pagination && displayData.length === 0 && sortedData.length > 0) {
      const maxPage = Math.ceil(sortedData.length / pagination.pageSize);
      if (pagination.page > maxPage) {
        pagination.onPageChange(1);
      }
    }
  }, [pagination?.page, pagination?.pageSize, sortedData.length]);

  // ── Export helpers ──
  const exportRows = useMemo(() => {
    return data.map((row, idx) => {
      const obj: Record<string, any> = {};
      obj['No'] = idx + 1;
      exportColumns.forEach(col => {
        obj[col.header] = col.getValue ? col.getValue(row) : row[col.key] ?? '';
      });
      return obj;
    });
  }, [data, exportColumns]);

  const nowStr = useMemo(
    () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    []
  );
  const csvHeaderLines = useMemo(() => {
    const lines: string[] = [];
    if (exportMeta?.systemName) lines.push(`# ${exportMeta.systemName}`);
    if (exportMeta?.systemContact) lines.push(`# ${exportMeta.systemContact}`);
    if (exportMeta?.systemAddress) lines.push(`# ${exportMeta.systemAddress}`);
    return lines;
  }, [exportMeta]);
  const csvFooterLines = useMemo(() => {
    const lines: string[] = [];
    lines.push(`# Generated: ${nowStr}`);
    if (exportMeta?.generatedBy) lines.push(`# Generated by: ${exportMeta.generatedBy}`);
    return lines;
  }, [exportMeta, nowStr]);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    if (onExportCSV) {
      onExportCSV(data);
      return;
    }
    const headers = ['No', ...exportColumns.map(c => c.header)].join(',');
    const rows = data.map((row, idx) =>
      [idx + 1, ...exportColumns.map(col => {
        const value = col.getValue ? col.getValue(row) : row[col.key];
        const val = value ?? '';
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      })].join(',')
    );
    const csv = [...csvHeaderLines, headers, ...rows, '', '', '', '', '', '', '', ...csvFooterLines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFilename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportColumns, data, exportFilename, onExportCSV, csvHeaderLines, csvFooterLines]);

  // Export Excel (proper .xlsx using xlsx library)
  const [excelExporting, setExcelExporting] = useState(false);
  const handleExportExcel = useCallback(async () => {
    if (onExportExcel) {
      onExportExcel(data);
      return;
    }
    try {
      setExcelExporting(true);
      const XLSX = await loadXLSX();
      
      // Build worksheet with header info rows + data
      const numCols = exportColumns.length + 1; // +1 for the 'No' column
      const headerRows: any[][] = [];
      if (exportMeta?.systemName) headerRows.push([exportMeta.systemName]);
      if (exportMeta?.systemContact) headerRows.push([exportMeta.systemContact]);
      if (exportMeta?.systemAddress) headerRows.push([exportMeta.systemAddress]);
      // Add column headers
      headerRows.push(['No', ...exportColumns.map(c => c.header)]);
      
      // Build data rows as arrays
      const dataRows = data.map((row, idx) =>
        [idx + 1, ...exportColumns.map(col => {
          const value = col.getValue ? col.getValue(row) : row[col.key];
          return value ?? '';
        })]
      );
      
      // Build footer rows with spacing
      const footerRows: any[][] = [
        [], // blank row
        [], // blank row
        [], // blank row
        [], // blank row
        [], // blank row
        [], // blank row
        [`Generated: ${nowStr}`],
      ];
      if (exportMeta?.generatedBy) footerRows.push([`Generated by: ${exportMeta.generatedBy}`]);
      
      const allRows = [...headerRows, ...dataRows, ...footerRows];
      
      // Calculate range for merges (if systemName exists)
      const merges: any[] = [];
      for (let i = 0; i < headerRows.length - 1; i++) {
        // Skip blank row (it has empty cells)
        if (headerRows[i].length === 0) continue;
        // Check if this is a single-cell row that should be merged across all columns
        if (headerRows[i].length === 1) {
          merges.push({ s: { r: i, c: 0 }, e: { r: i, c: numCols - 1 } });
        }
      }
      
      const ws = XLSX.utils.aoa_to_sheet(allRows);
      ws['!merges'] = merges;
      
      // Style header rows (bold)
      // Note: xlsx doesn't directly support rich styling via utils,
      // but we can set cell types
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `${exportFilename}.xlsx`);
    } catch (err) {
      console.error('Excel export failed:', err);
      // Fallback to TSV
      const headers = exportColumns.map(c => c.header).join('\t');
      const rows = data.map(row =>
        exportColumns.map(col => {
          const value = col.getValue ? col.getValue(row) : row[col.key];
          return value ?? '';
        }).join('\t')
      );
      const tsv = [...csvHeaderLines, headers, ...rows, '', ...csvFooterLines].join('\n');
      const blob = new Blob([tsv], { type: 'text/tab-separated-values' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportFilename}.xls`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExcelExporting(false);
    }
  }, [exportColumns, data, exportFilename, onExportExcel, exportRows, csvHeaderLines, csvFooterLines, nowStr, exportMeta]);

  // Export PDF using jspdf + jspdf-autotable
  const [pdfExporting, setPdfExporting] = useState(false);
  const handleExportPDF = useCallback(async () => {
    try {
      setPdfExporting(true);
      const [jsPDF, autoTable] = await Promise.all([loadJsPDF(), loadAutoTable()]);
      const doc = new jsPDF('landscape');
      
      let startY = 10;
      
      // Try to load and embed logo
      let logoBase64: string | null = null;
      if (exportMeta?.logoUrl) {
        try {
          logoBase64 = await imgToBase64(exportMeta.logoUrl);
        } catch { /* ignore logo errors */ }
      }
      
      if (logoBase64) {
        doc.addImage(logoBase64, 'JPEG', 14, startY, 30, 20);
        // System name next to logo
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(exportMeta?.systemName || exportFilename, 50, startY + 8);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        if (exportMeta?.systemContact) {
          doc.text(exportMeta.systemContact, 50, startY + 14);
        }
        if (exportMeta?.systemAddress) {
          doc.text(exportMeta.systemAddress, 50, startY + 19);
        }
        doc.text(`Generated: ${nowStr}`, 50, startY + 24);
        startY = 38;
      } else {
        // No logo — just text header
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(exportMeta?.systemName || exportFilename, 14, startY + 5);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        let yOff = startY + 11;
        if (exportMeta?.systemContact) {
          doc.text(exportMeta.systemContact, 14, yOff);
          yOff += 5;
        }
        if (exportMeta?.systemAddress) {
          doc.text(exportMeta.systemAddress, 14, yOff);
          yOff += 5;
        }
        doc.text(`Generated: ${nowStr}`, 14, yOff);
        startY = yOff + 6;
      }
      
      // Table
      autoTable(doc, {
        head: [['No', ...exportColumns.map(c => c.header)]],
        body: data.map((row, idx) =>
          [idx + 1, ...exportColumns.map(col => {
            const value = col.getValue ? col.getValue(row) : row[col.key];
            return value ?? '';
          })]
        ),
        startY: startY,
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [56, 143, 186], fontSize: 8, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 20 },
      });

      // Add page numbers at the bottom of each page
      const pdfInternal = (doc as any).internal;
      const pageCount = pdfInternal?.getNumberOfPages?.() || 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }

      // Generated-by footer at bottom
      const finalY = (doc as any).lastAutoTable?.finalY || 50;
      if (exportMeta?.generatedBy) {
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated by: ${exportMeta.generatedBy}`, 14, finalY + 10);
      }

      doc.save(`${exportFilename}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setPdfExporting(false);
    }
  }, [exportColumns, data, exportFilename, exportMeta, nowStr]);

  // Print
  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const headers = `<th style="text-align:left;padding:8px 12px;border-bottom:2px solid #ddd;font-size:13px;font-weight:600;">No</th>${exportColumns.map(c => `<th style="text-align:left;padding:8px 12px;border-bottom:2px solid #ddd;font-size:13px;font-weight:600;">${c.header}</th>`).join('')}`;
    const rows = data.map((row, idx) =>
      `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:12px;">${idx + 1}</td>${exportColumns.map(col => {
        const value = col.getValue ? col.getValue(row) : row[col.key];
        return `<td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:12px;">${value ?? ''}</td>`;
      }).join('')}</tr>`
    ).join('');
    
    // Resolve logo URL — convert relative path to absolute for the new window
    const logoUrl = exportMeta?.logoUrl
      ? exportMeta.logoUrl.startsWith('http')
        ? exportMeta.logoUrl
        : `${window.location.origin}${exportMeta.logoUrl.startsWith('/') ? '' : '/'}${exportMeta.logoUrl}`
      : null;
    
    // Header with logo + system info
    let headerHtml = '';
    if (logoUrl) {
      headerHtml += `<img src="${logoUrl}" style="height:60px;float:left;margin-right:15px;margin-bottom:10px;" alt="Logo" />`;
    }
    headerHtml += `<h2 style="margin:0 0 3px;font-size:18px;">${exportMeta?.systemName || exportFilename}</h2>`;
    if (exportMeta?.systemContact) {
      headerHtml += `<p style="margin:0 0 2px;font-size:12px;color:#555;">${exportMeta.systemContact}</p>`;
    }
    if (exportMeta?.systemAddress) {
      headerHtml += `<p style="margin:0 0 2px;font-size:12px;color:#555;">${exportMeta.systemAddress}</p>`;
    }
    headerHtml += `<p style="margin:0 0 15px;font-size:11px;color:#888;">Generated: ${nowStr}</p>`;
    
    // Footer
    const footerHtml = exportMeta?.generatedBy
      ? `<div style="margin-top:20px;padding-top:10px;border-top:1px solid #ddd;font-size:11px;color:#666;"><p>Generated by: ${exportMeta.generatedBy}</p></div>`
      : '';
    
    printWindow.document.write(`
      <html><head><title>${exportFilename}</title>
      <style>
        body{font-family:-apple-system,sans-serif;padding:20px;}
        table{width:100%;border-collapse:collapse;}
        th{background:#f8f9fa;text-align:left;}
        .clearfix::after{content:"";clear:both;display:table;}
        @media print {
          @page {
            margin-bottom: 40px;
            @bottom-center {
              content: "Page " counter(page);
              font-size: 10px;
              color: #666;
              font-family: -apple-system, sans-serif;
            }
          }
        }
      </style>
      </head><body>
        <div class="clearfix">${headerHtml}</div>
        <table>${headers ? `<thead><tr>${headers}</tr></thead>` : ''}<tbody>${rows}</tbody></table>
        ${footerHtml}

      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [exportColumns, data, exportFilename, exportMeta, nowStr]);

  // ── Render table content ──
  const renderTableContent = () => {
    // Loading state with shimmer animation
    if (loading) {
      return (
        <tbody>
          {Array.from({ length: Math.min(pagination?.pageSize || 8, 8) }).map((_, i) => (
            <tr key={`skeleton-${i}`} className="border-b border-gray-50/80">
              {selectable && (
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-4 rounded" />
                </td>
              )}
              {columns.map(col => {
                const widths = ['w-20', 'w-24', 'w-16', 'w-28', 'w-32', 'w-12'];
                const w = widths[i % widths.length];
                return (
                  <td key={col.key} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer rounded ${w}`} />
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      );
    }

    // Error state
    if (error) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Failed to load data</p>
                <p className="text-xs text-gray-500 mb-3">{error}</p>
                {onRetry && (
                  <button onClick={onRetry} className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors">
                    Retry
                  </button>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    // Empty page (e.g., after filter change while on page > 1) — show loading until useEffect resets page
    if (displayData.length === 0 && sortedData.length > 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-8">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    // Empty state
    if (sortedData.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-8">
              <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                action={emptyAction?.label ? { label: emptyAction.label, onClick: emptyAction.onClick } : undefined}
              />
            </td>
          </tr>
        </tbody>
      );
    }

    // Data rows
    return (
      <tbody>
        {displayData.map((row, index) => {
          const id = keyExtractor(row);
          const isSelected = selectedRows.has(id);
          const rowCls = typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName;

          return (
            <tr
              key={id}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-gray-50 transition-colors ${isSelected ? 'bg-primary-50/50' : 'hover:bg-gray-50'} ${onRowClick ? 'cursor-pointer' : ''} ${rowCls || ''}`}
            >
              {selectable && (
                <td className="px-4 py-3 w-10" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => toggleRow(id)}
                    className="text-gray-400 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded"
                    aria-label={isSelected ? 'Deselect row' : 'Select row'}
                  >
                    {isSelected ? <CheckSquare className="w-4 h-4 text-primary-600" /> : <Square className="w-4 h-4" />}
                  </button>
                </td>
              )}
              {columns.map(col => {
                const value = col.getValue ? col.getValue(row) : row[col.key];
                return (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-sm text-gray-600"
                    style={{ width: col.width, minWidth: col.minWidth }}
                  >
                    {col.render ? col.render(value, row, index) : (value ?? '-')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {/* Toolbar */}
      {(searchable || exportable || columnVisibility || bulkActions.length > 0 || (selectable && selectedRows.size > 0)) && (
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Bulk actions */}
            {selectable && selectedRows.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {selectedRows.size} selected
                </span>
                {bulkActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => action.onClick(Array.from(selectedRows))}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        action.variant === 'danger'
                          ? 'text-red-600 bg-red-50 hover:bg-red-100'
                          : action.variant === 'primary'
                          ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                          : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {action.label}
                    </button>
                  );
                })}
                <button
                  onClick={() => onSelectionChange?.(new Set())}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Page size selector - left side above name column */}
            {pagination?.onPageSizeChange && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 font-medium whitespace-nowrap">Show</label>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                  className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer hover:border-gray-300 transition-colors"
                  aria-label="Items per page"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Search */}
            {searchable && onSearchChange && (
              <div className="relative">
                <SearchInput
                  value={searchTerm}
                  onChange={onSearchChange}
                  placeholder={searchPlaceholder}
                />
              </div>
            )}

            {/* Export */}
            {exportable && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleExportCSV}
                  className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Export CSV"
                  aria-label="Export CSV"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExportExcel}
                  disabled={excelExporting}
                  className={`p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors ${excelExporting ? 'opacity-50 cursor-wait' : ''}`}
                  title="Export Excel"
                  aria-label="Export Excel"
                >
                  {excelExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={pdfExporting}
                  className={`p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors ${pdfExporting ? 'opacity-50 cursor-wait' : ''}`}
                  title="Export PDF"
                  aria-label="Export PDF"
                >
                  {pdfExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  title="Print"
                  aria-label="Print"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Column visibility */}
            {columnVisibility && (
              <div className="relative">
                <button
                  ref={columnBtnRef}
                  onClick={() => setShowColumnMenu(prev => !prev)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Toggle columns"
                  aria-label="Toggle columns visibility"
                  aria-expanded={showColumnMenu}
                >
                  <Columns className="w-4 h-4" />
                </button>
                {showColumnMenu && (
                  <div
                    ref={columnMenuRef}
                    role="menu"
                    className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-gray-100 shadow-lg z-50 py-1 animate-dropdown-in"
                    onKeyDown={(e) => { if (e.key === 'Escape') setShowColumnMenu(false); }}
                  >
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Toggle Columns
                    </div>
                    {rawColumns.map(col => (
                      <button
                        key={col.key}
                        role="menuitem"
                        onClick={() => toggleColumn(col.key)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {visibleColumns.has(col.key) ? (
                          <Eye className="w-3.5 h-3.5 text-primary-500" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-gray-300" />
                        )}
                        {col.header}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={`overflow-x-auto ${stickyHeader ? 'max-h-[600px] overflow-y-auto' : ''}`}>
        <table className="w-full border-collapse" role={sortable || selectable ? 'grid' : undefined} aria-label="Data table">
          <thead>
            <tr className={`bg-gray-50/80 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
              {selectable && (
                <th className="px-4 py-3 w-10 text-left">
                  <button
                    onClick={toggleAllRows}
                    className="text-gray-400 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded"
                    aria-label={selectedRows.size === data.length ? 'Deselect all rows' : 'Select all rows'}
                  >
                    {selectedRows.size === displayData.length && displayData.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-primary-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.sortable && sortable ? 'cursor-pointer select-none hover:bg-gray-100 transition-colors' : ''}`}
                  style={{ width: col.width, minWidth: col.minWidth }}
                  onClick={() => col.sortable && sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && sortable && (
                      <span className="text-gray-300">
                        {internalSortColumn === col.key ? (
                          internalSortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-primary-500" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-primary-500" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {renderTableContent()}
        </table>
      </div>

      {/* Pagination */}
      {pagination && !loading && data.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-gray-400">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total / pagination.pageSize)}
              onPageChange={pagination.onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
