'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  folder?: string;
  label?: string;
  accept?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onClear,
  folder = 'general',
  label = 'Upload Image',
  accept = 'image/*',
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 100);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      setError('File too large (max 100MB)');
      return;
    }
    uploadFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [folder]
  );

  if (value) {
    return (
      <div className={cn('relative group', className)}>
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-white/5 border border-white/10">
          <Image
            src={value}
            alt="Uploaded"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            onClear?.();
            onChange('');
          }}
          className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-white/60 hover:text-white transition-colors"
          aria-label="Remove image"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <span className="text-sm font-medium text-white/80">{label}</span>
      )}
      <div
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed',
          'cursor-pointer transition-colors duration-150 min-h-[140px] p-6',
          dragOver
            ? 'border-white/40 bg-white/8'
            : 'border-white/15 hover:border-white/30 bg-white/3',
          uploading && 'pointer-events-none'
        )}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        role="button"
        tabIndex={0}
        aria-label="Upload file"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {uploading ? (
          <>
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <div className="w-full max-w-[160px] h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-white/40">Uploading... {progress}%</span>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-white/8">
              {accept.includes('video') ? (
                <Upload size={20} className="text-white/60" />
              ) : (
                <ImageIcon size={20} className="text-white/60" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60">
                <span className="text-white/90 font-medium">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                {accept === 'image/*' ? 'PNG, JPG, WebP, GIF' : accept} · Max 100MB
              </p>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// Multi-file variant
interface MultiUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  accept?: string;
  maxFiles?: number;
}

export function MultiUpload({
  values,
  onChange,
  folder = 'general',
  label,
  accept = 'image/*',
  maxFiles = 20,
}: MultiUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) return data.url as string;
    return null;
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files).slice(0, maxFiles - values.length)) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    onChange([...values, ...urls]);
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-white/80">{label}</span>}

      {/* Grid of uploaded files */}
      {values.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {values.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
              <Image src={url} alt={`Upload ${i + 1}`} fill className="object-cover" sizes="100px" />
              <button
                type="button"
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 p-1 bg-black/60 rounded text-white/60 hover:text-white"
                aria-label="Remove"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {values.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 p-4 cursor-pointer',
            'hover:border-white/30 hover:bg-white/5 transition-colors text-white/40 hover:text-white/60'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          <span className="text-xs">
            {uploading ? 'Uploading…' : `Add files (${values.length}/${maxFiles})`}
          </span>
        </div>
      )}
    </div>
  );
}
