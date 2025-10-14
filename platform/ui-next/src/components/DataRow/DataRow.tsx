import React, { useState, useRef } from 'react';
import { Button } from '../../components/Button/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../components/DropdownMenu';
import { Icons } from '../../components/Icons/Icons';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../components/Tooltip/Tooltip';
import { cn } from '../../lib/utils';

/**
 * DataRow is a selectable, interactive row. It now derives "primary vs. secondary" selection
 * purely from DOM context using Tailwind group-data modifiers.
 *
 * - The **parent segmentation container** must provide: `class="group/seg"` and `data-state="active|inactive"`.
 *   (This matches the shadcn Sidebar pattern.)
 * - Each row sets `data-selected="true"` when the segment itself is selected.
 * - Primary selection visuals (highlight background/label/number) appear when:
 *     `group-data-[state=active]/seg` AND `group-data-[selected=true]/row`
 * - Secondary selection (selected but parent is inactive) shows a subtle `bg-primary/20` tint under the hover overlay:
 *     `group-data-[state=inactive]/seg` AND `group-data-[selected=true]/row`
 * - Actions/visibility are always visible only for **primary**; for secondary they remain on hover.
 */

/**
 * Props for the DataRow component
 */
interface DataRowProps {
  number: number | null;
  disableEditing: boolean;
  description: string;
  details?: { primary: string[]; secondary: string[] };
  /** Row selected state (segment active) irrespective of parent activeness */
  isSelected?: boolean;
  onSelect?: (e) => void;

  isVisible: boolean;
  onToggleVisibility: (e) => void;

  isLocked: boolean;
  onToggleLocked: (e) => void;

  title: string;
  onRename: (e) => void;

  onDelete: (e) => void;

  colorHex?: string;
  onColor: (e) => void;
  onCopy?: (e) => void;
  className?: string;
  children?: React.ReactNode;
}

