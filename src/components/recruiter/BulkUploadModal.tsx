import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { FieldError } from '../common/FieldError';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (count: number) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewParsed, setPreviewParsed] = useState<
    { name: string; phone: string; title: string; location: string }[]
  >([]);

  if (!isOpen) return null;

  const mockParsedData = [
    { name: 'Sanjay Deshmukh', phone: '+91 98211 00112', title: 'Delivery Partner', location: 'Andheri West' },
    { name: 'Deepak Kulkarni', phone: '+91 98211 00113', title: 'Warehouse Associate', location: 'Bhiwandi' },
    { name: 'Sunita Patil', phone: '+91 98211 00114', title: 'Customer Executive', location: 'Thane' },
    { name: 'Karan Mehra', phone: '+91 98211 00115', title: 'Field Sales', location: 'Connaught Place' },
  ];

  const processFile = (file: File) => {
    setFileError(null);
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setFileError('Invalid file format. Please upload a .CSV or .XLSX Excel spreadsheet.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10MB limit.');
      return;
    }

    setFileSelected(file.name);
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      setPreviewParsed(mockParsedData);
    }, 800);
  };

  const handleSimulateSelect = (filename: string) => {
    setFileError(null);
    setFileSelected(filename);
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      setPreviewParsed(mockParsedData);
    }, 800);
  };

  const handleConfirmImport = () => {
    onUploadComplete(previewParsed.length);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg mb-1">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Bulk Candidate Import (CSV / Excel)
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Upload candidate rosters from Excel / CSV. All data processed securely in local demo memory.
        </p>

        {!fileSelected ? (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
              }}
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  processFile(file);
                } else {
                  handleSimulateSelect('candidate_roster_mumbai_q1.csv');
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                dragActive ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-emerald-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-xs">Drag & drop CSV/XLSX candidate file here</p>
              <p className="text-[11px] text-slate-400 mt-1">or click to browse local spreadsheet</p>
            </div>
            <div className="mt-2">
              <FieldError error={fileError} touched={true} />
            </div>
          </div>
        ) : parsing ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-700">Parsing Candidate Fields & Validating Duplicate Records...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs flex items-center justify-between">
              <span className="font-bold text-emerald-900">✓ Parsed {previewParsed.length} Valid Candidates</span>
              <span className="text-[10px] text-emerald-700 font-medium">File: {fileSelected}</span>
            </div>

            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              {previewParsed.map((p, i) => (
                <div key={i} className="p-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{p.name}</p>
                    <p className="text-[10px] text-slate-500">{p.title} • {p.location}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{p.phone}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setFileSelected(null)} className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                Re-select File
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Import {previewParsed.length} Candidates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
