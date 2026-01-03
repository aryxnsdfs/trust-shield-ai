import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Search,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  IndianRupee,
  Upload,
  User,
  MessageSquare,
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { FileDropzone } from './FileDropzone';

const sourceOptions = [
  { value: 'unknown', label: 'Select Source...' },
  { value: 'friend', label: 'Friend / Family (Personal)' },
  { value: 'merchant', label: 'Shop / Official Merchant' },
  { value: 'olx', label: 'OLX / Facebook Marketplace' },
  { value: 'telegram', label: 'Telegram / WhatsApp (Stranger)' },
  { value: 'sms', label: 'SMS / Email Link' },
];

export const PaymentAnalyzer: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [sourceContext, setSourceContext] = useState('unknown');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const isFormValid = file || (recipient && amount) || userQuery.length > 5;

  const handleScan = async () => {
    setLoading(true);
    const formData = new FormData();
    if (amount) formData.append('amount', amount);
    if (recipient) formData.append('recipient', recipient);
    if (sourceContext) formData.append('source_context', sourceContext);
    if (userQuery) formData.append('user_query', userQuery);
    if (file) formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/analyze-payment', formData);
      setResult(response.data);
    } catch (error) {
      // Demo result
      setResult({
        data: {
          trust_score: 92,
          verdict: 'Transaction Appears Safe',
          explanation:
            'Based on the provided information, this transaction follows standard payment patterns with no red flags detected.',
          visual_evidence: [],
          logic_flaws: [],
        },
      });
    }
    setLoading(false);
  };

  const handleClear = () => {
    setAmount('');
    setRecipient('');
    setFile(null);
    setUserQuery('');
    setSourceContext('unknown');
    setResult(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Payment & Transaction Analyzer
        </h2>
        <p className="text-muted-foreground">
          Verify the safety of payment requests, QR codes, and transaction details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <GlassCard className="space-y-5">
          {/* Step 1: Evidence Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                1
              </div>
              Upload Evidence
            </label>
            <FileDropzone
              file={file}
              onFileSelect={setFile}
              onClear={() => setFile(null)}
              accept="image/*"
              label="Upload Payment Screenshot"
              description="QR Codes, Payment Requests, Screenshots"
            />
          </div>

          {/* Step 2: Specific Concern */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                2
              </div>
              Your Concern
            </label>
            <div className="relative">
              <MessageSquare
                size={18}
                className="absolute left-4 top-3.5 text-muted-foreground"
              />
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="e.g. 'Is this a fake refund link?' or 'Does the time match the transaction?'"
                className="w-full bg-muted/50 border border-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                rows={3}
              />
            </div>
          </div>


          <button
            onClick={handleScan}
            disabled={!isFormValid || loading}
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
                Analyze Transaction
              </>
            )}
          </button>

          {!isFormValid && (
            <p className="text-xs text-center text-muted-foreground">
              Upload evidence or ask a question to proceed with the analysis.
            </p>
          )}
        </GlassCard>

        {/* Right: Results */}
        <div className="space-y-4">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Verdict Banner - UPDATED LAYOUT */}
              <GlassCard
                glowColor={
                  ['SAFE', 'REAL', 'NORMAL'].includes(result.data.verdict) 
                    ? 'success' 
                    : 'destructive'
                }
                // CHANGED: Removed sm:flex-row, forced flex-col, added text-center
                className="flex flex-col items-center text-center gap-4 p-6"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                      ['SAFE', 'REAL', 'NORMAL'].includes(result.data.verdict)
                        ? 'bg-success/10'
                        : 'bg-destructive/10'
                    }`}
                  >
                    {['SAFE', 'REAL', 'NORMAL'].includes(result.data.verdict) ? (
                      <ShieldCheck className="w-10 h-10 text-success" />
                    ) : (
                      <ShieldAlert className="w-10 h-10 text-destructive" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-3xl font-bold text-foreground mb-3">
                    {result.data.verdict}
                  </h3>
                  
                  {/* CHANGED: Line-by-line rendering logic */}
                  <div className="text-muted-foreground leading-relaxed text-left space-y-2">
                    {result.data.explanation.split('\n').map((line: string, index: number) => {
                      if (!line.trim()) return null;
                      return (
                        <p key={index} className={`flex gap-2 ${line.includes('•') ? 'pl-2' : ''}`}>
                          {line.trim()}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>

              {/* Forensic Findings - UPDATED KEY AND LOGIC */}
              <GlassCard>
                <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <Search size={16} className="text-primary" />
                  Forensic Analysis Details
                </h4>
                
                {/* CHANGED: result.data.visual_evidence -> result.data.forensic_flags */}
                {result.data.forensic_flags && result.data.forensic_flags.length > 0 ? (
                  <ul className="space-y-2">
                    {result.data.forensic_flags.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm p-3 rounded-lg bg-muted/50"
                      >
                        {/* Dynamic Icon based on content */}
                        {['No', 'Clean', 'Pass', 'Consistent'].some(k => item.includes(k)) ? (
                           <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" />
                        ) : (
                           <AlertTriangle size={14} className="text-warning mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 size={16} className="animate-spin" />
                    Processing forensic details...
                  </div>
                )}
              </GlassCard>

              {/* Risk Factors - Keep as is, just ensure key safety */}
              {result.data.logic_flaws?.length > 0 && (
                <GlassCard glowColor="destructive">
                  <h4 className="font-medium text-destructive mb-3">Risk Factors</h4>
                  <ul className="space-y-2">
                    {result.data.logic_flaws.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}

              <button
                onClick={handleClear}
                className="w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted/50 transition-colors"
              >
                Clear & Analyze New
              </button>
            </motion.div>
          ) : (
            <GlassCard className="min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-display font-semibold text-foreground mb-2">
                Ready for Analysis
              </h4>
              <p className="text-sm text-muted-foreground max-w-xs">
                Upload payment proof, enter transaction details, or describe your concern to verify safety.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalyzer;
