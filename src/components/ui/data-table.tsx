"use client";
"use no memo";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    autoWidth?: boolean;
    headerAlign?: "left" | "center" | "right";
    bodyAlign?: "left" | "center" | "right";
  }
}

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  type Updater,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTablePagination from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  sorting?: SortingState;
  setSorting?: (updater: Updater<SortingState>) => void;
  pagination?: PaginationState;
  setPagination?: (updater: Updater<PaginationState>) => void;
  rowCount?: number;
  isLoading?: boolean;
  manualSorting?: boolean;
  manualPagination?: boolean;
  emptyMessage?: string;
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const {
    columns,
    data,
    rowCount,
    setSorting,
    sorting,
    pagination,
    setPagination,
    isLoading,
    manualSorting = true,
    manualPagination,
    emptyMessage = "No results.",
  } = props;

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(pagination !== undefined && { getPaginationRowModel: getPaginationRowModel() }),
    ...(setSorting && { onSortingChange: setSorting }),
    ...(setPagination && { onPaginationChange: setPagination }),
    manualSorting: manualSorting,
    ...(manualPagination !== undefined && { manualPagination }),
    rowCount,
    columns,
    data,
    state: {
      ...(sorting !== undefined && { sorting }),
      ...(pagination !== undefined && { pagination }),
    },
  });

  return (
    <div>
      <div className="mb-4 overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-bold font-geist-sans text-foreground text-sm"
                      style={{
                        minWidth: header.column.columnDef.meta?.autoWidth
                          ? "auto"
                          : header.getSize(),
                        maxWidth: header.column.columnDef.meta?.autoWidth
                          ? "auto"
                          : header.getSize(),
                        width: header.column.columnDef.meta?.autoWidth ? "auto" : header.getSize(),
                        textAlign: header.column.columnDef.meta?.headerAlign || "left",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && table.getRowModel().rows?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-165 text-center">
                  Loading....
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        minWidth: cell.column.columnDef.meta?.autoWidth
                          ? "auto"
                          : cell.column.getSize(),
                        maxWidth: cell.column.columnDef.meta?.autoWidth
                          ? "auto"
                          : cell.column.getSize(),
                        width: cell.column.columnDef.meta?.autoWidth
                          ? "auto"
                          : cell.column.getSize(),
                        textAlign: cell.column.columnDef.meta?.bodyAlign || "left",
                      }}
                      className="h-12.45 whitespace-nowrap font-geist-sans font-medium text-sm"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-52 bg-background-hard text-center hover:bg-background-hard"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && setPagination && table.getPageCount() > 1 && (
        <DataTablePagination
          table={table}
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
        />
      )}
    </div>
  );
}
