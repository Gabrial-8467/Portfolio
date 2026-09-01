import { Pencil, Trash2, X } from 'lucide-react';

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!message) return null;

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <div className="admin-modal">
        <button type="button" className="admin-modal-close" onClick={onCancel} aria-label="Close">
          <X size={18} />
        </button>
        <h3 className="admin-modal-title">{title}</h3>
        <p className="admin-modal-message">{message}</p>
        <div className="admin-modal-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="admin-btn admin-btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ItemsToolbar({ onAdd, addLabel = 'Add Item', children }) {
  return (
    <div className="admin-toolbar">
      <button type="button" className="admin-btn admin-btn-primary" onClick={onAdd}>
        Add {addLabel}
      </button>
      {children}
    </div>
  );
}

export function RowActions({ onEdit, onDelete }) {
  return (
    <div className="admin-row-actions">
      <button type="button" className="admin-icon-btn" onClick={onEdit} aria-label="Edit">
        <Pencil size={16} />
      </button>
      <button type="button" className="admin-icon-btn admin-icon-btn-danger" onClick={onDelete} aria-label="Delete">
        <Trash2 size={16} />
      </button>
    </div>
  );
}