import { useEffect, useMemo, useRef, useState } from 'react';
import { UploadCloud, Search, X, Loader2, ImageIcon, Check } from 'lucide-react';
import { api, resolveAssetUrl } from '../../api/client';
import { useToast } from './useToast';

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPickerModal({ open, onClose, onSelect, accept }) {
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCustomUrl('');
    setMedia([]);
    setLoading(true);
    api.uploads
      .list()
      .then((list) => setMedia(list || []))
      .catch((err) => toast(err.message || 'Failed to load media', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploads.uploadFile(file);
      if (res && res.url) {
        setMedia((prev) => [res, ...prev]);
        onSelect(res.url);
      } else {
        toast('Upload failed — no URL returned', 'error');
      }
    } catch (err) {
      toast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) upload(e.dataTransfer.files[0]);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return media;
    return media.filter(
      (m) =>
        (m.originalName || '').toLowerCase().includes(q) ||
        (m.filename || '').toLowerCase().includes(q)
    );
  }, [media, query]);

  const useCustomUrl = () => {
    const url = customUrl.trim();
    if (!url) return;
    onSelect(url);
  };

  if (!open) return null;

  return (
    <div className="media-picker-overlay" onClick={onClose}>
      <div className="media-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="media-picker-header">
          <div>
            <div className="media-picker-title">Select Media</div>
            <div className="media-picker-subtitle">
              Pick an uploaded asset or upload a new one.
            </div>
          </div>
          <button type="button" className="admin-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Upload zone */}
        <div
          className="media-picker-upload"
          style={{
            background: dragOver ? 'var(--admin-primary-light)' : 'var(--admin-surface-subtle)',
            border: dragOver ? '2px dashed var(--admin-primary)' : '2px dashed var(--admin-border)',
          }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileRef}
            accept={accept || 'image/*'}
            style={{ display: 'none' }}
            onChange={(e) => upload(e.target.files?.[0])}
          />
          {uploading ? (
            <Loader2 size={18} className="spin" style={{ marginRight: 8 }} />
          ) : (
            <UploadCloud size={18} style={{ marginRight: 8 }} />
          )}
          <span>{uploading ? 'Uploading…' : 'Drop image here or click to upload'}</span>
        </div>

        {/* Custom URL */}
        <div className="media-picker-customurl">
          <input
            className="admin-input"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="…or paste an external image URL"
          />
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={useCustomUrl}
            disabled={!customUrl.trim()}
          >
            Use URL
          </button>
        </div>

        {/* Search */}
        <div className="media-picker-search">
          <Search size={15} style={{ color: 'var(--admin-text-muted)' }} />
          <input
            className="admin-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by file name…"
          />
        </div>

        {/* Gallery */}
        <div className="media-picker-body">
          {loading ? (
            <div className="admin-empty-state">
              <Loader2 size={22} className="spin" />
              <div className="admin-empty-desc">Loading media…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon"><ImageIcon size={22} /></div>
              <div className="admin-empty-title">{media.length === 0 ? 'No media yet' : 'No matches'}</div>
              <div className="admin-empty-desc">
                {media.length === 0
                  ? 'Upload an image above and it will appear here.'
                  : 'Try a different search.'}
              </div>
            </div>
          ) : (
            <div className="media-picker-grid">
              {filtered.map((item) => {
                const url = resolveAssetUrl(item.url);
                return (
                  <button
                    type="button"
                    key={item.id || item.url}
                    className="media-picker-item"
                    onClick={() => onSelect(item.url)}
                    title={`Use ${item.originalName || item.filename}`}
                  >
                    <div className="media-picker-thumb">
                      <img
                        src={url}
                        alt={item.originalName || item.filename}
                        onError={(e) => {
                          e.currentTarget.style.visibility = 'hidden';
                        }}
                      />
                    </div>
                    <div className="media-picker-meta">
                      <span className="media-picker-name">{item.originalName || item.filename}</span>
                      <span className="media-picker-size">{formatSize(item.size)}</span>
                    </div>
                    <div className="media-picker-check"><Check size={14} /></div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="media-picker-footer">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
