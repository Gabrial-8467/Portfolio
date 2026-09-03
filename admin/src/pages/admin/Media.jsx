import { useState, useRef, useEffect } from 'react';
import { useToast } from '../../admin/components/useToast';
import { useAuth } from '../../admin/useAuth';
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
  const { activePortfolio, user } = useAuth();
  const fileInputRef = useRef(null);
  const cacheKey = `portfolio_media_cache_${activePortfolio?._id || 'none'}`;
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState(() => {
    try {
      const saved = localStorage.getItem(cacheKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedUrl, setCopiedUrl] = useState(null);

  const maxUploadMb = {
    hobby: 5,
    pro: 50,
    agency: 100,
  }[user?.plan] || 5;
  const maxUploadBytes = maxUploadMb * 1024 * 1024;

  useEffect(() => {
    // Reload cached uploads when the active portfolio changes
    // eslint-disable-next-line react/set-state-in-effect
    setUploads(() => {
      try {
        const saved = localStorage.getItem(cacheKey);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    });
  }, [cacheKey]);

  const saveUploads = (list) => {
    setUploads(list);
    try {
      localStorage.setItem(cacheKey, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  };

  const uploadSingleFile = async (file) => {
    if (!file) return;
    if (file.size > maxUploadBytes) {
      addToast(
        `File size must be under ${maxUploadMb}MB for your ${user?.plan || 'hobby'} plan`,
        'error'
      );
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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadSingleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadSingleFile(file);
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    addToast('Asset URL copied to clipboard', 'info');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

const removeMedia = async (url) => {
    const filename = (url.split('/').pop() || '').split('?')[0];
    if (!filename) {
      addToast('Could not resolve file name', 'error');
      return;
    }
    setUploading(true);
    try {
      await api.uploads.deleteFile(filename);
      const updated = uploads.filter((u) => u.url !== url);
      saveUploads(updated);
      addToast('Image deleted from server', 'info');
    } catch (err) {
      addToast(err.message || 'Could not delete file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media Assets</h1>
          <p className="admin-page-subtitle">
            Upload and manage images, project banners, and avatars hosted directly on your server.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <UploadCloud size={15} />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Upload Zone */}
      <div
        style={{
          background: isDragOver ? 'var(--admin-primary-light)' : 'var(--admin-surface)',
          border: isDragOver ? '2px dashed var(--admin-primary)' : '2px dashed var(--admin-border)',
          borderRadius: 'var(--admin-radius)',
          padding: '36px 24px',
          textAlign: 'center',
          marginBottom: 32,
          cursor: 'pointer',
          transition: 'var(--admin-transition)',
          boxShadow: 'var(--admin-shadow-xs)',
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif, image/avif"
          style={{ display: 'none' }}
        />
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: 'var(--admin-primary-light)',
            color: 'var(--admin-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}
        >
          <UploadCloud size={22} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 4 }}>
          {uploading ? 'Uploading asset to server…' : 'Drop images here, or click to browse'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
          PNG, JPG, WEBP, GIF, SVG or AVIF up to {maxUploadMb}MB
        </div>
      </div>

      {/* Gallery Grid */}
      <div>
        <div className="admin-toolbar" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
            Uploaded Assets ({uploads.length})
          </h2>
        </div>

        {uploads.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon"><ImageIcon size={24} /></div>
            <div className="admin-empty-title">No uploaded assets</div>
            <div className="admin-empty-desc">
              Upload project mockups, avatars, or certificates to generate permanent asset URLs.
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={15} /> Upload First Image
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
            {uploads.map((item) => (
              <div
                key={item.url}
                style={{
                  background: 'var(--admin-surface)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--admin-radius)',
                  overflow: 'hidden',
                  boxShadow: 'var(--admin-shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'var(--admin-transition)',
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
                    borderBottom: '1px solid var(--admin-border-subtle)',
                    padding: 8,
                  }}
                >
                  <img
                    src={resolveAssetUrl(item.url)}
                    alt={item.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
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

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => copyToClipboard(resolveAssetUrl(item.url))}
                    >
                      {copiedUrl === resolveAssetUrl(item.url) ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                      <span>{copiedUrl === resolveAssetUrl(item.url) ? 'Copied' : 'Copy URL'}</span>
                    </button>
                    <a
                      href={resolveAssetUrl(item.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      title="Open in new tab"
                    >
                      <ExternalLink size={13} />
                    </a>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger-ghost admin-btn-sm"
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
