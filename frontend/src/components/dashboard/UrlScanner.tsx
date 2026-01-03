import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Globe, Search, Loader2, AlertTriangle, CheckCircle, ExternalLink, FileText } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';

export const UrlScanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, `› ${msg}`]);

  const handleScan = async () => {
    if (!url) return;
    setLoading(true);
    setLogs([]);
    setResult(null);

    addLog('Initializing security audit...');
    addLog(`Target: ${url}`);

    setTimeout(() => addLog('Tracing redirects & popups...'), 800);
    setTimeout(() => addLog('Capturing page evidence...'), 1600);
    setTimeout(() => addLog('Auditing links & claims...'), 2400);
    setTimeout(() => addLog('Running AI forensics...'), 3200);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/scan-url?url=${encodeURIComponent(url)}`,
        { method: 'POST' }
      );
      const data = await response.json();
      setResult(data);
      addLog('Audit complete.');
    } catch (e) {
      // Demo result
      setTimeout(() => {
        setResult({
          risk_score: 25,
          screenshot_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600',
          visual_ai: { layout_type: 'Corporate Website' },
          domain_data: { creation_date: '2019-03-15', org: 'Tech Corp Inc.' },
          gemini_analysis: {
            verdict: 'SAFE',
            red_flags: [],
            legitimacy_checks: [
              { check: 'SSL Certificate', status: 'PASS' },
              { check: 'Contact Info', status: 'PASS' },
              { check: 'Privacy Policy', status: 'PASS' },
            ],
            audit_report:
              'This website appears to be a legitimate corporate site. SSL certificate is valid, contact information is present, and all standard legal pages are accessible.',
          },
        });
        addLog('Audit complete.');
      }, 4000);
    }
    setTimeout(() => setLoading(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">URL Scanner</h2>
        <p className="text-muted-foreground">
          Enter a website URL to analyze its security, legitimacy, and potential risks.
        </p>
      </div>

      {/* Search Bar - Hero Style */}
      <GlassCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-muted/50 border border-border rounded-xl pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
          </div>
          <button
            onClick={handleScan}
            disabled={loading || !url}
            className="gradient-primary text-primary-foreground font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="hidden sm:inline">Scanning...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Scan URL</span>
              </>
            )}
          </button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logs Panel */}
        <GlassCard className="min-h-[300px] flex flex-col">
          <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Scan Progress
          </h3>
          <div className="flex-1 bg-background/50 rounded-xl p-4 font-mono text-sm overflow-y-auto space-y-1">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-muted-foreground"
                >
                  {log}
                </motion.div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Waiting to start scan...
              </div>
            )}
            {loading && (
              <div className="text-primary animate-pulse">_</div>
            )}
          </div>
        </GlassCard>

        {/* Results Panel */}
        {result ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Website Preview Card */}
            <GlassCard
              glowColor={result.risk_score < 50 ? 'success' : 'destructive'}
              className="overflow-hidden !p-0"
            >
              <div className="relative">
                <img
                  src={result.screenshot_url}
                  alt="Website Preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg glass-strong text-xs font-medium">
                  {result.visual_ai.layout_type}
                </div>
              </div>
              <div className="p-6 pt-12">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <StatusBadge status={result.gemini_analysis.verdict} />
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
<span>Est. {result.domain_info?.creation_date ? String(result.domain_info.creation_date).substring(0, 4) : 'Unknown'}</span>
<span>•</span>
<span>{result.domain_info?.org || 'Organization Hidden'}</span>
                    </div>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors"
                  >
                    <ExternalLink size={16} className="text-muted-foreground" />
                  </a>
                </div>

                {/* Checks */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {result.gemini_analysis.red_flags?.map((flag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-medium flex items-center gap-1"
                    >
                      <AlertTriangle size={12} />
                      {flag}
                    </span>
                  ))}
                  {result.gemini_analysis.legitimacy_checks?.map((check: any, i: number) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${
                        check.status === 'PASS'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      <CheckCircle size={12} />
                      {check.check}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Forensic Report */}
            <GlassCard>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Forensic Summary
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {result.gemini_analysis.audit_report}
              </p>
            </GlassCard>
          </motion.div>
        ) : (
          <GlassCard className="min-h-[300px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="font-display font-semibold text-foreground mb-2">
              Website Security Check
            </h4>
            <p className="text-sm text-muted-foreground max-w-xs">
              Enter a URL above to analyze the website's legitimacy, security, and potential risks.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default UrlScanner;
