/**
 * CustomSectionsTab.jsx
 * Allows mentors to add rich text (markdown) sections and upload images
 * to their public profile (e.g. "My Journey", "Testimonials").
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon, X, Loader2, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API = config.API_BASE_URL;
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
const C = { indigo: '#4F46E5', bg: '#EEF2FF', border: '#E2E8F0', slate: '#64748B', red: '#DC2626', green: '#059669' };

export default function CustomSectionsTab() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [form, setForm] = useState({ title: '', content: '', isVisible: true, images: [] });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/mentors/my-profile`, { headers: authHeader() });
      const profile = r.data.profile || r.data;
      setSections((profile.customSections || []).sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { loadProfile(); }, []);

  const openNew = () => {
    setEditId(null);
    setForm({ title: '', content: '', isVisible: true, images: [] });
    setPreviewMode(false);
    setShowModal(true);
  };

  const openEdit = (sec) => {
    setEditId(sec._id);
    setForm({ title: sec.title || '', content: sec.content || '', isVisible: sec.isVisible, images: sec.images || [] });
    setPreviewMode(false);
    setShowModal(true);
  };

  const save = async () => {
    if (!form.title.trim() && !form.content.trim() && form.images.length === 0) return;
    setSaving(true);
    try {
      const payload = { ...form, sortOrder: editId ? undefined : sections.length };
      if (editId) {
        await axios.put(`${API}/mentor/profile/sections/${editId}`, payload, { headers: authHeader() });
      } else {
        await axios.post(`${API}/mentor/profile/sections`, payload, { headers: authHeader() });
      }
      setShowModal(false);
      loadProfile();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to save section');
    }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Delete this section?')) return;
    try {
      await axios.delete(`${API}/mentor/profile/sections/${id}`, { headers: authHeader() });
      loadProfile();
    } catch (e) { alert('Failed to delete'); }
  };

  const toggleVisibility = async (sec) => {
    try {
      await axios.put(`${API}/mentor/profile/sections/${sec._id}`, { isVisible: !sec.isVisible }, { headers: authHeader() });
      loadProfile();
    } catch (e) { alert('Failed to update visibility'); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) return alert('Image must be less than 5MB');

    setUploadingImg(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const r = await axios.post(`${API}/mentor/profile/upload-image`, formData, {
        headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
      });
      setForm(f => ({ ...f, images: [...f.images, r.data.imageUrl] }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload image');
    }
    setUploadingImg(false);
    e.target.value = ''; // reset file input
  };

  const removeImage = (index) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Custom Sections</h2>
          <p className="text-slate-500 text-sm mt-1">Add rich text, markdown, and images to your public profile.</p>
        </div>
        <button onClick={openNew} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-bold shadow-sm transition-all">
          <Plus size={18} /> Add Section
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-slate-400"><Loader2 size={32} className="animate-spin" /></div>
      ) : sections.length === 0 ? (
        <div className="text-center p-12 bg-white border border-dashed border-slate-200 rounded-2xl max-w-lg mx-auto shadow-sm">
          <p className="text-4xl mb-3">📝</p>
          <p className="font-bold text-slate-800 mb-1">No custom sections yet</p>
          <p className="text-slate-500 text-xs mb-6">Add items like "My Journey", "Testimonials" to build trust with mentees.</p>
          <button onClick={openNew} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-sm">+ Create Section</button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((sec, index) => (
            <div key={sec._id} className={`group bg-white p-6 rounded-2xl flex items-center justify-between border border-slate-200/40 hover:shadow-md transition-all duration-300 ${!sec.isVisible ? 'opacity-60 bg-slate-50/50' : 'shadow-sm'}`}>
              <div className="flex items-start gap-4 flex-1">
                <div className="text-slate-300 cursor-grab mt-1 group-hover:text-slate-400 transition-colors" title="Drag to reorder">
                  <GripVertical size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-sm">{sec.title || 'Untitled Section'}</h3>
                    {!sec.isVisible && (
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500">Hidden</span>
                    )}
                  </div>
                  {sec.content && (
                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                      {sec.content.replace(/[#_*~]/g, '')}
                    </p>
                  )}
                  {sec.images?.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {sec.images.map((img, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={() => toggleVisibility(sec)} 
                  title={sec.isVisible ? 'Hide from profile' : 'Show on profile'}
                  className={`p-1.5 rounded-lg transition-colors ${sec.isVisible ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  {sec.isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button 
                  onClick={() => openEdit(sec)} 
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Edit2 size={15} />
                </button>
                <button 
                  onClick={() => del(sec._id)} 
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">{editId ? 'Edit Section' : 'Add Profile Section'}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-all">
                  <X size={18} />
                </button>
              </div>

              <form className="space-y-4" onSubmit={e => { e.preventDefault(); save(); }}>
                <div>
                  <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Section Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. My Career Journey" className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none required" required />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block">Content (Markdown)</label>
                    <div className="flex bg-slate-100 rounded-lg p-0.5">
                      <button type="button" onClick={() => setPreviewMode(false)} className={`px-2 py-1 text-[10px] font-bold rounded-md ${!previewMode ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>Write</button>
                      <button type="button" onClick={() => setPreviewMode(true)} className={`px-2 py-1 text-[10px] font-bold rounded-md ${previewMode ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>Preview</button>
                    </div>
                  </div>
                  
                  {previewMode ? (
                    <div className="w-full min-h-[160px] bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm overflow-y-auto prose prose-sm max-w-none">
                      {form.content ? <ReactMarkdown>{form.content}</ReactMarkdown> : <span className="text-slate-400 italic">Nothing to preview...</span>}
                    </div>
                  ) : (
                    <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={6} placeholder="Tell your story using markdown for **bold**, *italic*, lists, etc..." className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none resize-none" />
                  )}
                </div>

                <div>
                  <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-2">Images attached</label>
                  <div className="flex gap-2 flex-wrap">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
                        <img src={img} alt="uploaded" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <label className={`w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-all ${uploadingImg && 'animate-pulse'}`}>
                      {uploadingImg ? <Loader2 size={16} className="animate-spin" /> : <><ImageIcon size={18} /><span className="text-[8px] font-bold mt-1">Upload</span></>}
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImg} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input type="checkbox" id="isVisible" checked={form.isVisible} onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))} className="rounded text-indigo-600 focus:ring-0 cursor-pointer" />
                  <label htmlFor="isVisible" className="text-xs font-semibold text-slate-600 cursor-pointer">Make visible on public profile</label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving && <Loader2 size={16} className="animate-spin" />}
                    {saving ? 'Saving...' : 'Save Section'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-all">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
