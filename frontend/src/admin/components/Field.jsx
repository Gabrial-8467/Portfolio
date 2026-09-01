export default function Field({ label, children, hint }) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {children}
      {hint && <span className="admin-field-hint">{hint}</span>}
    </label>
  );
}

export function TextInput({ value, onChange, placeholder, ...rest }) {
  return (
    <input
      type="text"
      className="admin-input"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      {...rest}
    />
  );
}

export function TextArea({ value, onChange, rows = 4, placeholder, ...rest }) {
  return (
    <textarea
      className="admin-textarea"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      {...rest}
    />
  );
}

export function NumberInput({ value, onChange, ...rest }) {
  return (
    <input
      type="number"
      className="admin-input"
      value={value ?? 0}
      onChange={(e) => onChange(Number(e.target.value))}
      {...rest}
    />
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
      <span className="admin-toggle-track" />
      <span className="admin-toggle-label">{label}</span>
    </label>
  );
}