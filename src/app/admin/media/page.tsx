'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import type { Media } from '@/types';

const folders = ['general', 'projects', 'projects/videos', 'thumbnails'];

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [folder, setFolder] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/upload?folder=${folder}`);
    const data = await res.json();
    setMedia(data.media || []);
    setLoading(false);
  }, [folder]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      await fetch('/api/upload', { method: 'POST', body: formData });
    }
    await fetchMedia();
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    await fetch(`/api/upload?id=${id}`, { method: 'DELETE' });
    setMedia((m) => m.filter((f) => f.id !== id));
  };

  const getIcon = (type: string) => {
    if (type === 'video') return <Video size={20} className="text-blue-400" />;
    if (type === 'pdf') return <FileText size={20} className="text-red-400" />;
    return <ImageIcon size={20} className="text-white/40" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Media Library</h1>
          <p className="text-sm text-white/40 mt-1">{media.length} files in /{folder}</p>
        </div>

        <label className={`inline-flex items-center gap-1.5 h-9 px-4 bg-white text-black text-xs font-medium rounded-lg cursor-pointer hover:bg-white/90 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={14} aria-hidden="true" />
          {uploading ? 'Uploading…' : 'Upload'}
          <input
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Folder tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Media folders">
        {folders.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={folder === f}
            onClick={() => setFolder(f)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              folder === f
                ? 'bg-white text-black'
                : 'bg-white/6 text-white/50 border border-white/10 hover:bg-white/10'
            }`}
          >
            /{f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-xl">
          <ImageIcon size={28} className="text-white/20 mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm text-white/30">No files in /{folder}</p>
          <p className="text-xs text-white/20 mt-1">Upload files using the button above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {media.map((file) => (
            <div
              key={file.id}
              className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/8 aspect-square hover:border-white/15 transition-colors"
            >
              {file.type === 'image' || file.type === 'gif' ? (
                <Image
                  src={file.url}
                  alt={file.filename}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  {getIcon(file.type)}
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-[10px] text-white/70 text-center line-clamp-2 leading-tight">
                  {file.filename}
                </p>
                <p className="text-[10px] text-white/40">{formatFileSize(file.size)}</p>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  aria-label={`Delete ${file.filename}`}
                >
                  <Trash2 size={12} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
