import { useState } from 'react';
import { cn } from './utils';

const BULLET = '\u25CF';

export interface NricRevealInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

function maskDisplay(value: string) {
  if (!value.length) return BULLET.repeat(9);
  return BULLET.repeat(value.length);
}

/**
 * NRIC / FIN: masked row shows bullets (●) + fi-rr-eye-crossed; revealed shows value + fi-rr-eye.
 */
export function NricRevealInput({
  id,
  value,
  onChange,
  disabled,
  required,
  placeholder = 'Enter NRIC No.',
  className,
}: NricRevealInputProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className={cn(
        'flex h-9 w-full min-w-0 overflow-hidden rounded-lg border border-input bg-[var(--input-background)] text-sm shadow-sm transition-[color,box-shadow]',
        'focus-within:ring-[3px] focus-within:ring-ring/50',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center">
        {revealed ? (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            autoComplete="off"
            maxLength={20}
            className="min-w-0 flex-1 border-0 bg-transparent px-3 py-1 text-sm text-[var(--input-text)] outline-none placeholder:text-muted-foreground focus:outline-none"
          />
        ) : (
          <div
            className="flex min-h-9 flex-1 items-center px-3 text-sm tracking-wide text-[var(--input-text)] select-none"
            style={{ letterSpacing: '0.12em' }}
            aria-hidden
          >
            {maskDisplay(value)}
          </div>
        )}
      </div>
      <button
        type="button"
        className={cn(
          'flex h-9 w-10 shrink-0 items-center justify-center border-0 border-l border-input bg-transparent text-muted-foreground hover:bg-muted/50',
          'rounded-none outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 shadow-none',
          '[&::-moz-focus-inner]:border-0 [&::-moz-focus-inner]:p-0'
        )}
        aria-label={revealed ? 'Hide NRIC' : 'Show NRIC'}
        aria-pressed={revealed}
        disabled={disabled}
        onClick={() => setRevealed((r) => !r)}
      >
        <span className="flex h-full w-full items-center justify-center" aria-hidden>
          <i
            className={cn(
              'fi fi-rr-eye-crossed text-base leading-none text-[#64748b]',
              revealed && 'hidden'
            )}
          />
          <i
            className={cn(
              'fi fi-rr-eye text-base leading-none text-[#64748b]',
              !revealed && 'hidden'
            )}
          />
        </span>
      </button>
    </div>
  );
}
