import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { 
  DocumentArrowDownIcon, 
  PlayCircleIcon, 
  FolderIcon, 
  ArrowUpTrayIcon
} from "@heroicons/react/24/outline";

export default function KnowledgeBase() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("knowledge-base/");
        setDocs(res.data || []);
      } catch (err) {
        console.error("Fetch docs failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-slate-50 font-sans">
       <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Knowledge Base</h1>
            <p className="text-slate-500 font-medium">Training materials, policy documents, and SOPs.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition">
             <ArrowUpTrayIcon className="h-5 w-5" /> Upload Resource
          </button>
       </div>

       {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>)}
          </div>
       ) : docs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
             <FolderIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-slate-500">No documents found</h3>
             <p className="text-sm text-slate-400">Upload training videos or PDFs to get started.</p>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {docs.map((doc) => (
                <div key={doc.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group cursor-pointer">
                   <div className={`h-32 rounded-xl flex items-center justify-center mb-4 ${
                      doc.type === 'VIDEO' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                   }`}>
                      {doc.type === 'VIDEO' ? <PlayCircleIcon className="h-12 w-12 group-hover:scale-110 transition" /> : <DocumentArrowDownIcon className="h-12 w-12 group-hover:scale-110 transition" />}
                   </div>
                   <h3 className="font-bold text-slate-800 line-clamp-1">{doc.title}</h3>
                   <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">{doc.category}</span>
                      <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{doc.size || "2 MB"}</span>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
}