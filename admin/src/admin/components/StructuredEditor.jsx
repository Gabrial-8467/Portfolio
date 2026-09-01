import { useId, useState } from 'react';
import { ChevronDown, ChevronUp, ImageIcon, Plus, Trash2, X } from 'lucide-react';
import { blankItem } from '../structuredSchemas';

function StringTagsEditor({ value, onChange, placeholder }) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const tag = draft.trim();
    if (!tag) return;
    onChange([...(value || []), tag]);
    setDraft('');
  };

  const remove = (index) => onChange((value || []).filter((_, i) => i !== index));

  return (
    <div className="tags-input">
      {(value || []).map((tag, index) => (
        <span className="tags-chip" key={`${tag}-${index}`}>
          {tag}
          <button type="button" className="tags-chip-remove" onClick={() => remove(index)} aria-label={`Remove ${tag}`}>
            <X size={13} />
          </button>
        </span>
      ))}
      <input
        className="tags-add-inline"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={placeholder || 'Add and press Enter'}
      />
      <button type="button" className="tags-add" onClick={add}>
        Add
      </button>
    </div>
  );
}

function LinksEditor({ fields = [], value, onChange, label }) {
  const links = Array.isArray(value) ? value : [];
  const fieldLabel = (name) => fields.find((f) => f.name === name)?.label || name;
  const fieldPlaceholder = (name) => fields.find((f) => f.name === name)?.placeholder || '';

  const setLink = (index, key, val) => {
    const next = links.map((link, i) => (i === index ? { ...link, [key]: val } : link));
    onChange(next);
  };

  const addLink = () => {
    const next = {};
    fields.forEach((f) => {
      if (f.type === 'tags') next[f.name] = [];
      else next[f.name] = '';
    });
    onChange([...links, next]);
  };

  const removeLink = (index) => onChange(links.filter((_, i) => i !== index));

  return (
    <div>
      <span className="admin-field-label">{label}</span>
      <div className="links-list" style={{ marginTop: 6 }}>
        {links.length === 0 && (
          <div className="struct-empty">
            <p>No {label.toLowerCase()} yet.</p>
            <button type="button" className="admin-btn admin-btn-sm admin-btn-primary" onClick={addLink}>
              <Plus size={14} /> Add {label.slice(0, -1).toLowerCase()}
            </button>
          </div>
        )}
        {links.map((link, index) => (
          <div className="links-row" key={index}>
            {fields.map((field) => (
              <input
                key={field.name}
                className="admin-input-small"
                value={link[field.name] || ''}
                placeholder={fieldPlaceholder(field.name) || fieldLabel(field.name)}
                onChange={(e) => setLink(index, field.name, e.target.value)}
              />
            ))}
            <button type="button" className="admin-icon-btn admin-icon-btn-danger" onClick={() => removeLink(index)} aria-label="Remove link">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {links.length > 0 && (
          <button type="button" className="admin-btn admin-btn-sm admin-btn-ghost" style={{ justifySelf: 'start' }} onClick={addLink}>
            <Plus size={14} /> Add link
          </button>
        )}
      </div>
    </div>
  );
}

function FieldRenderer({ field, value, onChange }) {
  const inputId = useId();
  const style = field.inline ? { gridColumn: '1 / -1' } : undefined;

  const label = (
    <label className="admin-field-label" htmlFor={inputId}>
      {field.label}
      {field.hint && <div className="admin-field-hint" style={{ textTransform: 'none', fontWeight: 400, marginTop: 2 }}>{field.hint}</div>}
    </label>
  );

  switch (field.type) {
    case 'textarea':
      return (
        <div className="admin-field" style={style}>
          {label}
          <textarea
            id={inputId}
            className="admin-textarea"
            value={value || ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case 'url':
    case 'text':
      return (
        <div className="admin-field" style={style}>
          {label}
          <input
            id={inputId}
            type={field.type === 'url' ? 'url' : 'text'}
            className="admin-input"
            value={value || ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case 'image':
      return (
        <div className="admin-field" style={style}>
          {label}
          <input
            id={inputId}
            type="url"
            className="admin-input"
            value={value || ''}
            placeholder="https://…"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="img-preview">
            {value ? (
              <img src={value} alt="Preview" onError={(e) => {
                e.currentTarget.style.display = 'none';
              }} />
            ) : (
              <ImageIcon size={18} />
            )}
          </div>
        </div>
      );
    case 'number':
      return (
        <div className="admin-field" style={style}>
          {label}
          <input
            id={inputId}
            type="number"
            className="admin-input"
            value={value ?? ''}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      );
    case 'boolean':
      return (
        <div className="admin-field" style={style}>
          {label}
          <label className="admin-toggle" style={{ marginTop: 2 }}>
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span className="admin-toggle-track" />
            <span className="admin-toggle-label">{value ? 'Yes' : 'No'}</span>
          </label>
        </div>
      );
    case 'select':
      return (
        <div className="admin-field" style={style}>
          {label}
          <select id={inputId} className="admin-select" value={value || (field.options && field.options[0]) || ''} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    case 'tags':
      return (
        <div className="admin-field" style={style}>
          {label}
          <StringTagsEditor value={value} onChange={onChange} placeholder="Add and press Enter" />
        </div>
      );
    case 'strings':
      return (
        <div className="admin-field" style={style}>
          {label}
          <StringTagsEditor value={value} onChange={onChange} placeholder="Bullet point — press Enter" />
        </div>
      );
    default:
      return null;
  }
}

function ListEditor({ fields, items, onChange, singular }) {
  const list = Array.isArray(items) ? items : [];

  const updateItem = (index, updated) => onChange(list.map((item, i) => (i === index ? updated : item)));
  const removeItem = (index) => onChange(list.filter((_, i) => i !== index));
  const move = (index, dir) => {
    const next = [...list];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const addItem = () => onChange([...list, blankItem({ fields })]);

  if (list.length === 0) {
    return (
      <div className="struct-empty">
        <p>Nothing here yet.</p>
        <button type="button" className="admin-btn admin-btn-primary" onClick={addItem}>
          <Plus size={15} /> Add {singular || 'item'}
        </button>
      </div>
    );
  }

  return (
    <>
      {list.map((item, index) => {
        const title =
          item.name || item.role || item.degree || item.category || item.event || item.text || `${singular || 'Item'} ${index + 1}`;
        return (
          <div className="struct-card" key={index}>
            <div className="struct-card-header">
              <span className="struct-card-title">{title}</span>
              <div className="struct-card-actions">
                <div className="struct-card-sort">
                  <button type="button" className="admin-icon-btn" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
                    <ChevronUp size={16} />
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => move(index, 1)} disabled={index === list.length - 1} aria-label="Move down">
                    <ChevronDown size={16} />
                  </button>
                </div>
                <button type="button" className="admin-icon-btn admin-icon-btn-danger" onClick={() => removeItem(index)} aria-label="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="struct-card-body">
              <div className="struct-grid">
                {fields.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={{ ...field, inline: field.type === 'textarea' || field.type === 'tags' || field.type === 'strings' }}
                    value={item[field.name]}
                    onChange={(val) => updateItem(index, { ...item, [field.name]: val })}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
      <button type="button" className="admin-btn admin-btn-ghost struct-add" onClick={addItem}>
        <Plus size={15} /> Add {singular || 'item'}
      </button>
    </>
  );
}

function ObjectEditor({ schema, value, onChange }) {
  const fields = schema.fields || [];
  const lists = schema.lists || [];

  return (
    <>
      {fields.length > 0 && (
        <div className="struct-card">
          <div className="struct-card-header">
            <span className="struct-card-title">Content</span>
          </div>
          <div className="struct-card-body">
            <div className="struct-grid">
              {fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={{ ...field, inline: field.type === 'textarea' || field.type === 'tags' || field.type === 'strings' }}
                  value={value[field.name]}
                  onChange={(val) => onChange({ ...value, [field.name]: val })}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {lists.map((list) => (
        <div className="struct-card" key={list.name}>
          <div className="struct-card-header">
            <span className="struct-card-title">{list.label}</span>
          </div>
          <div className="struct-card-body">
            <LinksEditor
              fields={list.fields}
              label=""
              value={value[list.name]}
              onChange={(val) => onChange({ ...value, [list.name]: val })}
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default function StructuredEditor({ schema, value, onChange }) {
  if (!schema) return null;

  return (
    <div className="struct-editor">
      {schema.description && <p className="struct-intro">{schema.description}</p>}
      {schema.kind === 'list' ? (
        <ListEditor fields={schema.fields} items={value} onChange={onChange} singular={schema.singular} />
      ) : (
        <ObjectEditor schema={schema} value={value || {}} onChange={onChange} />
      )}
    </div>
  );
}