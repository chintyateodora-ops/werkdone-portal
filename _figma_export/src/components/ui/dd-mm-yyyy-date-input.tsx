import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  digitsOnly,
  formatDdMmYyyyFromDigits,
  parseDdMmYyyy,
  dateToIso,
  isoToDdMmYyyy,
  normalizeDateDisplay,
} from '../../lib/dateDdMmYyyy';
import { cn } from './utils';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calendar';
import { Button } from './button';

export interface DdMmYyyyDateInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  'aria-invalid'?: boolean;
}

/** DD-MM-YYYY text + calendar popover below the field (Radix), so the input stays visible */
export function DdMmYyyyDateInput({
  id,
  value,
  onChange,
  disabled,
  required,
  placeholder = 'DD-MM-YYYY',
  className,
  'aria-invalid': ariaInvalid,
}: DdMmYyyyDateInputProps) {
  const [open, setOpen] = useState(false);

  const display = normalizeDateDisplay(value);

  const selectedDate = useMemo(() => {
    const d = parseDdMmYyyy(display.trim());
    return d ?? undefined;
  }, [display]);

  const defaultMonth = selectedDate ?? new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          className={cn(
            'relative flex h-9 w-full min-w-0 overflow-hidden rounded-lg border border-input bg-[var(--input-background)] text-sm shadow-sm transition-[color,box-shadow]',
            'focus-within:ring-[3px] focus-within:ring-ring/50',
            disabled && 'pointer-events-none cursor-not-allowed',
            className
          )}
        >
          <input
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            placeholder={placeholder}
            value={display}
            disabled={disabled}
            required={required}
            aria-invalid={ariaInvalid}
            className="min-w-0 flex-1 border-0 bg-transparent px-3 font-mono text-sm text-[var(--input-text)] outline-none placeholder:text-muted-foreground focus:outline-none"
            onChange={(e) => {
              const raw = e.target.value;
              const next = formatDdMmYyyyFromDigits(digitsOnly(raw));
              onChange(next);
            }}
            onBlur={() => {
              const n = normalizeDateDisplay(display);
              if (n !== display && /^\d{2}-\d{2}-\d{4}$/.test(n)) onChange(n);
            }}
          />
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center border-l border-input bg-[var(--input-background)] text-muted-foreground hover:bg-muted/80 disabled:pointer-events-none',
                disabled && 'bg-muted/60'
              )}
              disabled={disabled}
              aria-label="Choose date"
              title="Choose date"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        collisionPadding={16}
        className="w-auto p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => {
            if (d) {
              onChange(isoToDdMmYyyy(dateToIso(d)));
              setOpen(false);
            }
          }}
          defaultMonth={defaultMonth}
        />
        <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-primary"
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
          >
            Clear
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-primary"
            onClick={() => {
              const t = new Date();
              onChange(isoToDdMmYyyy(dateToIso(t)));
              setOpen(false);
            }}
          >
            Today
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