const DataRowComponent: React.FC<DataRowProps> = ({
  number,
  title,
  colorHex,
  details,
  onSelect,
  isLocked,
  onToggleVisibility,
  onToggleLocked,
  onRename,
  onDelete,
  onColor,
  onCopy,
  isSelected = false,
  isVisible = true,
  disableEditing = false,
  className,
  children,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isTitleLong = title?.length > 25;
  const rowRef = useRef<HTMLDivElement>(null);

  // Extract Status components from children
  const statusComponents = React.Children.toArray(children).filter(
    child =>
      React.isValidElement(child) &&
      child.type &&
      (child.type as any).displayName?.startsWith('DataRow.Status')
  );

  const handleAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    switch (action) {
      case 'Rename':
        onRename(e);
        break;
      case 'Copy':
        onCopy?.(e);
        break;
      case 'Lock':
        onToggleLocked(e);
        break;
      case 'Delete':
        onDelete(e);
        break;
      case 'Color':
        onColor(e);
        break;
    }
  };

  const decodeHTML = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const renderDetailText = (text: string, indent: number = 0) => {
    const indentation = '  '.repeat(indent);
    if (text === '') {
      return (
        <div
          key={`empty-${indent}`}
          className="h-2"
        ></div>
      );
    }
    const cleanText = decodeHTML(text);
    return (
      <div
        key={cleanText}
        className="whitespace-pre-wrap"
      >
        {indentation}
        <span className="font-medium">{cleanText}</span>
      </div>
    );
  };

  const renderDetails = (details: string[]) => {
    const visibleLines = details.slice(0, 4);
    const hiddenLines = details.slice(4);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <div className="flex flex-col space-y-1">
              {visibleLines.map(line => renderDetailText(line, line.startsWith('  ') ? 1 : 0))}
            </div>
            {hiddenLines.length > 0 && (
              <div className="text-muted-foreground mt-1 flex items-center text-sm">
                <span>...</span>
                <Icons.Info className="mr-1 h-5 w-5" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="start"
          className="max-w-md"
        >
          <div className="text-secondary-foreground flex flex-col space-y-1 text-sm leading-normal">
            {details.map(line => renderDetailText(line, line.startsWith('  ') ? 1 : 0))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div
      ref={rowRef}
      className={cn('flex flex-col', !isVisible && 'opacity-60', className)}
    >
      <div
        className={cn(
          // Base row container
          'flex items-center bg-muted relative cursor-pointer overflow-hidden group/row',
          // Primary selection background only when panel type is active AND segmentation is active
          'group-data-[active=true]/type:group-data-[state=active]/seg:group-data-[selected=true]/row:bg-popover'
        )}
        onClick={onSelect}
        data-cy="data-row"
        // Mark this row's selected state for children via group-data modifiers
        data-selected={isSelected ? 'true' : undefined}
      >
        {/* Secondary Selection Tint (below hover overlay).
            Show when: (segmentation inactive) OR (panel type inactive), and the row itself is selected. */}
        <div className="bg-primary/20 pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity group-data-[state=inactive]/seg:group-data-[selected=true]/row:opacity-100 group-data-[active=false]/type:group-data-[selected=true]/row:opacity-100"></div>

        {/* Hover Overlay (sits above the tint) */}
        <div className="bg-primary/20 pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity group-hover/row:opacity-100"></div>

        {/* Number Box */}
        {number !== null && (
          <div
            className={cn(
              'flex h-7 max-h-7 w-7 flex-shrink-0 items-center justify-center rounded-l border-r border-black text-base overflow-hidden',
              // Base number styling
              'bg-muted text-muted-foreground',
              // Primary selection number highlight when panel type is active AND segmentation is active
              'group-data-[active=true]/type:group-data-[state=active]/seg:group-data-[selected=true]/row:bg-highlight',
              'group-data-[active=true]/type:group-data-[state=active]/seg:group-data-[selected=true]/row:text-black'
            )}
          >
            {number}
          </div>
        )}

        {/* add some space if there is not segment index */}
        {number === null && <div className="ml-1 h-7"></div>}

        {/* Color dot */}
        {colorHex && (
          <div className="flex h-7 w-5 items-center justify-center">
            <span
              className="ml-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: colorHex }}
            ></span>
          </div>
        )}

        {/* Label with Conditional Tooltip */}
        <div className="ml-2 flex-1 overflow-hidden">
          {isTitleLong ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    'cursor-default text-base [overflow:hidden] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
                    // Base label color
                    'text-muted-foreground',
                    // Primary selection label color highlight when panel type is active AND segmentation is active
                    'group-data-[active=true]/type:group-data-[state=active]/seg:group-data-[selected=true]/row:text-highlight'
                  )}
                >
                  {title}
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
              >
                {title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span
              className={cn(
                'text-base [overflow:hidden] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
                'text-muted-foreground',
                'group-data-[active=true]/type:group-data-[state=active]/seg:group-data-[selected=true]/row:text-highlight'
              )}
            >
              {title}
            </span>
          )}
        </div>

        {/* Actions and Visibility Toggle */}
        <div className="relative ml-2 flex items-center space-x-1">
          {/* Visibility Toggle Icon */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'h-6 w-6 transition-opacity opacity-0 group-hover/row:opacity-100',
              // Always visible if not visible (to allow bringing it back)
              !isVisible && 'opacity-100',
              // Always visible for **primary** selection (panel type active + segmentation active + row selected)
              'group-data-[active=true]/type:group-data-[state=active]/seg:group-data-[selected=true]/row:opacity-100'
            )}
            aria-label={isVisible ? 'Hide' : 'Show'}
            onClick={e => {
              e.stopPropagation();
              onToggleVisibility(e);
            }}
          >
            {isVisible ? <Icons.Hide className="h-6 w-6" /> : <Icons.Show className="h-6 w-6" />}
          </Button>

          {/* Lock Icon (if needed) */}
          {isLocked && !disableEditing && <Icons.Lock className="text-muted-foreground h-6 w-6" />}

          {/* Status Components */}
          {statusComponents}

          {/* Actions Dropdown Menu */}
          {disableEditing && <div className="h-6 w-6"></div>}
          {!disableEditing && (
            <DropdownMenu onOpenChange={open => setIsDropdownOpen(open)}>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    'h-6 w-6 transition-opacity opacity-0 group-hover/row:opacity-100',
                    // Visible while open
                    isDropdownOpen && 'opacity-100',
                    // Always visible for **primary** selection (panel type active + segmentation active + row selected)
                    'group-data-[active=true]/type:group-data-[state=active]/seg:group-data-[selected=true]/row:opacity-100'
                  )}
                  aria-label="Actions"
                  dataCY="actionsMenuTrigger"
                  onClick={e => e.stopPropagation()} // Prevent row selection on button click
                >
                  <Icons.More className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                // this was causing issue for auto focus on input dialog
                onCloseAutoFocus={e => e.preventDefault()}
              >
                <>
                  <DropdownMenuItem onClick={e => handleAction('Rename', e)}>
                    <Icons.Rename className="text-foreground" />
                    <span
                      className="pl-2"
                      data-cy="Rename"
                    >
                      Rename
                    </span>
                  </DropdownMenuItem>
                  {onCopy && (
                    <DropdownMenuItem onClick={e => handleAction('Copy', e)}>
                      <Icons.Copy className="text-foreground" />
                      <span
                        className="pl-2"
                        data-cy="Duplicate"
                      >
                        Duplicate
                      </span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={e => handleAction('Delete', e)}>
                    <Icons.Delete className="text-foreground" />
                    <span
                      className="pl-2"
                      data-cy="Delete"
                    >
                      Delete
                    </span>
                  </DropdownMenuItem>
                  {onColor && (
                    <DropdownMenuItem onClick={e => handleAction('Color', e)}>
                      <Icons.ColorChange className="text-foreground" />
                      <span
                        className="pl-2"
                        data-cy="Change Color"
                      >
                        Change Color
                      </span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={e => handleAction('Lock', e)}>
                    <Icons.Lock className="text-foreground" />
                    <span
                      className="pl-2"
                      data-cy="LockToggle"
                    >
                      {isLocked ? 'Unlock' : 'Lock'}
                    </span>
                  </DropdownMenuItem>
                </>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Details Section */}
      {details && (details.primary?.length > 0 || details.secondary?.length > 0) && (
        <div className="ml-7 px-2 py-2">
          <div className="text-secondary-foreground flex items-center gap-1 text-base leading-normal">
            {details.primary?.length > 0 && renderDetails(details.primary)}
            {details.secondary?.length > 0 && (
              <div className="text-muted-foreground ml-auto text-sm">
                {renderDetails(details.secondary)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatusProps {
  children: React.ReactNode;
}

interface StatusIndicatorProps {
  tooltip?: string;
  icon: React.ReactNode;
  defaultTooltip: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ tooltip, icon, defaultTooltip }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="flex h-6 w-6 items-center justify-center">{icon}</div>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <div>{tooltip || defaultTooltip}</div>
    </TooltipContent>
  </Tooltip>
);

const Status: React.FC<StatusProps> & {
  Warning: React.FC<{ tooltip?: string }>;
  Success: React.FC<{ tooltip?: string }>;
  Error: React.FC<{ tooltip?: string }>;
  Info: React.FC<{ tooltip?: string }>;
} = ({ children }) => {
  return <>{children}</>;
};

const StatusWarning: React.FC<{ tooltip?: string }> = ({ tooltip }) => (
  <StatusIndicator
    tooltip={tooltip}
    icon={
      <Icons.ByName
        name="status-alert"
        className="h-4 w-4 text-yellow-500"
      />
    }
    defaultTooltip="Warning"
  />
);

const StatusSuccess: React.FC<{ tooltip?: string }> = ({ tooltip }) => (
  <StatusIndicator
    tooltip={tooltip}
    icon={<Icons.Checked className="h-4 w-4 text-green-500" />}
    defaultTooltip="Success"
  />
);

const StatusError: React.FC<{ tooltip?: string }> = ({ tooltip }) => (
  <StatusIndicator
    tooltip={tooltip}
    icon={
      <Icons.ByName
        name="status-error"
        className="h-4 w-4 text-red-500"
      />
    }
    defaultTooltip="Error"
  />
);

const StatusInfo: React.FC<{ tooltip?: string }> = ({ tooltip }) => (
  <StatusIndicator
    tooltip={tooltip}
    icon={<Icons.Info className="h-4 w-4 text-blue-500" />}
    defaultTooltip="Info"
  />
);

Status.displayName = 'DataRow.Status';
StatusWarning.displayName = 'DataRow.Status.Warning';
StatusSuccess.displayName = 'DataRow.Status.Success';
StatusError.displayName = 'DataRow.Status.Error';
StatusInfo.displayName = 'DataRow.Status.Info';

Status.Warning = StatusWarning;
Status.Success = StatusSuccess;
Status.Error = StatusError;
Status.Info = StatusInfo;

const DataRow = DataRowComponent as React.FC<DataRowProps> & {
  Status: typeof Status;
};

DataRow.Status = Status;

export default DataRow;
export { DataRow };
