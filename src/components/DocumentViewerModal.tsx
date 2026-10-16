import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText, Loader2 } from 'lucide-react';
import { downloadResumeFile, buildPdfFromJpeg } from '../services/cloudinaryService';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  filename?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  url,
  filename = 'Resume_Document.pdf'
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Guarantee .pdf extension
  const cleanBase = (filename || 'Resume').replace(/\.[^/.]+$/, '');
  const pdfFilename = `${cleanBase}.pdf`;

  useEffect(() => {
    if (!isOpen || !url) {
      setPdfBlobUrl(null);
      setIsLoading(false);
      return;
    }

    let active = true;
    let createdObjectUrl: string | null = null;

    async function loadPdfBlob() {
      setIsLoading(true);

      try {
        // 1. Try direct fetch of the original PDF
        const res = await fetch(url);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('pdf')) {
            const blob = await res.blob();
            if (active) {
              const bUrl = URL.createObjectURL(blob);
              createdObjectUrl = bUrl;
              setPdfBlobUrl(bUrl);
              setIsLoading(false);
            }
            return;
          }
        }

        // 2. If Cloudinary blocks raw PDF delivery (HTTP 401 ACL failure):
        // Fetch high-res render and wrap into valid PDF document in-memory
        if (url.includes('/image/upload/')) {
          const jpgUrl = url.replace(/\.[^/.]+$/, '') + '.jpg';
          const jpgRes = await fetch(jpgUrl);
          if (jpgRes.ok) {
            const arr = await jpgRes.arrayBuffer();
            const pdfBlob = buildPdfFromJpeg(new Uint8Array(arr));
            if (active) {
              const bUrl = URL.createObjectURL(pdfBlob);
              createdObjectUrl = bUrl;
              setPdfBlobUrl(bUrl);
              setIsLoading(false);
            }
            return;
          }
        }

        // 3. Fallback
        if (active) {
          setPdfBlobUrl(url);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('PDF blob load error, attempting fallback:', err);
        try {
          if (url.includes('/image/upload/')) {
            const jpgUrl = url.replace(/\.[^/.]+$/, '') + '.jpg';
            const jpgRes = await fetch(jpgUrl);
            if (jpgRes.ok) {
              const arr = await jpgRes.arrayBuffer();
              const pdfBlob = buildPdfFromJpeg(new Uint8Array(arr));
              if (active) {
                const bUrl = URL.createObjectURL(pdfBlob);
                createdObjectUrl = bUrl;
                setPdfBlobUrl(bUrl);
                setIsLoading(false);
              }
              return;
            }
          }
        } catch {
          // ignore
        }
        if (active) {
          setPdfBlobUrl(url);
          setIsLoading(false);
        }
      }
    }

    loadPdfBlob();

    return () => {
      active = false;
      if (createdObjectUrl) {
        URL.revokeObjectURL(createdObjectUrl);
      }
    };
  }, [isOpen, url]);

  if (!isOpen || !url) return null;

  const handleDownload = () => {
    downloadResumeFile(url, pdfFilename);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {pdfFilename}
              </h3>
              <p className="text-[11px] text-slate-500 truncate">
                Verified Candidate Engineering Resume (PDF)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Download PDF file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {pdfBlobUrl && (
              <a
                href={pdfBlobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 bg-slate-100 flex items-center justify-center relative overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span>Loading verified PDF document...</span>
            </div>
          ) : pdfBlobUrl ? (
            <iframe
              src={pdfBlobUrl}
              title={pdfFilename}
              className="w-full h-full border-0 bg-white"
            />
          ) : (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800">Ready to download</div>
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer"
              >
                Download PDF Document
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Candidate Verified Document</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md cursor-pointer hover:bg-slate-50"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
