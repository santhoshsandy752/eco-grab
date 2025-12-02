import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, Video } from 'lucide-react';

interface ActionUploadProps {
  onUploadComplete: (points: number) => void;
}

const ActionUpload: React.FC<ActionUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; points: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!file) return;

    setIsAnalyzing(true);
    // Simulate AI Analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      const pointsEarned = 10; // Standard reward
      setResult({
        success: true,
        message: "Great job! We verified your eco-friendly action.",
        points: pointsEarned
      });
      onUploadComplete(pointsEarned);
    }, 2500);
  };

  if (result?.success) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-bounce">
          <Check size={48} strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Verified!</h2>
        <p className="text-slate-500 mb-8">{result.message}</p>
        <div className="text-4xl font-black text-orange-500 mb-8">+{result.points} PTS</div>
        <button 
          onClick={clearFile}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Upload Another
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 h-[calc(100vh-140px)] flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Contribute & Earn</h2>
      
      <div className="flex-1 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center group hover:border-green-400 transition-colors">
        
        {preview ? (
            <div className="relative w-full h-full">
                {file?.type.startsWith('video') ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        <Video className="text-white opacity-50 mb-2" size={48} />
                        <p className="text-white text-xs absolute bottom-4">Video Selected</p>
                    </div>
                ) : (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                )}
                <button 
                  onClick={clearFile}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 backdrop-blur-sm"
                >
                  <X size={20} />
                </button>
            </div>
        ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center cursor-pointer p-8 w-full h-full"
            >
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Upload className="text-green-500" size={32} />
              </div>
              <p className="text-slate-600 font-medium mb-1">Tap to upload proof</p>
              <p className="text-slate-400 text-xs text-center px-4">Videos of cleaning, planting, or recycling (Max 30s)</p>
            </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/*" 
          onChange={handleFileChange}
        />
      </div>

      <div className="mt-4">
        <button
          disabled={!file || isAnalyzing}
          onClick={handleSubmit}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
            !file 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin" /> Analyzing...
            </>
          ) : (
            'Submit for Review'
          )}
        </button>
      </div>
    </div>
  );
};

export default ActionUpload;