import { Input } from '../ui/input';

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
  return (
    <div className={className}>
      <label 
        style={{ 
          fontSize: 'var(--text-sm)', 
          fontWeight: 'var(--font-weight-medium)', 
          color: '#374151',
          fontFamily: 'Inter, sans-serif'
        }} 
        className="block mb-2"
      >
        {label} {required && '*'}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={!isEditing}
        style={{
          backgroundColor: isEditing ? 'var(--input-background)' : '#F9FAFB',
          borderColor: 'var(--input-border)',
          borderWidth: '1px',
          borderStyle: 'solid',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          color: isEditing ? 'var(--input-text)' : '#272B30',
          fontFamily: 'Inter, sans-serif',
          cursor: isEditing ? 'text' : 'not-allowed'
        }}
        className="w-full"
      />
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
  return (
    <div className={className}>
      <label 
        style={{ 
          fontSize: 'var(--text-sm)', 
          fontWeight: 'var(--font-weight-medium)', 
          color: '#374151',
          fontFamily: 'Inter, sans-serif'
        }} 
        className="block mb-2"
      >
        {label} {required && '*'}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={!isEditing}
        style={{
          backgroundColor: isEditing ? 'var(--input-background)' : '#F9FAFB',
          borderColor: 'var(--input-border)',
          borderWidth: '1px',
          borderStyle: 'solid',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          color: isEditing ? 'var(--input-text)' : '#272B30',
          fontFamily: 'Inter, sans-serif',
          cursor: isEditing ? 'text' : 'not-allowed',
          outline: 'none'
        }}
        className="w-full px-3 py-2 rounded-md transition-[color,box-shadow] focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"
      />
    </div>
  );
}

interface EditableSelectProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  className?: string;
}

export function EditableSelect({
  label,
  value,
  isEditing,
  onChange,
  options,
  required = false,
  className = ''
}: EditableSelectProps) {
  return (
    <div className={className}>
      <label 
        style={{ 
          fontSize: 'var(--text-sm)', 
          fontWeight: 'var(--font-weight-medium)', 
          color: '#374151',
          fontFamily: 'Inter, sans-serif'
        }} 
        className="block mb-2"
      >
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditing}
        style={{
          backgroundColor: isEditing ? 'var(--input-background)' : '#F9FAFB',
          borderColor: 'var(--input-border)',
          borderWidth: '1px',
          borderStyle: 'solid',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-normal)',
          color: isEditing ? 'var(--input-text)' : '#272B30',
          fontFamily: 'Inter, sans-serif',
          cursor: isEditing ? 'pointer' : 'not-allowed',
          outline: 'none',
          height: '36px'
        }}
        className="w-full px-3 py-1 rounded-md transition-[color,box-shadow] focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"
      >
        {!value && <option value="">Select...</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
