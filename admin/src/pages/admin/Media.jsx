import { useState, useRef } from 'react';
import { useToast } from '../../admin/components/useToast';
import { api, resolveAssetUrl } from '../../api/client';
import {
  UploadCloud,
  Copy,
  Check,
  Image as ImageIcon,
  ExternalLink,
  Trash2,
} from 'lucide-react';

export default function Media() {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_media_cache');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedUrl, setCopiedUrl] = useState(null);

  const saveUploads = (list) => {
    setUploads(list);
    try {
      localStorage.setItem('portfolio_media_cache', JSON.stringify(list));
    } catch {
      /* ignore storage errors */
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('File size must be under 5MB', 'error');
      return;
    }

    setUploading(true);
    try {
      const res = await api.uploads.uploadFile(file);
      const newMedia = {
        url: res.url,
        name: res.name || file.name,
        size: res.size || file.size,
        uploadedAt: new Date().toISOString(),
      };
      const updated = [newMedia, ...uploads];
      saveUploads(updated);
      addToast('Image uploaded successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    addToast('Asset URL copied to clipboard', 'info');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const removeMedia = (url) => {
    const updated = uploads.filter((u) => u.url !== url);
    saveUploads(updated);
    addToast('Removed from local gallery', 'info');
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media Library</h1>
          <p className="admin-page-desc">
            Upload images, avatars, and project screenshots to host them directly on your server.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        style={{
          background: '#ffffff',
          border: '2px dashed var(--admin-border)',
          borderRadius: 'var(--admin-radius)',
          padding: '40px 24px',
          textAlign: 'center',
          marginBottom: 32,
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          style={{ display: 'none' }}
        />
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--admin-blue-soft)',
            color: 'var(--admin-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <UploadCloud size={24} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 6 }}>
          {uploading ? 'Uploading asset to server...' : 'Click or drop image to upload'}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
          Supports PNG, JPG, WEBP, SVG up to 5MB
        </p>
      </div>

      {/* Gallery Grid */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 16 }}>
          Uploaded Assets ({uploads.length})
        </h2>

        {uploads.length === 0 ? (
          <div className="admin-empty" style={{ background: '#ffffff', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', padding: 48 }}>
            <div className="admin-empty-icon"><ImageIcon size={32} /></div>
            <div className="admin-empty-title">No uploaded images yet</div>
            <div className="admin-empty-desc">Upload your first image above to get a permanent URL for your projects or avatar.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {uploads.map((item) => (
              <div
                key={item.url}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--admin-radius)',
                  overflow: 'hidden',
                  boxShadow: 'var(--admin-shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    height: 160,
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderBottom: '1px solid var(--admin-border)',
                  }}
                >
                  <img
                    src={resolveAssetUrl(item.url)}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--admin-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                      {formatSize(item.size)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ flex: 1, fontSize: 12, padding: '6px 10px' }}
                      onClick={() => copyToClipboard(resolveAssetUrl(item.url))}
                    >
                      {copiedUrl === resolveAssetUrl(item.url) ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                      <span>{copiedUrl === resolveAssetUrl(item.url) ? 'Copied' : 'Copy URL'}</span>
                    </button>
                    <a
                      href={resolveAssetUrl(item.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '6px 10px' }}
                      title="Open in new tab"
                    >
                      <ExternalLink size={13} />
                    </a>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger-ghost"
                      style={{ padding: '6px 10px' }}
                      onClick={() => removeMedia(item.url)}
                      title="Remove"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
