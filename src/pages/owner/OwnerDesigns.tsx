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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Designs Management</h1>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add {activeTab === 'colors' ? 'Color' : 'Pattern'}
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('colors')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'colors'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Colors
        </button>
        <button
          onClick={() => setActiveTab('patterns')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'patterns'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Patterns
        </button>
      </div>

      {isFormOpen && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">
            {editingId ? 'Edit' : 'Add'} {activeTab === 'colors' ? 'Color' : 'Pattern'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {activeTab === 'colors' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Hex Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.hex_color || '#000000'}
                    onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })}
                    className="h-10 w-10 cursor-pointer rounded-md border border-gray-300 p-1"
                  />
                  <input
                    type="text"
                    value={formData.hex_color}
                    onChange={(e) => setFormData({ ...formData, hex_color: e.target.value })}
                    placeholder="#000000"
                    className="block flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Texture Image</label>
              <div className="mt-1 flex items-center gap-4">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-16 w-16 rounded-md object-cover border border-gray-200"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
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
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!isFormOpen && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                  {activeTab === 'colors' && (
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hex</th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {(activeTab === 'colors' ? colors : patterns).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded-full object-cover border" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border">
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    {activeTab === 'colors' && (
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: (item as DesignColor).hex_color || 'transparent' }}
                          />
                          {(item as DesignColor).hex_color}
                        </div>
                      </td>
                    )}
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => openForm(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(activeTab === 'colors' ? colors : patterns).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
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
