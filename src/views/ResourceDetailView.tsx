import React, { useState } from 'react';
import { ChevronLeft, Bookmark, Copy, Check, MessageSquare, ShieldCheck, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_RESOURCES } from '../data/mockData';

interface ResourceDetailViewProps {
  resourceId?: string;
}

export const ResourceDetailView: React.FC<ResourceDetailViewProps> = ({ resourceId }) => {
  const { navigate, language, toggleSaveItem, isItemSaved, sendMessage, routeParams, currentRoute } = useApp();
  const [copied, setCopied] = useState(false);

  const isFr = language === 'fr';

  const effectiveId = resourceId || routeParams?.resourceId || (currentRoute.startsWith('/resources/') ? currentRoute.replace('/resources/', '') : 'res-handbook');
  const resource = INITIAL_RESOURCES.find((r) => r.id === effectiveId) || INITIAL_RESOURCES[0];
  const saved = isItemSaved(resource.title);

  const handleCopy = () => {
    navigator.clipboard.writeText(resource.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAIAboutResource = () => {
    sendMessage(
      isFr
        ? `Pouvez-vous m'expliquer les points clés du document "${resource.title}" (${resource.description}) ?`
        : `Can you explain the key regulations and implications of the document "${resource.title}"?`
    );
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] pb-24 p-4 sm:p-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate('/resources')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#17233B] hover:bg-slate-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold text-[#68758B] uppercase tracking-wider">
          {resource.category}
        </span>
        <button
          onClick={() =>
            toggleSaveItem({
              type: 'resource',
              title: resource.title,
              subtitle: resource.description,
              data: resource
            })
          }
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
            saved ? 'bg-[#EEF5FF] border-blue-300 text-[#1463F3]' : 'border-slate-200 text-slate-400'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#1463F3]' : ''}`} />
        </button>
      </div>

      {/* Resource Document Container */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E1E8F2] shadow-2xs mb-6">
        <h1 className="text-xl font-extrabold text-[#17233B] tracking-tight mb-2">
          {resource.title}
        </h1>
        <p className="text-xs text-[#68758B] mb-4">
          {resource.description}
        </p>

        {/* Source provenance */}
        <div className="flex flex-wrap items-center gap-3 py-2 px-3 rounded-xl bg-[#F6F8FC] border border-slate-100 text-[11px] text-[#68758B] mb-5">
          <div className="flex items-center gap-1.5 text-[#1463F3] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{resource.officialSource}</span>
          </div>
          <span>·</span>
          <span>{resource.lastUpdated}</span>
          <span>·</span>
          <span>{resource.fileFormat}</span>
        </div>

        {/* Document Body */}
        <div className="prose prose-sm max-w-none text-xs text-[#17233B] leading-relaxed whitespace-pre-wrap font-sans border-t border-slate-100 pt-4">
          {resource.content}
        </div>

        {/* Action bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-[#68758B] hover:text-[#1463F3] font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isFr ? 'Texte copié !' : 'Copied!') : (isFr ? 'Copier le texte' : 'Copy Text')}</span>
          </button>

          <button
            onClick={handleAskAIAboutResource}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1463F3] bg-[#EEF5FF] px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isFr ? 'Interroger My UB Guide sur ce texte' : 'Ask AI About This Guide'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
