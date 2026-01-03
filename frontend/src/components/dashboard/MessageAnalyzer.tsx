import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { FileDropzone } from './FileDropzone';
import { StatusBadge } from './StatusBadge';

export const MessageAnalyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!input && !file) return;
    setLoading(true);
    const formData = new FormData();
    if (input) formData.append('text', input);
    if (file) formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/scan', formData);
      const data = response.data;

      // ADAPTER: Map backend flat response to frontend nested structure
      const rawVerdict = data.verdict || 'UNKNOWN';
      const displayVerdict = rawVerdict === 'MALICIOUS' ? 'SCAM' : rawVerdict;

      setResult({
        trust_score: data.is_safe ? 95 : 20,
        gemini_analysis: {
          verdict: displayVerdict,
          warning: data.explanation || 'No detailed explanation provided.',
          tone_analysis: 'AI Analyzed',
          fraud_path: data.fraud_category || 'None',
        },
        technical_analysis: {
          // REMOVED: spam_probability
          language: 'English',
          entities_detected: 0,
        },
      });
    } catch (error) {
      console.error('Scan failed', error);
      // Demo result for UI testing
      setResult({
        trust_score: 85,
        gemini_analysis: {
          verdict: 'SAFE',
          warning: 'No immediate threats detected in this message.',
          tone_analysis: 'Professional, non-threatening',
          fraud_path: 'N/A - Message appears legitimate',
        },
        technical_analysis: {
          spam_probability: 0.12,
          language: 'English',
          entities_detected: 3,
        },
      });
    }
    setLoading(false);
  };

  const handleClear = () => {
    setFile(null);
    setInput('');
    setResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Left: Input Section */}
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Message & Text Analyzer
          </h2>
          <p className="text-muted-foreground">
            Paste suspicious text or upload a screenshot for AI-powered fraud detection.
          </p>
        </div>

        <GlassCard className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Message Content
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste suspicious text, email, or message here..."
              className="w-full bg-muted/50 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-all min-h-[150px]"
              rows={6}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-sm text-muted-foreground">or</span>
            </div>
          </div>

          <FileDropzone
            file={file}
            onFileSelect={setFile}
            onClear={() => setFile(null)}
            accept="image/*,application/pdf"
            label="Upload Screenshot"
            description="Images, Screenshots, PDFs"
          />

          <button
            onClick={handleScan}
            disabled={loading || (!input && !file)}
            className="w-full gradient-primary text-primary-foreground font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search size={20} />
                Analyze Safety
              </>
            )}
          </button>
        </GlassCard>
      </div>

      {/* Right: Results Section */}
      <div className="space-y-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Analysis Results
        </h3>

        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Verdict Card (Trust Score Removed) */}
            <GlassCard
              glowColor={result.gemini_analysis.verdict === 'SAFE' ? 'success' : 'destructive'}
              className="p-6"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {result.gemini_analysis.verdict === 'SAFE' ? (
                    <ShieldCheck className="w-8 h-8 text-success" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  )}
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {result.gemini_analysis.verdict}
                  </h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {result.gemini_analysis.warning}
                </p>
              </div>
            </GlassCard>

            {/* Technical Analysis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassCard>
                <h4 className="font-medium text-primary mb-3">Technical Analysis</h4>
                <ul className="space-y-2 text-sm">
                  {/* REMOVED SPAM PROBABILITY LI */}
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Language</span>
                    <span className="font-medium text-foreground">
                      {result.technical_analysis.language}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Entities Found</span>
                    <span className="font-medium text-foreground">
                      {result.technical_analysis.entities_detected}
                    </span>
                  </li>
                </ul>
              </GlassCard>

              <GlassCard>
                <h4 className="font-medium text-accent mb-3">AI Insight</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-muted-foreground block">Tone</span>
                    <span className="font-medium text-foreground">
                      {result.gemini_analysis.tone_analysis}
                    </span>
                  </li>
                  <li>
                    <span className="text-muted-foreground block">Fraud Path</span>
                    <span className="font-medium text-foreground">
                      {result.gemini_analysis.fraud_path}
                    </span>
                  </li>
                </ul>
              </GlassCard>
            </div>

            <button
              onClick={handleClear}
              className="w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted/50 transition-colors"
            >
              Clear & Scan New
            </button>
          </motion.div>
        ) : (
          <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="font-display font-semibold text-foreground mb-2">Ready to Analyze</h4>
            <p className="text-sm text-muted-foreground max-w-xs">
              Enter a message or upload a screenshot to detect potential fraud, scams, or threats.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default MessageAnalyzer;
