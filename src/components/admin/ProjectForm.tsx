'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject, updateProject } from '@/lib/actions/projects';
import type { Project } from '@/types';
import { CATEGORIES, SOFTWARE_LIST } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import ImageUpload, { MultiUpload } from '@/components/ui/ImageUpload';
import { X, Plus } from 'lucide-react';

interface ProjectFormProps {
  project?: Project;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const [form, setForm] = useState({
    title: project?.title ?? '',
    description: project?.description ?? '',
    brief: project?.brief ?? '',
    category: project?.category ?? '',
    client: project?.client ?? '',
    timeline: project?.timeline ?? '',
    projectUrl: project?.projectUrl ?? '',
    featured: project?.featured ?? false,
    published: project?.published ?? true,
    coverImage: project?.coverImage ?? '',
    thumbnail: project?.thumbnail ?? '',
  });

  const [tags, setTags] = useState<string[]>(project?.tags ?? []);
  const [software, setSoftware] = useState<string[]>(project?.software ?? []);
  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const [videos, setVideos] = useState<string[]>(project?.videos ?? []);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      setError('Title, description and category are required.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = {
        ...form,
        tags,
        software,
        images,
        videos,
      };

      if (isEditing) {
        await updateProject(project.id, data);
      } else {
        await createProject(data);
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl" noValidate>
      {error && (
        <p role="alert" className="text-xs text-red-400 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </p>
      )}

      {/* Basic info */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
          Basic Info
        </h2>
        <Input
          label="Title *"
          placeholder="Project title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
        <Textarea
          label="Short Description *"
          placeholder="1–2 sentence summary shown in cards"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={3}
          required
        />
        <Textarea
          label="Full Brief"
          placeholder="Detailed project description (shown on detail page)"
          value={form.brief}
          onChange={(e) => setForm((f) => ({ ...f, brief: e.target.value }))}
          rows={5}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category *"
            options={CATEGORIES as unknown as { value: string; label: string }[]}
            placeholder="Select category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            required
          />
          <Input
            label="Client"
            placeholder="Client / Brand name"
            value={form.client}
            onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Timeline"
            placeholder="e.g. 2 weeks"
            value={form.timeline}
            onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
          />
          <Input
            label="Project URL"
            type="url"
            placeholder="https://"
            value={form.projectUrl}
            onChange={(e) => setForm((f) => ({ ...f, projectUrl: e.target.value }))}
          />
        </div>
      </section>

      {/* Tags */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Tags</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="Add tag and press Enter"
            className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            type="button"
            onClick={addTag}
            className="h-9 px-3 rounded-lg bg-white/8 text-white/60 hover:text-white hover:bg-white/12 transition-colors"
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/8 text-xs text-white/60"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="hover:text-white transition-colors"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={10} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Software */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Software Used</h2>
        <div className="flex flex-wrap gap-2">
          {SOFTWARE_LIST.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                setSoftware((prev) =>
                  prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                )
              }
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                software.includes(s)
                  ? 'bg-white text-black'
                  : 'bg-white/6 text-white/50 border border-white/10 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Media */}
      <section className="space-y-5">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Media</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageUpload
            label="Cover Image"
            value={form.coverImage}
            onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
            folder="projects"
          />
          <ImageUpload
            label="Thumbnail"
            value={form.thumbnail}
            onChange={(url) => setForm((f) => ({ ...f, thumbnail: url }))}
            folder="projects"
          />
        </div>

        <MultiUpload
          label="Gallery Images"
          values={images}
          onChange={setImages}
          folder="projects"
          accept="image/*"
          maxFiles={20}
        />

        <MultiUpload
          label="Videos"
          values={videos}
          onChange={setVideos}
          folder="projects/videos"
          accept="video/*"
          maxFiles={5}
        />
      </section>

      {/* Flags */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Visibility</h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="w-4 h-4 rounded bg-white/10 border-white/20 accent-white"
            />
            <span className="text-sm text-white/70">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 rounded bg-white/10 border-white/20 accent-white"
            />
            <span className="text-sm text-white/70">Featured on homepage</span>
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/8">
        <Button type="submit" loading={loading}>
          {isEditing ? 'Save Changes' : 'Create Project'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/projects')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
