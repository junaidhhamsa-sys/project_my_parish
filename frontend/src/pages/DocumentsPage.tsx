import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DocumentItem } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, Search, Plus, FileText, Download, ShieldCheck, Tag, Trash2, AlertTriangle } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { showToast } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Policies',
    file_path: '/documents/parish_doc.pdf',
    access_level: 'Public',
    version: 'v1.0',
    description: ''
  });

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.getDocuments(categoryFilter);
      setDocuments(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [categoryFilter]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDocument(uploadForm);
      showToast('Document uploaded to library!', 'success');
      setIsUploadOpen(false);
      setUploadForm({
        title: '',
        category: 'Policies',
        file_path: '/documents/parish_doc.pdf',
        access_level: 'Public',
        version: 'v1.0',
        description: ''
      });
      loadDocuments();
    } catch (e) {
      showToast('Failed to upload document', 'error');
    }
  };

  const handleDownload = async (doc: DocumentItem) => {
    try {
      setDownloadingId(doc.id);
      showToast(`Initiating download for '${doc.title}'...`, 'info');
      
      const response = await fetch(`/api/v1/documents/${doc.id}/download`);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const cleanTitle = doc.title.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${cleanTitle}_${doc.version || 'v1.0'}.txt`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showToast(`Downloaded '${doc.title}' successfully!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to download ${doc.title}`, 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!docToDelete) return;
    try {
      await api.deleteDocument(docToDelete.id);
      showToast(`Document '${docToDelete.title}' removed`, 'success');
      setDocToDelete(null);
      loadDocuments();
    } catch (e) {
      showToast('Failed to delete document', 'error');
    }
  };

  const categories = ['All', 'Policies', 'Forms', 'Reports', 'Guidelines', 'Meeting Documents', 'Community Resources'];

  const filteredDocs = documents.filter(d => 
    search === '' || 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    (d.description && d.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Parish Document Library</h1>
          <p className="text-xs text-slate-500 font-medium">Official governance policies, intake forms, audit reports, and guidelines</p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by title or description..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <span className="text-xs font-bold text-slate-400">{filteredDocs.length} Documents Available</span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              categoryFilter === c
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
          Loading document library...
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-2">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold">No documents found</p>
          <p className="text-slate-400">Click "Upload Document" above to add a file to the library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={doc.access_level === 'Public' ? 'success' : 'warning'}>{doc.access_level}</Badge>
                    <button
                      onClick={() => setDocToDelete(doc)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Category: {doc.category} • {doc.version}</p>
                </div>

                {doc.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {doc.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-medium">
                  <span>Size: {doc.file_size || '1.2 MB'}</span>
                  <span>Type: {doc.file_type || 'PDF'}</span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(doc)}
                disabled={downloadingId === doc.id}
                className="w-full py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2 mt-2 shadow-sm disabled:opacity-50"
              >
                <Download className={`w-4 h-4 text-slate-600 ${downloadingId === doc.id ? 'animate-bounce' : ''}`} />
                <span>{downloadingId === doc.id ? 'Downloading...' : 'Download Official Document'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Document to Library"
        subtitle="Add a new policy, form, or audit report"
      >
        <form onSubmit={handleUpload} className="space-y-4 font-sans">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Document Title *</label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder="e.g. Child Protection & Safeguarding Policy 2026"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Category</label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              >
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Access Level</label>
              <select
                value={uploadForm.access_level}
                onChange={(e) => setUploadForm({ ...uploadForm, access_level: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Public">Public</option>
                <option value="Members">Members Only</option>
                <option value="Admin">Admin Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Document Description</label>
            <textarea
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              placeholder="Brief summary of document guidelines..."
              rows={3}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
          >
            Upload & Publish Document
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <Modal
          isOpen={!!docToDelete}
          onClose={() => setDocToDelete(null)}
          title="Confirm Delete Document"
          subtitle="Remove file from parish library"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Are you sure you want to delete '{docToDelete.title}'?</p>
                <p className="text-[11px] text-rose-700 mt-1">
                  Category: {docToDelete.category} ({docToDelete.version}). This file will be removed from the library.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Yes, Delete Document
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
