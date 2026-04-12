import { cn } from './utils';

export interface PhonePrefixInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  prefix?: string;
  className?: string;
  'aria-invalid'?: boolean;
}

/** +65-style prefix and number in one rounded bordered control */
export function PhonePrefixInput({
  id,
  value,
  onChange,
  disabled,
  required,
  placeholder = 'E.g. 8123 4567',
  prefix = '+65',
  className,
  'aria-invalid': ariaInvalid,
}: PhonePrefixInputProps) {
  return (
    <div
      className={cn(
        'flex h-9 w-full min-w-0 overflow-hidden rounded-lg border border-input bg-[var(--input-background)] text-sm shadow-sm transition-[color,box-shadow]',
        'focus-within:ring-[3px] focus-within:ring-ring/50',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      <div
        className="flex w-[3.75rem] shrink-0 items-center justify-center border-r border-input bg-muted text-muted-foreground"
        aria-hidden
      >
        {prefix}
      </div>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        className="min-w-0 flex-1 border-0 bg-transparent px-3 text-[var(--input-text)] outline-none placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
}
