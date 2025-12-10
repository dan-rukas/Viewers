import * as React from 'react';
import { cn } from '../../../lib/utils';
import type { ColumnDef, SortingState, VisibilityState } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import {
  DataTable,
  DataTableToolbar,
  DataTableTitle,
  DataTableFilterRow,
  DataTableViewOptions,
  DataTablePagination,
  useDataTable,
} from '../../DataTable';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../Table';
import { ScrollArea } from '../../ScrollArea';
import { Button } from '../../Button';
import { Input } from '../../Input';
import { InputMultiSelect } from '../../InputMultiSelect';
import type { StudyRow } from '../StudyListTypes';
import { useStudyList } from '../headless/StudyListProvider';
import { tokenizeModalities } from '../../../lib/filters';
import type { WorkflowId } from '../WorkflowsInfer';
import { Icons } from '../../Icons';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../../HoverCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../Card';
import { Separator } from '../../Separator';

type Props = {
  columns: ColumnDef<StudyRow, unknown>[];
  data: StudyRow[];
  title?: React.ReactNode;
  getRowId?: (row: StudyRow, index: number) => string;
  initialSorting?: SortingState;
  initialVisibility?: VisibilityState;
  enforceSingleSelection?: boolean;
  showColumnVisibility?: boolean;
  tableClassName?: string;
  onSelectionChange?: (rows: StudyRow[]) => void;
  isPanelOpen?: boolean;
  onOpenPanel?: () => void;

  /** Slots to decouple visuals from the table for DS migration */
  toolbarLeft?: React.ReactNode;
  toolbarRightExtras?: React.ReactNode;
  /** Custom "open panel" button renderer (receives onOpenPanel) */
  renderOpenPanelButton?: (args: { onOpenPanel: () => void }) => React.ReactNode;
};

export function StudyListTable({
  columns,
  data,
  title,
  getRowId,
  initialSorting = [],
  initialVisibility = {},
  enforceSingleSelection = true,
  showColumnVisibility = true,
  tableClassName,
  onSelectionChange,
  isPanelOpen,
  onOpenPanel,
  toolbarLeft,
  toolbarRightExtras,
  renderOpenPanelButton,
}: Props) {
  return (
    <DataTable<StudyRow>
      data={data}
      columns={columns}
      getRowId={getRowId}
      initialSorting={initialSorting}
      initialVisibility={initialVisibility}
      enforceSingleSelection={enforceSingleSelection}
      onSelectionChange={onSelectionChange}
    >
      <Content
        title={title}
        showColumnVisibility={showColumnVisibility}
        tableClassName={tableClassName}
        isPanelOpen={isPanelOpen}
        onOpenPanel={onOpenPanel}
        toolbarLeft={toolbarLeft}
        toolbarRightExtras={toolbarRightExtras}
        renderOpenPanelButton={renderOpenPanelButton}
      />
    </DataTable>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" {...props}>
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
    </svg>
  );
}

