import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon } from 'lucide-react';

export type DesignColor = {
  id: string;
  name: string;
  hex_color: string | null;
  image_url: string | null;
  created_at: string;
};

export type DesignPattern = {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
};

export default function OwnerDesigns() {
  const [activeTab, setActiveTab] = useState<'colors' | 'patterns'>('colors');
  const [colors, setColors] = useState<DesignColor[]>([]);
  const [patterns, setPatterns] = useState<DesignPattern[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    hex_color?: string;
    image_url?: string;
  }>({ name: '', hex_color: '', image_url: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'colors') {
        const { data, error } = await supabase
          .from('design_colors' as any)
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        setColors((data as any) || []);
      } else {
        const { data, error } = await supabase
          .from('design_patterns' as any)
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        setPatterns((data as any) || []);
      }
    } catch (err) {
      console.error('Error fetching designs:', err);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  }

  function openForm(item?: DesignColor | DesignPattern) {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        hex_color: 'hex_color' in item ? item.hex_color || '' : '',
        image_url: item.image_url || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', hex_color: '', image_url: '' });
    }
    setIsFormOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `designs/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('store')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('store').getPublicUrl(filePath);
      
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === 'colors') {
        const payload = {
          name: formData.name,
          hex_color: formData.hex_color || null,
          image_url: formData.image_url || null,
        };

        if (editingId) {
          const { error } = await supabase.from('design_colors' as any).update(payload).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('design_colors' as any).insert([payload]);
          if (error) throw error;
        }
      } else {
        const payload = {
          name: formData.name,
          image_url: formData.image_url || null,
        };

        if (editingId) {
          const { error } = await supabase.from('design_patterns' as any).update(payload).eq('id', editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('design_patterns' as any).insert([payload]);
          if (error) throw error;
        }
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving:', err);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const table = activeTab === 'colors' ? 'design_colors' : 'design_patterns';
      const { error } = await supabase.from(table as any).delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Failed to delete');
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-brand-cream">Designs Management</h2>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange/80"
        >
          <Plus className="h-4 w-4" />
          Add {activeTab === 'colors' ? 'Color' : 'Pattern'}
        </button>
      </div>

      <div className="flex gap-4 border-b border-brand-medium/35">
        <button
          onClick={() => setActiveTab('colors')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'colors'
              ? 'border-b-2 border-brand-orange text-brand-orange'
              : 'text-brand-light hover:text-brand-cream'
          }`}
        >
          Colors
        </button>
        <button
          onClick={() => setActiveTab('patterns')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'patterns'
              ? 'border-b-2 border-brand-orange text-brand-orange'
              : 'text-brand-light hover:text-brand-cream'
          }`}
        >
          Patterns
        </button>
      </div>

      {isFormOpen && (
        <div className="rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-brand-cream">
            {editingId ? 'Edit' : 'Add'} {activeTab === 'colors' ? 'Color' : 'Pattern'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-light">Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
              />
            </div>

            {activeTab === 'colors' && (
              <div>
                <label className="block text-sm font-medium text-brand-light">Hex Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.hex_color || '#000000'}
                    onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })}
                    className="h-10 w-10 cursor-pointer rounded-md border border-brand-medium/50 p-1 bg-brand-dark"
                  />
                  <input
                    type="text"
                    value={formData.hex_color}
                    onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })}
                    placeholder="#000000"
                    className="block flex-1 rounded-md border border-brand-medium/50 bg-brand-dark px-3 py-2 text-white shadow-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-light">Texture Image</label>
              <div className="mt-1 flex items-center gap-4">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-16 w-16 rounded-md object-cover border border-brand-medium/50"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-brand-medium/50 bg-brand-dark">
                    <ImageIcon className="h-6 w-6 text-brand-light" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer rounded-md border border-brand-medium/50 bg-brand-dark px-3 py-2 text-sm font-medium text-brand-cream shadow-sm hover:bg-brand-medium/30 transition-colors">
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                      </span>
                    ) : (
                      'Upload Image'
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-md border border-brand-medium/50 bg-brand-dark px-4 py-2 text-sm font-medium text-brand-light hover:bg-brand-medium/30 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-orange/80 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!isFormOpen && (
        <div className="overflow-x-auto rounded-lg border border-brand-medium/35 bg-brand-dark-alt">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
            </div>
          ) : (
            <table className="w-full min-w-[600px] divide-y divide-brand-medium/35">
              <thead className="bg-brand-medium/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-brand-light">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-brand-light">Name</th>
                  {activeTab === 'colors' && (
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-brand-light">Hex</th>
                  )}
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-brand-light">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-medium/35 bg-brand-dark-alt">
                {(activeTab === 'colors' ? colors : patterns).map((item) => (
                  <tr key={item.id} className="hover:bg-brand-medium/20">
                    <td className="whitespace-nowrap px-4 py-3">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded-full object-cover border border-brand-medium/50" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-brand-dark flex items-center justify-center border border-brand-medium/50">
                          <ImageIcon className="h-4 w-4 text-brand-light" />
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                      {item.name}
                    </td>
                    {activeTab === 'colors' && (
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-brand-light">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full border border-brand-medium/50"
                            style={{ backgroundColor: (item as DesignColor).hex_color || 'transparent' }}
                          />
                          {(item as DesignColor).hex_color}
                        </div>
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => openForm(item)}
                          className="text-brand-light hover:text-brand-orange transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-brand-light hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(activeTab === 'colors' ? colors : patterns).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-brand-light">
                      No {activeTab} found. Add your first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
