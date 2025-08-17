import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { LonghuBangItem } from '../types';
import { ChevronUp, ChevronDown, ChevronUpDown } from 'lucide-react';

interface LonghuBangTableProps {
  data: LonghuBangItem[];
}

const columnHelper = createColumnHelper<LonghuBangItem>();

const LonghuBangTable: React.FC<LonghuBangTableProps> = ({ data }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  // 格式化数字显示
  const formatNumber = (value: any) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (isNaN(num)) return value;
    
    if (Math.abs(num) >= 100000000) {
      return (num / 100000000).toFixed(2) + '亿';
    } else if (Math.abs(num) >= 10000) {
      return (num / 10000).toFixed(2) + '万';
    } else {
      return num.toFixed(2);
    }
  };

  // 格式化百分比
  const formatPercent = (value: any) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (isNaN(num)) return value;
    
    const color = num >= 0 ? 'text-red-500' : 'text-green-500';
    return <span className={color}>{num > 0 ? '+' : ''}{num.toFixed(2)}%</span>;
  };

  const columns = [
    columnHelper.accessor((row) => row.code || row['代码'], {
      id: 'code',
      header: '股票代码',
      cell: (info) => (
        <span className="font-mono text-sm">
          {info.getValue() || '-'}
        </span>
      ),
    }),
    columnHelper.accessor((row) => row.name || row['名称'], {
      id: 'name',
      header: '股票名称',
      cell: (info) => (
        <span className="font-medium">
          {info.getValue() || '-'}
        </span>
      ),
    }),
    columnHelper.accessor((row) => row.reason || row['解读'], {
      id: 'reason',
      header: '上榜原因',
      cell: (info) => (
        <span className="text-sm max-w-xs truncate" title={info.getValue()}>
          {info.getValue() || '-'}
        </span>
      ),
    }),
    columnHelper.accessor((row) => row.close_price || row['收盘价'], {
      id: 'close_price',
      header: '收盘价(元)',
      cell: (info) => formatNumber(info.getValue()),
    }),
    columnHelper.accessor((row) => row.change_percent || row['涨跌幅'], {
      id: 'change_percent',
      header: '涨跌幅',
      cell: (info) => formatPercent(info.getValue()),
    }),
    columnHelper.accessor((row) => row.amount || row['龙虎榜成交额'], {
      id: 'amount',
      header: '成交额',
      cell: (info) => (
        <span className="text-sm">
          {formatNumber(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor((row) => row.net_amount || row['净额'], {
      id: 'net_amount',
      header: '净额',
      cell: (info) => {
        const value = info.getValue();
        const num = Number(value);
        const color = num >= 0 ? 'text-red-500' : 'text-green-500';
        return (
          <span className={`text-sm ${color}`}>
            {formatNumber(value)}
          </span>
        );
      },
    }),
    columnHelper.accessor((row) => row.date || row['上榜日'], {
      id: 'date',
      header: '上榜日期',
      cell: (info) => (
        <span className="text-sm text-gray-500">
          {info.getValue() || '-'}
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className="w-full">
      {/* 搜索框 */}
      <div className="mb-4">
        <input
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="搜索股票名称..."
        />
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-1 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <span className="ml-1">
                            {{
                              asc: <ChevronUp className="w-4 h-4" />,
                              desc: <ChevronDown className="w-4 h-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ChevronUpDown className="w-4 h-4 text-gray-400" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            显示 {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} 到{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            条，共 {table.getFilteredRowModel().rows.length} 条记录
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LonghuBangTable;
