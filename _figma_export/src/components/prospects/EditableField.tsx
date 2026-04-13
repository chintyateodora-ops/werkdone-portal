import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { cn } from '../ui/utils';
import { DdMmYyyyDateInput } from '../ui/dd-mm-yyyy-date-input';
import { DETAIL_FIELD_LABEL_CLASS, DETAIL_FIELD_VALUE_CLASS } from '../../lib/detailFieldDisplay';

/** Label + required asterisk — aligns with prospect detail view (gray label). */
export function FormFieldLabel({
  htmlFor,
  label,
  required,
  className,
}: {
  htmlFor?: string;
  label: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn(DETAIL_FIELD_LABEL_CLASS, className)}>
      {label}
      {required ? <span className="text-red-600">*</span> : null}
    </label>
  );
}

interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'date';
  className?: string;
  placeholder?: string;
}

export function EditableField({
  label,
  value,
  isEditing,
  onChange,
  required = false,
  type = 'text',
  className = '',
  placeholder
}: EditableFieldProps) {
  const inputId = `prospect-field-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const displayValue = value.trim() ? value : '—';

  return (
    <div className={className}>
      <FormFieldLabel htmlFor={inputId} label={label} required={required} />
      {!isEditing ? (
        <p className={DETAIL_FIELD_VALUE_CLASS}>{displayValue}</p>
      ) : type === 'date' ? (
        <DdMmYyyyDateInput
          id={inputId}
          value={value}
          onChange={onChange}
          disabled={false}
          required={required}
          placeholder={placeholder || 'DD-MM-YYYY'}
        />
      ) : (
        <Input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full"
        />
      )}
    </div>
  );
}

interface EditableTextAreaProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  className?: string;
  placeholder?: string;
}

export function EditableTextArea({
  label,
  value,
  isEditing,
  onChange,
  required = false,
  rows = 3,
  className = '',
  placeholder
}: EditableTextAreaProps) {
  const id = `prospect-ta-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const displayValue = value.trim() ? value : '—';

  return (
    <div className={className}>
      <FormFieldLabel htmlFor={id} label={label} required={required} />
      {!isEditing ? (
        <p className={cn(DETAIL_FIELD_VALUE_CLASS, 'whitespace-pre-wrap')}>{displayValue}</p>
      ) : (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className="w-full min-h-[5rem]"
        />
      )}
    </div>
  );
}

type EditableSelectOption = string | { value: string; label: string };

interface EditableSelectProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  options: EditableSelectOption[];
  required?: boolean;
  className?: string;
  /** First empty option label (e.g. &quot;Select Citizenship&quot;). */
  emptyOptionLabel?: string;
}

function optionValue(opt: EditableSelectOption): string {
  return typeof opt === 'string' ? opt : opt.value;
}

function optionLabel(opt: EditableSelectOption): string {
  return typeof opt === 'string' ? opt : opt.label;
}

function selectedOptionLabel(
  value: string,
  options: EditableSelectOption[],
  emptyOptionLabel: string
): string {
  if (!value) return emptyOptionLabel;
  const opt = options.find((o) => optionValue(o) === value);
  return opt ? optionLabel(opt) : value;
}

export function EditableSelect({
  label,
  value,
  isEditing,
  onChange,
  options,
  required = false,
  className = '',
  emptyOptionLabel = 'Select...'
}: EditableSelectProps) {
  const id = `prospect-sel-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const readLabel = selectedOptionLabel(value, options, emptyOptionLabel);
  const displayRead = value.trim() ? readLabel : '—';

  return (
    <div className={className}>
      <FormFieldLabel htmlFor={id} label={label} required={required} />
      {!isEditing ? (
        <p className={DETAIL_FIELD_VALUE_CLASS}>{displayRead}</p>
      ) : (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={cn(
            'flex h-9 w-full min-w-0 rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-1 text-sm transition-[color,box-shadow] outline-none',
            'focus-visible:ring-[3px] focus-visible:ring-ring/50'
          )}
          style={{
            color: 'var(--input-text)',
            borderColor: 'var(--input-border)',
          }}
        >
          {!value && <option value="">{emptyOptionLabel}</option>}
          {options.map((option) => {
            const v = optionValue(option);
            const lbl = optionLabel(option);
            return (
              <option key={v} value={v}>
                {lbl}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
}
