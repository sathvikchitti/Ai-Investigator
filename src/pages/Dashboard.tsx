import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Shield,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  History,
  AlertCircle,
  Loader2,
  Upload,
  X,
  ChevronRight,
  Fingerprint,
  Activity,
  Lock,
  Globe,
  LogOut,
  User as UserIcon,
  Type as TypeIcon,
  Clock,
  Play
} from "lucide-react";
import { analyzeText, analyzeImage, analyzeVideo, type AnalysisResult } from "../services/gemini";
import { AnalysisResultView } from "../components/AnalysisResult";
import { cn } from "../utils/cn";
import { useUser } from "../context/UserContext";
import { ForensicLoader } from "../components/ForensicLoader";

type Mode = "text" | "image" | "video";

interface HistoryItem {
  id: string;
  timestamp: number;
  mode: Mode;
  content: string;
  result: AnalysisResult;
}


export function Dashboard() {
  const { userData, logout } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [image, setImage] = useState<{ base64: string; preview: string; mimeType: string } | null>(null);
  const [video, setVideo] = useState<{ file: File; preview: string; duration: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        setImage({
          base64,
          preview: reader.result as string,
          mimeType: file.type
        });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError("CRITICAL ERROR: VIDEO FILE EXCEEDS 50MB LIMIT.");
        return;
      }
      const url = URL.createObjectURL(file);
      const videoEl = document.createElement("video");
      videoEl.src = url;
      videoEl.onloadedmetadata = () => {
        setVideo({
          file,
          preview: url,
          duration: videoEl.duration
        });
        setError(null);
      };
    }
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearVideo = () => {
    if (video?.preview) URL.revokeObjectURL(video.preview);
    setVideo(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const captureFrame = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!videoPreviewRef.current) return reject("No video element");
      const video = videoPreviewRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");

      video.currentTime = Math.min(1, video.duration / 2);
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg").split(",")[1]);
      };
    });
  };

  const handleAnalyze = async () => {
    if (mode === "text" && !text.trim()) {
      setError("INPUT REQUIRED: PASTE TEXT FOR ANALYSIS.");
      return;
    }
    if (mode === "image" && !image) {
      setError("INPUT REQUIRED: UPLOAD IMAGE FOR ANALYSIS.");
      return;
    }
    if (mode === "video" && !video) {
      setError("INPUT REQUIRED: UPLOAD VIDEO FOR ANALYSIS.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let analysisResult: AnalysisResult;
      if (mode === "text") {
        analysisResult = await analyzeText(text);
      } else if (mode === "image") {
        analysisResult = await analyzeImage(image!.base64, image!.mimeType);
      } else {
        const frameBase64 = await captureFrame();
        analysisResult = await analyzeVideo(frameBase64, "image/jpeg");
      }

      setResult(analysisResult);

      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        mode,
        content: mode === "text" ? text.slice(0, 100) : mode === "image" ? "IMAGE SCAN" : "VIDEO SCAN",
        result: analysisResult,
      };
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 10));
    } catch (err: any) {
      setError(err.message || "SYSTEM ERROR: ANALYSIS PROTOCOL FAILED.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex flex-col relative overflow-hidden bg-cyber-navy"
    >
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyber-blue/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-cyber-blue/5 blur-[100px] rounded-full" />
      </div>

      <div className="scanline" />

      <ForensicLoader mode={mode} isVisible={isAnalyzing} />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-x-0 border-t-0 border-b-cyber-blue/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-none border border-cyber-blue flex items-center justify-center shadow-[0_0_10px_rgba(0,242,255,0.2)]">
              <Shield className="w-6 h-6 text-cyber-blue" />
            </div>
            <div>
              <h1 className="text-lg font-display font-black tracking-tighter text-white uppercase">
                Forensic Analysis Control Panel
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 glow-pulse" />
                  <span className="text-[9px] font-mono text-emerald-500 uppercase font-bold tracking-widest">System Online</span>
                </div>
                <span className="text-zinc-700">|</span>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Protocol v4.2.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-black/40 border border-cyber-blue/10">
              <div className="w-6 h-6 rounded-none border border-cyber-blue/30 flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-cyber-blue" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-white uppercase tracking-wider">{userData.fullName}</div>
                <div className="text-[8px] font-mono text-cyber-blue/60 uppercase tracking-widest">{userData.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-all flex items-center gap-2 group"
              title="Terminate Session"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Terminate</span>
            </button>
          </div>
        </div>
      </header>

      {/* Divider with Glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent shadow-[0_0_15px_rgba(0,242,255,0.2)]" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Input */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                  Forensic Analysis <span className="text-cyber-blue">Control Panel</span>
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 glow-pulse" />
                  <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-widest">🟢 System Online</span>
                </div>
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Select module to initialize authenticity scan</p>
              </div>

              {/* Mode Toggle - Digital Forensic Units */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "text", label: "TEXT FORENSICS", icon: TypeIcon },
                  { id: "image", label: "IMAGE FORENSICS", icon: ImageIcon },
                  { id: "video", label: "VIDEO FORENSICS", icon: VideoIcon },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setMode(item.id as Mode); setResult(null); setError(null); }}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 glass-card transition-all duration-300 relative group overflow-hidden border-t-2",
                      mode === item.id
                        ? "border-t-cyber-blue bg-cyber-blue/10 shadow-[0_0_30px_rgba(0,242,255,0.15)]"
                        : "border-t-transparent bg-black/40 border-white/5 text-zinc-600 hover:border-cyber-blue/30 hover:text-zinc-400"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-none border flex items-center justify-center transition-all duration-300",
                      mode === item.id ? "border-cyber-blue bg-cyber-blue/5 shadow-[0_0_15px_rgba(0,242,255,0.2)]" : "border-zinc-800"
                    )}>
                      <item.icon className={cn("w-6 h-6 transition-colors", mode === item.id ? "text-cyber-blue" : "text-zinc-600")} />
                    </div>
                    <span className={cn("text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-colors", mode === item.id ? "text-white" : "text-zinc-600")}>
                      {item.label}
                    </span>
                    {mode === item.id && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 border border-cyber-blue/20 pointer-events-none"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Input Area - Forensic Module Style */}
              <div className="glass-card rounded-none border-t-2 border-t-cyber-blue p-1 relative">
                <div className="absolute top-2 right-4 flex gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-cyber-blue/40" />
                  <div className="w-1 h-1 rounded-full bg-cyber-blue/40" />
                  <div className="w-1 h-1 rounded-full bg-cyber-blue/40" />
                </div>
                <div className="bg-black/60 p-8">
                  {mode === "text" ? (
                    <div className="relative group">
                      <textarea
                        value={text}
                        onChange={handleTextChange}
                        placeholder="PASTE EVIDENCE FOR LINGUISTIC ANALYSIS..."
                        className="w-full h-80 bg-black/20 border border-white/5 p-6 text-cyber-blue/90 placeholder:text-zinc-800 resize-none focus:outline-none focus:border-cyber-blue/50 focus:shadow-[0_0_20px_rgba(0,242,255,0.1)] transition-all font-mono text-sm leading-relaxed uppercase tracking-wide"
                      />
                      <div className="absolute bottom-4 right-4 text-[9px] font-mono text-zinc-700 uppercase tracking-[0.2em]">
                        {text.length} BYTES ANALYZED
                      </div>
                    </div>
                  ) : mode === "image" ? (
                    <div
                      onClick={() => !image && fileInputRef.current?.click()}
                      className={cn(
                        "w-full h-80 border border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-6 cursor-pointer relative",
                        image
                          ? "border-cyber-blue/50 bg-cyber-blue/5"
                          : "border-zinc-800 hover:border-cyber-blue/40 hover:bg-white/5"
                      )}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      {image ? (
                        <div className="relative w-full h-full p-6">
                          <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-full object-contain filter brightness-90 contrast-125"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 pointer-events-none border border-cyber-blue/20" />
                          <button
                            onClick={(e) => { e.stopPropagation(); clearImage(); }}
                            className="absolute top-8 right-8 p-2 bg-black/80 border border-white/10 hover:border-rose-500/50 text-white transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-20 h-20 rounded-none border border-zinc-800 flex items-center justify-center group-hover:border-cyber-blue/40 transition-colors">
                            <Upload className="w-8 h-8 text-zinc-700 group-hover:text-cyber-blue transition-colors" />
                          </div>
                          <div className="text-center">
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Drop visual evidence</p>
                            <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mt-2">or click to browse local storage</p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => !video && videoInputRef.current?.click()}
                      className={cn(
                        "w-full h-80 border border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-6 cursor-pointer relative overflow-hidden",
                        video
                          ? "border-cyber-blue/50 bg-black/40"
                          : "border-zinc-800 hover:border-cyber-blue/40 hover:bg-black/40"
                      )}
                    >
                      <input
                        type="file"
                        ref={videoInputRef}
                        onChange={handleVideoUpload}
                        accept="video/mp4,video/quicktime"
                        className="hidden"
                      />
                      {video ? (
                        <div className="relative w-full h-full p-6 flex flex-col items-center">
                          <video
                            ref={videoPreviewRef}
                            src={video.preview}
                            className="w-full h-48 object-contain filter brightness-90 contrast-110 mb-6"
                            controls={false}
                          />
                          <div className="flex items-center gap-6 text-zinc-500">
                            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
                              <Clock className="w-3 h-3 text-cyber-blue" />
                              {video.duration.toFixed(1)}s
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
                              <FileText className="w-3 h-3 text-cyber-blue" />
                              {(video.file.size / (1024 * 1024)).toFixed(1)}MB
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); clearVideo(); }}
                            className="absolute top-8 right-8 p-2 bg-black/80 border border-white/10 hover:border-rose-500/50 text-white transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute inset-0 pointer-events-none border border-cyber-blue/10 animate-pulse" />
                        </div>
                      ) : (
                        <>
                          <div className="w-20 h-20 rounded-none border border-zinc-800 flex items-center justify-center group-hover:border-cyber-blue/40 transition-colors">
                            <VideoIcon className="w-8 h-8 text-zinc-700 group-hover:text-cyber-blue transition-colors" />
                          </div>
                          <div className="text-center">
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Drop temporal evidence</p>
                            <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mt-2">MP4, MOV supported (Max 50MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-mono uppercase tracking-widest flex items-center gap-3"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={cn(
                  "w-full py-5 font-black text-sm uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group",
                  isAnalyzing
                    ? "bg-zinc-900 text-zinc-700 cursor-not-allowed border border-white/5"
                    : "bg-cyber-blue text-cyber-navy shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-[1.01] active:scale-[0.99] glow-pulse-blue"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-5 h-5 animate-pulse text-cyber-blue" />
                    <span className="animate-pulse tracking-[0.2em]">ANALYSIS IN PROGRESS...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    Initialize Forensic Scan
                  </>
                )}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
              </button>
            </div>
          </div>

          {/* Right Column: Results & History */}
          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              {result ? (
                <AnalysisResultView key="result" result={result} />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-none border-t-2 border-t-zinc-800 p-12 h-full flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]"
                >
                  <div className="w-24 h-24 rounded-none border border-zinc-800 flex items-center justify-center relative">
                    <Fingerprint className="w-12 h-12 text-zinc-800" />
                    <div className="absolute inset-0 border border-cyber-blue/10 animate-ping opacity-20" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Awaiting Evidence</h3>
                    <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                      Upload digital artifacts to initialize analysis protocol and generate forensic report.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-8">
                    <div className="p-5 border border-white/5 bg-white/5 text-left">
                      <Lock className="w-4 h-4 text-zinc-700 mb-3" />
                      <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Encrypted</div>
                      <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Secure session active</div>
                    </div>
                    <div className="p-5 border border-white/5 bg-white/5 text-left">
                      <Globe className="w-4 h-4 text-zinc-700 mb-3" />
                      <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Verified</div>
                      <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Multi-model scan</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History */}
            {history.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                    <History className="w-4 h-4 text-cyber-blue" />
                    Investigation Logs
                  </h3>
                </div>
                <div className="space-y-3">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setResult(item.result);
                        setMode(item.mode);
                        if (item.mode === "text") setText(item.content);
                        else if (item.mode === "image") setImage({ base64: "", preview: item.content, mimeType: "" });
                        else setVideo({ file: null as any, preview: item.content, duration: 0 });
                      }}
                      className="w-full bg-black/40 border border-white/5 hover:border-cyber-blue/30 p-4 text-left flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-none border flex items-center justify-center transition-colors",
                          item.result.ai_probability > 60
                            ? "border-rose-500/30 text-rose-500 bg-rose-500/5"
                            : item.result.ai_probability > 30
                              ? "border-amber-500/30 text-amber-500 bg-amber-500/5"
                              : "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                        )}>
                          {item.mode === "text" ? <FileText className="w-5 h-5" /> : item.mode === "image" ? <ImageIcon className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider line-clamp-1">{item.content}</div>
                          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                            {new Date(item.timestamp).toLocaleTimeString()} • {item.result.ai_probability}% AI MATCH
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-cyber-blue transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-cyber-blue" />
            <span className="text-xs font-display font-black text-white uppercase tracking-widest">AI Investigator</span>
            <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest ml-4">© 2026 INTERNAL USE ONLY</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[10px] font-mono text-zinc-600 hover:text-cyber-blue uppercase tracking-widest transition-colors">Privacy Protocol</a>
            <a href="#" className="text-[10px] font-mono text-zinc-600 hover:text-cyber-blue uppercase tracking-widest transition-colors">Forensic Standards</a>
            <a href="#" className="text-[10px] font-mono text-zinc-600 hover:text-cyber-blue uppercase tracking-widest transition-colors">Security Audit</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
