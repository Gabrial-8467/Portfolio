import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

const isEmptyObject = (v) => isPlainObject(v) && Object.keys(v).length === 0;

function detectType(v) {
  if (Array.isArray(v)) return 'array';
  if (isPlainObject(v)) return 'object';
  if (typeof v === 'number') return 'number';
  if (typeof v === 'boolean') return 'boolean';
  return 'text';
}

const TYPE_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Yes / No' },
  { value: 'array', label: 'List' },
  { value: 'object', label: 'Object' },
];

function ScalarInput({ value, onChange }) {
  if (typeof value === 'number') {
    return (
      <input
        type="number"
        className="admin-input"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }
  if (typeof value === 'boolean') {
    return (
      <label className="admin-toggle">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <span className="admin-toggle-track" />
        <span className="admin-toggle-label">{value ? 'Yes' : 'No'}</span>
      </label>
    );
  }
  return (
    <input
      type="text"
      className="admin-input"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function KeyRow({ fieldKey, onChangeKey, onRemove, children }) {
  return (
    <div className="json-field">
      <div className="json-field-header">
        <input
          type="text"
          className="admin-input admin-input-small"
          value={fieldKey}
          onChange={onChangeKey}
        />
        <button
          type="button"
          className="admin-icon-btn admin-icon-btn-danger"
          onClick={onRemove}
          aria-label="Remove field"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {children}
    </div>
  );
}

function ObjectEditor({ value, onChange, depth }) {
  const entries = isPlainObject(value) ? Object.entries(value) : [];

  const updateKey = (oldKey, newKey) => {
    const next = {};
    for (const [k, v] of entries) next[k === oldKey ? newKey : k] = v;
    onChange(next);
  };

  const updateValue = (key, nextValue) => {
    onChange({ ...value, [key]: nextValue });
  };

  const removeKey = (key) => {
    const next = { ...value };
    delete next[key];
    onChange(next);
  };

  const addField = () => {
    let base = 'field';
    let n = 1;
    while (base in value) {
      base = `field${n}`;
      n += 1;
    }
    onChange({ ...value, [base]: '' });
  };

  return (
    <div className={`json-object ${depth > 0 ? 'json-nested' : ''}`}>
      {entries.map(([key, val]) => (
        <KeyRow
          key={key}
          fieldKey={key}
          onChangeKey={(e) => updateKey(key, e.target.value)}
          onRemove={() => removeKey(key)}
        >
          <ValueField key={`${key}-value`} value={val} onChange={(v) => updateValue(key, v)} depth={depth + 1} />
        </KeyRow>
      ))}
      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addField}>
        <Plus size={14} />
        Add Field
      </button>
    </div>
  );
}

function ListEditor({ value, onChange, depth }) {
  const items = Array.isArray(value) ? value : [];
  const itemIsObject = items.every((item) => isPlainObject(item)) && items.length > 0;

  const normalizeEmpty = (arr) => (arr.length === 0 ? [''] : arr);

  const updateItem = (index, next) => {
    onChange(items.map((item, i) => (i === index ? next : item)));
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addPrimitive = () => {
    onChange(normalizeEmpty([...items, '']));
  };

  const addObject = () => {
    onChange([...items, {}]);
  };

  const addItem = itemIsObject ? addObject : addPrimitive;

  if (itemIsObject) {
    return (
      <div className={`json-list ${depth > 0 ? 'json-nested' : ''}`}>
        {items.map((item, index) => (
          <div key={index} className="json-list-item">
            <div className="json-list-item-header">
              <span className="admin-field-label">Item {index + 1}</span>
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn-danger"
                onClick={() => removeItem(index)}
                aria-label="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <ObjectEditor value={item} onChange={(v) => updateItem(index, v)} depth={depth + 1} />
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addItem}>
          <Plus size={14} />
          Add Item
        </button>
      </div>
    );
  }

  return (
    <div className={`json-primitives ${depth > 0 ? 'json-nested' : ''}`}>
      {normalizeEmpty(items).map((item, index) => {
        const isLast = index === items.length;
        return (
          <div key={index} className="json-primitive-row">
            <ScalarInput
              value={item}
              onChange={(v) => {
                if (isLast && items.length === 0) {
                  onChange([v]);
                } else {
                  onChange(items.map((it, i) => (i === index ? v : it)));
                }
              }}
            />
            {!isLast && (
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn-danger"
                onClick={() => removeItem(index)}
                aria-label="Remove item"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        );
      })}
      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addPrimitive}>
        <Plus size={14} />
        Add Item
      </button>
    </div>
  );
}

function ValueField({ value, onChange, depth }) {
  const [forcedType, setForcedType] = useState('');

  const autoType = detectType(value);
  const effectiveType = forcedType || autoType;

  const convert = (type, current) => {
    switch (type) {
      case 'text':
        if (typeof current === 'string') return current;
        if (current === null || current === undefined) return '';
        if (typeof current === 'number' || typeof current === 'boolean') return String(current);
        return JSON.stringify(current);
      case 'number':
        if (typeof current === 'number') return current;
        if (current === '' || current === null || current === undefined) return 0;
        const n = Number(current);
        return Number.isFinite(n) ? n : 0;
      case 'boolean':
        if (typeof current === 'boolean') return current;
        return Boolean(current);
      case 'array':
        return Array.isArray(current) ? current : [];
      case 'object':
        return isPlainObject(current) ? current : {};
      default:
        return current;
    }
  };

  const handleForcedType = (type) => {
    setForcedType(type);
    if (type && type !== autoType) onChange(convert(type, value));
  };

  let editor;
  if (effectiveType === 'array') {
    editor = <ListEditor value={value} onChange={onChange} depth={depth} />;
  } else if (effectiveType === 'object') {
    if (isEmptyObject(value)) {
      editor = (
        <div className="json-empty">
          <span>Empty object</span>
          <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => onChange({ field: '' })}>
            Add first field
          </button>
        </div>
      );
    } else {
      editor = <ObjectEditor value={value} onChange={onChange} depth={depth} />;
    }
  } else {
    editor = <ScalarInput value={value} onChange={onChange} />;
  }

  return (
    <div className="json-value">
      <div className="json-value-toolbar">
        <select className="admin-select admin-select-sm" value={effectiveType} onChange={(e) => handleForcedType(e.target.value)}>
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {editor}
    </div>
  );
}

export default function JsonEditor({ value, onChange }) {
  return (
    <div className="json-editor">
      <ValueField value={value} onChange={onChange} depth={0} />
    </div>
  );
}