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
      const r = await axios.get(`${API}/mentor/profile`, { headers: authHeader() });
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1E293B' }}>Custom Profile Sections</h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: C.slate }}>Add rich text, markdown, and images to your public profile.</p>
        </div>
        <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.indigo, color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={15} /> Add Section
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}><Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite', color: C.indigo }} /></div>
      ) : sections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: `2px dashed ${C.border}`, borderRadius: '16px' }}>
          <p style={{ fontSize: '32px', margin: '0 0 8px' }}>📝</p>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', margin: '0 0 4px' }}>No custom sections yet</p>
          <p style={{ fontSize: '13px', color: C.slate, margin: '0 0 16px' }}>Add sections like "My Journey", "Testimonials", or "Setup" to build trust.</p>
          <button onClick={openNew} style={{ background: C.indigo, color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>+ Add First Section</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sections.map((sec, index) => (
            <div key={sec._id} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: '14px', padding: '16px 20px', display: 'flex', gap: '14px', opacity: sec.isVisible ? 1 : 0.6 }}>
              <div style={{ color: '#CBD5E1', cursor: 'grab', marginTop: '4px' }} title="Drag to reorder (Coming soon)">
                <GripVertical size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>{sec.title || 'Untitled Section'}</h3>
                  {!sec.isVisible && <span style={{ fontSize: '11px', background: '#F1F5F9', color: C.slate, padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>Hidden</span>}
                </div>
                {sec.content && (
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: C.slate, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {sec.content.replace(/[#_*~]/g, '')}
                  </p>
                )}
                {sec.images?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    {sec.images.map((img, i) => (
                      <div key={i} style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0, alignItems: 'flex-start' }}>
                <button onClick={() => toggleVisibility(sec)} title={sec.isVisible ? 'Hide from profile' : 'Show on profile'} style={{ background: C.bg, border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: C.indigo }}>
                  {sec.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => openEdit(sec)} style={{ background: C.bg, border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: C.indigo }}><Edit2 size={14} /></button>
                <button onClick={() => del(sec._id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: C.red }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#1E293B', fontSize: '18px' }}>{editId ? 'Edit Section' : 'Add Profile Section'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Section Title</label>
              <input 
                value={form.title} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                placeholder="e.g. My Career Journey" 
                style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ marginBottom: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: C.slate }}>Content (Rich Text / Markdown)</label>
                <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '8px', padding: '2px' }}>
                  <button onClick={() => setPreviewMode(false)} style={{ background: !previewMode ? '#fff' : 'transparent', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, color: !previewMode ? '#1E293B' : C.slate, cursor: 'pointer', boxShadow: !previewMode ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>Write</button>
                  <button onClick={() => setPreviewMode(true)} style={{ background: previewMode ? '#fff' : 'transparent', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, color: previewMode ? '#1E293B' : C.slate, cursor: 'pointer', boxShadow: previewMode ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>Preview</button>
                </div>
              </div>

              {previewMode ? (
                <div style={{ width: '100%', height: '200px', border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '12px 16px', fontSize: '14px', overflowY: 'auto', background: '#FAFBFF', boxSizing: 'border-box' }}>
                  {form.content ? <ReactMarkdown>{form.content}</ReactMarkdown> : <span style={{ color: '#94A3B8' }}>Nothing to preview...</span>}
                </div>
              ) : (
                <textarea 
                  value={form.content} 
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))} 
                  rows={8}
                  placeholder="Tell your story using markdown for **bold**, *italic*, lists, etc..." 
                  style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} 
                />
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '8px' }}>Images attached to this section</label>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {form.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '10px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                    <img src={img} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                <label style={{ width: '80px', height: '80px', borderRadius: '10px', border: `2px dashed ${C.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.slate, cursor: uploadingImg ? 'wait' : 'pointer', background: '#F8FAFC' }}>
                  {uploadingImg ? <Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite' }} /> : <><ImageIcon size={20} style={{ marginBottom: '4px' }} /><span style={{ fontSize: '10px', fontWeight: 600 }}>Upload</span></>}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImg} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '24px', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
              <input type="checkbox" checked={form.isVisible} onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))} style={{ accentColor: C.indigo, width: '16px', height: '16px' }} />
              Make this section visible on my public profile
            </label>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={{ background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '12px', padding: '14px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ flex: 1, background: C.indigo, color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {saving && <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />}
                {saving ? 'Saving...' : 'Save Section'}
              </button>
            </div>
            
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
