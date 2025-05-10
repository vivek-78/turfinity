"use client";

import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";

// import { useReactTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import type { CSSProperties } from "react";

import "./index.css";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "~/components/ui/button";

import { cn } from "~/lib/utils";

import type {
  Column,
  ColumnDef,
  ColumnResizeDirection,
  ColumnResizeMode,
  RowSelectionState,
  SortingState
} from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  paginationRequired?: boolean;
  pageSize?: number;
  leftPin?: string[];
  rightPin?: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  paginationRequired = false,
  pageSize = 10,
  rightPin = [],
  leftPin = []
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [columnResizeDirection, setColumnResizeDirection] = useState<ColumnResizeDirection>("ltr");
  const table = useReactTable({
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize
      },
      columnPinning: {
        left: leftPin,
        right: rightPin
      }
    },
    data,
    columns,
    onSortingChange: setSorting,
    columnResizeMode,
    columnResizeDirection,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    autoResetPageIndex: false,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const rowCount = table.getFilteredRowModel().rows.length; // Getting the number of filtered rows
  const startRow = pageIndex * pageSize + 1; // Calculating the starting row number
  const endRow = Math.min(startRow + pageSize - 1, rowCount);

  const getCommonPinningStyles = (column: Column<TData, unknown>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn = isPinned === "right" && column.getIsFirstColumn("right");
    console.log(`${column.getStart("right")}px`);

    return {
      boxShadow: "0px 0 0px 0px gray inset",
      // left: isPinned === "left" ? `0px` : undefined,
      // right: isPinned === "right" ? `0px` : undefined,
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getStart("right")}px` : undefined,
      opacity: isPinned ? 1 : 1,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 10 : 0,
      margin: isPinned ? "0" : undefined
    };
  };

  return (
    <div className="h-full w-full">
      <div className="rounded-md border">
        <Table className="pb-2">
          <TableHeader
            style={{
              position: "relative"
            }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn("relative bg-background")}
                      style={{
                        width: header.getSize(),
                        position: "relative",
                        ...getCommonPinningStyles(header.column)
                      }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${table.options.columnResizeDirection} ${
                            header.column.getIsResizing() ? "isResizing" : ""
                          }`,
                          style: {
                            transform:
                              columnResizeMode === "onEnd" && header.column.getIsResizing()
                                ? `translateX(${
                                    (table.options.columnResizeDirection === "rtl" ? -1 : 1) *
                                    (table.getState().columnSizingInfo.deltaOffset ?? 0)
                                  }px)`
                                : ""
                          }
                        }}
                      />
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="bg-background"
                      style={{
                        width: cell.column.getSize(),
                        ...getCommonPinningStyles(cell.column)
                      }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {paginationRequired && (
        <div className="flex items-center justify-between">
          <div className="ml-1 flex-1 text-sm text-muted-foreground">
            {/* Showing the current range of displayed results */}
            Showing {startRow}-{endRow} of {rowCount} results.
          </div>
          <div className="flex items-center justify-end space-x-2 py-2">
            <Button
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={() => table.previousPage()} // Navigate to previous page
              disabled={!table.getCanPreviousPage()}>
              <ChevronLeft size={14} />
            </Button>
            <p className="text-sm">Page {pageIndex + 1} </p> {/* Displaying current page number */}
            <Button
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={() => table.nextPage()} // Navigate to next page
              disabled={!table.getCanNextPage()}>
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
