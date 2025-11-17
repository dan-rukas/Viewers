import * as React from 'react'
import type {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  PaginationState,
} from '@tanstack/react-table'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { DataTableContext } from './context'

type Props<TData> = {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  getRowId?: (row: TData, index: number) => string
  initialSorting?: SortingState
  initialVisibility?: VisibilityState
  initialFilters?: ColumnFiltersState
  initialPagination?: PaginationState
  enforceSingleSelection?: boolean
  onSelectionChange?: (rows: TData[]) => void
  onFiltersChange?: (filters: ColumnFiltersState) => void
  onSortingStateChange?: (sorting: SortingState) => void
  onPaginationChange?: (pagination: PaginationState) => void
  children: React.ReactNode
}

export function DataTable<TData>({
  data,
  columns,
  getRowId,
  initialSorting = [],
  initialVisibility = {},
  initialFilters = [],
  initialPagination,
  enforceSingleSelection = true,
  onSelectionChange,
  onFiltersChange,
  onSortingStateChange,
  onPaginationChange,
  children,
}: Props<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialVisibility)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialFilters)
  const [pagination, setPagination] = React.useState<PaginationState>(initialPagination ?? { pageIndex: 0, pageSize: 50 })

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: !enforceSingleSelection,
    getRowId,
  })

  // When filters, sorting, or incoming data change, go back to the first page
  // Skip this behavior on initial mount to honor an `initialPagination` passed in
  const didInitRef = React.useRef(false)
  React.useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true
      return
    }
    setPagination(p => ({ ...p, pageIndex: 0 }))
  }, [columnFilters, sorting, data])

  React.useEffect(() => {
    if (!onSelectionChange) return
    const selected = table.getSelectedRowModel().rows.map((r) => r.original as TData)
    onSelectionChange(selected)
  }, [rowSelection, onSelectionChange, table])

  // Notify parent of state changes (optional)
  React.useEffect(() => {
    onFiltersChange?.(columnFilters)
  }, [columnFilters, onFiltersChange])

  React.useEffect(() => {
    onSortingStateChange?.(sorting)
  }, [sorting, onSortingStateChange])

  React.useEffect(() => {
    onPaginationChange?.(pagination)
  }, [pagination, onPaginationChange])

  const value = React.useMemo(
    () => ({
      table,
      sorting,
      setSorting,
      columnVisibility,
      setColumnVisibility,
      rowSelection,
      setRowSelection,
      columnFilters,
      setColumnFilters,
      pagination,
      setPagination,
      resetFilters: () => setColumnFilters([]),
    }),
    [table, sorting, columnVisibility, rowSelection, columnFilters, pagination]
  )

  return <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>
}

