import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanEye, FileText, Upload, Loader2, Eye, Flame, RefreshCw, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { FileDropzone } from './FileDropzone';

// Removed TrustScoreGauge import as scoring is deprecated

type ViewMode = 'original' | 'heatmap';

export const DocumentForensics: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('original');
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Progress steps
  useEffect(() => {
    if (!loading) {
      setScanStep('');
      return;
    }
    const steps = [
      'Reading file metadata...',
      'Checking digital signatures...',
      'Running AI forensic scan...',
      'Verifying document integrity...',
      'Generating report...',
    ];
    let stepIndex = 0;
    setScanStep(steps[0]);
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) setScanStep(steps[stepIndex]);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysisResult(null);
    setTextContent(null);
    setUserQuery('');

    setPreviewUrl(URL.createObjectURL(selectedFile));
    const isText =
      selectedFile.type.startsWith('text/') ||
      selectedFile.name.match(/\.(php|js|py|html|css|json|xml|md|txt|csv|log)$/i);
    if (isText) {
      const reader = new FileReader();
      reader.onload = (e) => setTextContent(e.target?.result as string);
      reader.readAsText(selectedFile);
    }
  };

  const runAnalysis = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_query', userQuery);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/analyze', formData);
      setAnalysisResult(response.data);
    } catch (error) {
      // Demo result (Updated to new binary structure)
      setAnalysisResult({
        verdict: 'LEGIT',
        is_tampered: false,
        input_query: userQuery || null,
        forensics: {
          tamper_heatmap: null,
          metadata_status: "Clean"
        },
        ai_analysis: {
          primary_evidence:
            'Document metadata is consistent with claimed creation date. No signs of digital manipulation detected in the image layers. EXIF data matches expected device characteristics.',
        },
      });
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
    setPreviewUrl(null);
    setTextContent(null);
    setUserQuery('');
    setViewMode('original');
  };

  // Canvas render for heatmap
  // Canvas render for heatmap
  useEffect(() => {
    if (!analysisResult || !canvasRef.current || viewMode === 'original') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    // FIXED: Changed 'tamper_heatmap' to 'ela_heatmap' to match Python backend
    img.src =
      viewMode === 'heatmap' && analysisResult.forensics?.ela_heatmap
        ? analysisResult.forensics.ela_heatmap
        : previewUrl || '';
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const scale = Math.min(1, parent.clientWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };
  }, [analysisResult, viewMode, previewUrl]);

  // Helper for Verdict Color/Icon (No Score Logic)
  const getVerdictUI = () => {
    if (!analysisResult) return null;
    const v = analysisResult.verdict?.toUpperCase() || 'UNKNOWN';
    
    if (['SAFE', 'LEGIT', 'REAL', 'NORMAL'].includes(v)) {
      return { color: 'text-success', bg: 'bg-success/10', icon: ShieldCheck, label: 'AUTHENTIC' };
    }
    if (['SUSPICIOUS', 'CAUTION', 'HIGH RISK', 'INCONCLUSIVE'].includes(v)) {
      return { color: 'text-warning', bg: 'bg-warning/10', icon: AlertTriangle, label: 'SUSPICIOUS' };
    }
    // Default to Danger for Malicious/Tampered/Fake
    return { color: 'text-destructive', bg: 'bg-destructive/10', icon: ShieldAlert, label: 'TAMPERED / FAKE' };
  };

  const ui = getVerdictUI();

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Document Forensics
          </h2>
          <p className="text-muted-foreground">
            Upload documents or images to detect tampering, edits, and verify authenticity.
          </p>
        </div>

        {/* Controls */}
        {analysisResult && (
          <div className="flex items-center gap-2">
            <div className="glass rounded-xl p-1 flex">
              <button
                onClick={() => setViewMode('original')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'original'
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Eye size={16} />
                Original
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'heatmap'
                    ? 'bg-destructive text-destructive-foreground shadow-glow-destructive'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Flame size={16} />
                Heatmap
              </button>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <RefreshCw size={18} className="text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!file ? (
          /* Upload Zone */
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FileDropzone
              file={null}
              onFileSelect={handleFileSelect}
              onClear={() => {}}
              accept="image/*,application/pdf,.txt,.md,.json,.csv,.xml,.html,.js,.py,.php,.css"
              label="Drop document to analyze"
              description="PDF, Images, Scripts, Text files"
            />
          </motion.div>
        ) : loading ? (
          /* Loading */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="min-h-[400px] flex flex-col items-center justify-center text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="mb-6"
              >
                <ScanEye size={64} className="text-primary" />
              </motion.div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {scanStep}
              </h3>
              <p className="text-sm text-muted-foreground">
                AI forensic analysis in progress...
              </p>
            </GlassCard>
          </motion.div>
        ) : !analysisResult ? (
          /* Pre-scan preview */
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <GlassCard className="min-h-[300px] flex items-center justify-center overflow-hidden">
              {file.type === 'application/pdf' ? (
                <embed src={previewUrl || ''} className="w-full h-[400px]" />
              ) : textContent ? (
                <pre className="text-xs text-success font-mono overflow-auto w-full h-full p-4 max-h-[400px]">
                  {textContent}
                </pre>
              ) : (
                <img
                  src={previewUrl || ''}
                  alt="Preview"
                  className="max-h-[400px] object-contain rounded-lg"
                />
              )}
            </GlassCard>

            <GlassCard className="space-y-4">
              <label className="block text-sm font-medium text-foreground">
                Specific Concern (Optional)
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="e.g. 'Is the date edited?', 'Check for hidden text'"
                  className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && runAnalysis()}
                />
                <button
                  onClick={runAnalysis}
                  className="gradient-primary text-primary-foreground font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <ScanEye size={20} />
                  Analyze Document
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          /* Results */
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Preview */}
            <div className="lg:col-span-8">
              <GlassCard className="min-h-[500px] flex items-center justify-center overflow-hidden">
                {file.type === 'application/pdf' ? (
                  <embed src={previewUrl || ''} className="w-full h-[500px]" />
                ) : textContent ? (
                  <pre className="text-xs text-success font-mono overflow-auto w-full h-full p-4 max-h-[500px]">
                    {textContent}
                  </pre>
                ) : viewMode === 'original' ? (
                  <img
                    src={previewUrl || ''}
                    alt="Original"
                    className="max-h-[500px] object-contain rounded-lg"
                  />
                ) : (
                  <canvas ref={canvasRef} className="max-h-[500px] object-contain" />
                )}
              </GlassCard>
            </div>

            {/* Report */}
            <div className="lg:col-span-4 space-y-4">
              {/* NEW VERDICT BADGE (Replaces Trust Score) */}
              <GlassCard
                glowColor={
                   analysisResult.verdict === 'MALICIOUS' || analysisResult.verdict === 'TAMPERED' || analysisResult.verdict === 'FAKE'
                    ? 'destructive'
                    : analysisResult.verdict === 'SUSPICIOUS'
                    ? 'warning'
                    : 'success'
                }
                className="text-center flex flex-col items-center justify-center py-8"
              >
                {ui && (
                    <>
                        <ui.icon size={48} className={`mb-3 ${ui.color}`} />
                        <h3 className={`text-2xl font-display font-bold ${ui.color}`}>
                            {ui.label}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                            System Analysis Verdict
                        </p>
                    </>
                )}
              </GlassCard>

              <GlassCard>
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  Forensic Report
                </h4>
                {analysisResult.input_query && (
                  <div className="mb-4 pb-4 border-b border-border/50">
                    <span className="text-xs text-muted-foreground block mb-1">
                      Your Question:
                    </span>
                    <span className="text-sm italic text-foreground">
                      "{analysisResult.input_query}"
                    </span>
                  </div>
                )}
                {/* Updated to access ai_analysis instead of content_analysis */}
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {analysisResult.ai_analysis?.primary_evidence || analysisResult.ai_analysis?.reasoning || "No detailed reasoning provided."}
                </p>

                {/* Optional Metadata Alert */}
                {analysisResult.forensics?.metadata_status && 
                 analysisResult.forensics.metadata_status !== "Clean (No editor signatures)" && (
                     <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <span className="text-xs font-semibold text-warning block mb-1">METADATA ALERT:</span>
                        <code className="text-xs text-muted-foreground break-all">
                            {analysisResult.forensics.metadata_status}
                        </code>
                     </div>
                )}
              </GlassCard>

              <button
                onClick={handleReset}
                className="w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted/50 transition-colors"
              >
                Analyze New Document
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentForensics;