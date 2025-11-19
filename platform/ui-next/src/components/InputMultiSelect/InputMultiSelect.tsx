import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../lib/utils';
import { Input } from '../Input';
import { Command, CommandList, CommandGroup, CommandItem } from '../Command/Command';
import { Badge } from '../Badge';

type Option = string | { value: string; label?: string };

export type InputMultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (next: string[]) => void;

  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  closeOnSelect?: boolean;
  debounceMs?: number;
  ariaLabel?: string;
};

function normalizeOption(opt: Option): { value: string; label: string } {
  if (typeof opt === 'string') return { value: opt, label: opt };
  return { value: opt.value, label: opt.label ?? opt.value };
}

export function InputMultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled,
  className,
  inputClassName,
  closeOnSelect = true,
  debounceMs = 150,
  ariaLabel,
}: InputMultiSelectProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const fieldRef = React.useRef<HTMLDivElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [pending, setPending] = React.useState<string[] | null>(null);

  // Derived map for quick lookup
  const selectedSet = React.useMemo(() => new Set((value ?? []).map(v => String(v))), [value]);
  const normalized = React.useMemo(() => options.map(normalizeOption), [options]);
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return normalized;
    return normalized.filter(opt =>
      opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q)
    );
  }, [normalized, query]);

  // Outside click handler to close the list (consider both field and overlay as inside)
  React.useEffect(() => {
    function handleDoc(event: MouseEvent) {
      const target = event.target as Node | null;
      const fieldEl = containerRef.current;
      const dropEl = overlayRef.current;
      if (!target) return;
      if (fieldEl?.contains(target)) return; // click inside field
      if (dropEl?.contains(target)) return; // click inside dropdown
      setOpen(false);
    }
    document.addEventListener('mousedown', handleDoc);
    return () => document.removeEventListener('mousedown', handleDoc);
  }, []);

  // Positioning for portal dropdown (fixed positioning)
  const [coords, setCoords] = React.useState<{ left: number; top: number; width: number; maxHeight: number } | null>(null);
  const measure = React.useCallback(() => {
    const anchor = fieldRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const gutter = 8;
    const bottomSpace = window.innerHeight - rect.bottom;
    const topSpace = rect.top;
    const preferBelow = bottomSpace >= topSpace;
    const available = preferBelow ? bottomSpace : topSpace;
    const maxHeight = Math.max(120, Math.min(300, available - gutter));
    const top = preferBelow ? rect.bottom : Math.max(0, rect.top - maxHeight);
    setCoords({ left: rect.left, top, width: rect.width, maxHeight });
  }, []);

  React.useLayoutEffect(() => {
    if (open) measure();
  }, [open, measure, query, value]);

  React.useEffect(() => {
    if (!open) return;
    const handler = () => measure();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [open, measure]);

  // Debounced emit for onChange to avoid floods during quick interactions
  React.useEffect(() => {
    if (!pending) return;
    const id = setTimeout(() => {
      onChange(pending);
      setPending(null);
    }, Math.max(0, debounceMs));
    return () => clearTimeout(id);
  }, [pending, debounceMs, onChange]);

  const commit = React.useCallback((next: string[]) => {
    // Flush immediately if debounce is 0
    if (!debounceMs) return onChange(next);
    setPending(next);
  }, [debounceMs, onChange]);

  const remove = React.useCallback((val: string) => {
    const next = (value ?? []).filter(v => v !== val);
    commit(next);
  }, [value, commit]);

  const toggle = React.useCallback((val: string) => {
    const exists = selectedSet.has(val);
    const next = exists ? (value ?? []).filter(v => v !== val) : [...(value ?? []), val];
    commit(next);
    // Clear the inline search text after a selection to avoid leftover filters
    setQuery('');
    if (closeOnSelect) {
      setOpen(false);
      // return focus to the input for repeated interactions
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [selectedSet, value, commit, closeOnSelect]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Tokenized input wrapper styled like <Input>, containing badges + slim input */}
      <div
        ref={fieldRef}
        className={cn(
          // mirror Input styling on a container; use focus-within to show ring
          'border-input text-foreground bg-background hover:bg-primary/10 focus-within:ring-ring flex min-h-7 w-full flex-wrap items-center gap-1 rounded border px-1.5 py-0.5 text-base shadow-sm transition-colors focus-within:outline-none focus-within:ring-1',
          disabled ? 'opacity-50 pointer-events-none' : ''
        )}
        role="group"
        onClick={() => inputRef.current?.focus()}
      >
        {value && value.length > 0
          ? value.map(val => {
              const lab = normalized.find(o => o.value === val)?.label ?? val;
              return (
                <Badge key={val} variant="secondary" className="flex items-center gap-1">
                  <span className="truncate max-w-[120px]" title={lab}>{lab}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${lab} filter`}
                    className="cursor-pointer select-none opacity-80 hover:opacity-100"
                    onClick={() => remove(val)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); remove(val); } }}
                  >
                    ×
                  </span>
                </Badge>
              );
            })
          : null}

        {/* Slim input inside the chip field */}
        <Input
          ref={inputRef}
          aria-label={ariaLabel}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          className={cn('h-6 min-w-[4ch] flex-1 border-0 bg-transparent px-1 py-0 shadow-none focus-visible:ring-0', inputClassName)}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
            if (e.key === 'Backspace' && query === '' && value.length > 0) {
              // remove last token when query is empty
              remove(value[value.length - 1]);
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
              // Move focus to first item in the list
              requestAnimationFrame(() => {
                const first = (overlayRef.current?.querySelector('[cmdk-item]') || containerRef.current?.querySelector('[cmdk-item]')) as HTMLElement | null;
                first?.focus();
              });
            }
          }}
        />
      </div>

      {open && !disabled && coords
        ? createPortal(
            <div
              ref={overlayRef}
              className="z-[1000] mt-1 rounded-md border border-input bg-popover shadow-md"
              style={{ position: 'fixed', left: coords.left, top: coords.top, width: coords.width, maxHeight: coords.maxHeight, overflow: 'auto' }}
              onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
            >
              <Command className="w-full">
                <CommandList>
                  <CommandGroup>
                    {filtered.length === 0 ? (
                      <div className="py-5 text-center text-base">No options found.</div>
                    ) : null}
                    {filtered.map(opt => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => toggle(opt.value)}
                      >
                        {opt.label}
                        {selectedSet.has(opt.value) ? (
                          <span className="ml-auto text-xs opacity-70">selected</span>
                        ) : null}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

export default InputMultiSelect;