function Content({
  title,
  showColumnVisibility,
  tableClassName,
  isPanelOpen,
  onOpenPanel,
  toolbarLeft,
  toolbarRightExtras,
  renderOpenPanelButton,
}: {
  title?: React.ReactNode;
  showColumnVisibility?: boolean;
  tableClassName?: string;
  isPanelOpen?: boolean;
  onOpenPanel?: () => void;
  toolbarLeft?: React.ReactNode;
  toolbarRightExtras?: React.ReactNode;
  renderOpenPanelButton?: (args: { onOpenPanel: () => void }) => React.ReactNode;
}) {
  const { table, setColumnFilters } = useDataTable<StudyRow>();
  const modalityOptions = React.useMemo(() => {
    const rows = (table.options?.data as StudyRow[]) ?? [];
    // Build a flat list of modality tokens across all rows.
    // tokenizeModalities uppercases and splits on whitespace/slash/comma to produce unique modality codes for filtering.
    const tokens = rows.flatMap(r => tokenizeModalities(String(r.modalities ?? '')));
    return Array.from(new Set(tokens)).sort();
  }, [table.options?.data]);
  // Access headless state for default workflow + launch
  const { defaultWorkflow, launch } = useStudyList<StudyRow, WorkflowId>();

  // Responsive column visibility based on viewport width
  React.useEffect(() => {
    const updateVisibility = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      if (isMobile) {
        // Mobile: Show only Patient, Description, Actions
        table.getColumn('mrn')?.toggleVisibility(false);
        table.getColumn('studyDateTime')?.toggleVisibility(false);
        table.getColumn('modalities')?.toggleVisibility(false);
        table.getColumn('accession')?.toggleVisibility(false);
        table.getColumn('instances')?.toggleVisibility(false);
      } else if (isTablet) {
        // Tablet: Add Study Date, Modalities
        table.getColumn('mrn')?.toggleVisibility(false);
        table.getColumn('studyDateTime')?.toggleVisibility(true);
        table.getColumn('modalities')?.toggleVisibility(true);
        table.getColumn('accession')?.toggleVisibility(false);
        table.getColumn('instances')?.toggleVisibility(false);
      } else {
        // Desktop: Show all
        table.getColumn('mrn')?.toggleVisibility(true);
        table.getColumn('studyDateTime')?.toggleVisibility(true);
        table.getColumn('modalities')?.toggleVisibility(true);
        table.getColumn('accession')?.toggleVisibility(true);
        table.getColumn('instances')?.toggleVisibility(true);
      }
    };

    updateVisibility();
    window.addEventListener('resize', updateVisibility);
    return () => window.removeEventListener('resize', updateVisibility);
  }, [table]);
  const renderColGroup = React.useCallback(
    () => (
      <colgroup>
        {table.getVisibleLeafColumns().map((col) => {
          const meta =
            (col.columnDef.meta as unknown as { minWidth?: number | string } | undefined) ??
            undefined;
          const minWidth = meta?.minWidth;
          return minWidth ? (
            <col key={col.id} style={{ width: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }} />
          ) : (
            <col key={col.id} />
          );
        })}
      </colgroup>
    ),
    [table]
  );

  return (
    <div className="flex h-full flex-col">
      {(showColumnVisibility || title) && (
        <DataTableToolbar>
          <div className="absolute left-0">{toolbarLeft}</div>
          {title ? <DataTableTitle>{title}</DataTableTitle> : null}
          <div className="absolute right-0 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-sm"
              onClick={() => {
                // TODO: Implement upload functionality
              }}
            >
              <Icons.Upload className="h-4 w-4" />
              Upload
            </Button>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 gap-1 text-sm"
                  onClick={() => {
                    // TODO: Implement cloud configuration functionality
                  }}
                >
                  <Icons.CloudSettings className="h-5 w-5" />
                  Source
                </Button>
              </HoverCardTrigger>
              <HoverCardContent
                align="center"
                className="w-72 p-0"
              >
                <Card className="border-0 shadow-none">
                  <CardHeader className="p-3 pb-1">
                    <CardDescription className="text-sm">
                      <span className="text-foreground font-semibold">Data Source:</span> Configure the server connection and storage settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 p-3 pt-0 text-sm">
                    <div className="col-span-2 my-2 h-px bg-input" />
                    <span className="text-muted-foreground">Server</span>
                    <span>Google Cloud</span>
                    <span className="text-muted-foreground">Project</span>
                    <span>OHIF Cloud Healthcare</span>
                    <span className="text-muted-foreground">Location</span>
                    <span>us-east4</span>
                    <span className="text-muted-foreground">Data set</span>
                    <span>ohif-qa-dataset</span>
                    <span className="text-muted-foreground">DICOM store</span>
                    <span>ohif-qa-1</span>
                  </CardContent>
                </Card>
              </HoverCardContent>
            </HoverCard>
            <div className="mr-2 h-4 w-px bg-input" />
            <DataTablePagination />
            {showColumnVisibility && (
              <DataTableViewOptions
                getLabel={(id) => {
                  const label = (
                    table.getColumn(id)?.columnDef.meta as { label?: string } | undefined
                  )?.label;
                  return label ?? id;
                }}
              />
            )}
            {toolbarRightExtras}
            {typeof onOpenPanel === 'function' && isPanelOpen === false ? (
              <div className="mt-1 ml-2">
                {renderOpenPanelButton ? (
                  renderOpenPanelButton({ onOpenPanel })
                ) : (
                  <Button variant="ghost" size="icon" aria-label="Open preview panel" onClick={onOpenPanel}>
                    <ChevronLeftIcon />
                  </Button>
                )}
              </div>
            ) : null}
          </div>
        </DataTableToolbar>
      )}
      <div className="border-input/50 min-h-0 flex-1 rounded-md border">
        <div className="flex h-full flex-col">
          <div className="shrink-0 border-b border-input/50">
            <Table className={cn('table-fixed', tableClassName)} containerClassName="overflow-x-hidden" noScroll>
              {renderColGroup()}
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={`bg-muted ${
                          ((header.column.columnDef.meta as unknown as { headerClassName?: string })
                            ?.headerClassName) ?? ''
                        }`}
                        aria-sort={(() => {
                          const s = header.column.getIsSorted() as false | 'asc' | 'desc';
                          return s === 'asc' ? 'ascending' : s === 'desc' ? 'descending' : 'none';
                        })()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <DataTableFilterRow
                  resetCellId="actions"
                  onReset={() => setColumnFilters([])}
                  excludeColumnIds={["instances"]}
                  renderCell={({ columnId, value, setValue }) => {
                    if (columnId === 'modalities') {
                      const selected = Array.isArray(value) ? (value as string[]) : [];
                      return (
                        <InputMultiSelect
                          options={modalityOptions}
                          value={selected}
                          onChange={(next) => setValue(next)}
                        >
                          <InputMultiSelect.Field>
                            <InputMultiSelect.Summary variant="single" />
                            <InputMultiSelect.Input ariaLabel="Filter Modalities" placeholder="" />
                          </InputMultiSelect.Field>
                          <InputMultiSelect.Content fitToContent maxWidth={185}>
                            <InputMultiSelect.Options />
                          </InputMultiSelect.Content>
                        </InputMultiSelect>
                      );
                    }
                    return (
                      <Input
                        value={String((value as string) ?? '')}
                        onChange={(e) => setValue(e.target.value)}
                        className="h-7 w-full"
                      />
                    );
                  }}
                />
              </TableBody>
            </Table>
          </div>
          <div className="min-h-0 flex-1">
            <ScrollArea className="h-full">
              <Table className={cn('table-fixed', tableClassName)} containerClassName="h-full" noScroll>
                {renderColGroup()}
                <TableBody>
                  {table.getPaginationRowModel().rows.length ? (
                    table.getPaginationRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() ? 'selected' : undefined}
                        onClick={(e) => {
                          // When a default workflow is set, do not allow a second click to unselect.
                          // Always select on click; otherwise toggle selection.
                          if (defaultWorkflow) {
                            if (!row.getIsSelected()) row.toggleSelected(true);
                          } else {
                            row.toggleSelected();
                          }
                        }}
                        onDoubleClick={(e) => {
                          if (!defaultWorkflow) return;
                          // Ensure the row is selected, then launch with the default workflow
                          if (!row.getIsSelected()) row.toggleSelected(true);
                          const original = row.original as StudyRow;
                          launch(original, defaultWorkflow as WorkflowId);
                        }}
                        aria-selected={row.getIsSelected()}
                        className="group cursor-pointer"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            // Keyboard behavior mirrors click: when default workflow is set,
                            // Enter/Space should select but not toggle to unselect.
                            if (defaultWorkflow) {
                              if (!row.getIsSelected()) row.toggleSelected(true);
                            } else {
                              row.toggleSelected();
                            }
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={
                              (
                                (cell.column.columnDef.meta as unknown as { cellClassName?: string }) ??
                                {}
                              ).cellClassName ?? ''
                            }
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={table.getAllLeafColumns().length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
