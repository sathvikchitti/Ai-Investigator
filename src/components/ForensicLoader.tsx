import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Shield, Activity, Zap, Search, Database, BarChart3 } from "lucide-react";
import { cn } from "../utils/cn";

interface Props {
  mode: "text" | "image" | "video";
  isVisible: boolean;
}

const STAGES = [
  { text: "Initializing Forensic Engine", icon: Shield },
  { text: "Extracting Data Patterns", icon: Database },
  { text: "Scanning Anomalies", icon: Search },
  { text: "Cross-validating AI Signature Models", icon: Activity },
  { text: "Generating Risk Assessment", icon: BarChart3 },
];

export function ForensicLoader({ mode, isVisible }: Props) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [binaryText, setBinaryText] = useState("");

  useEffect(() => {
    if (isVisible) {
      setCurrentStage(0);
      setProgress(0);
      
      const stageInterval = setInterval(() => {
        setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
      }, 1500);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          const increment = Math.random() * 5;
          return Math.min(prev + increment, 99);
        });
      }, 200);

      const binaryInterval = setInterval(() => {
        const chars = "01";
        let str = "";
        for (let i = 0; i < 20; i++) {
          str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setBinaryText(str);
      }, 100);

      return () => {
        clearInterval(stageInterval);
        clearInterval(progressInterval);
        clearInterval(binaryInterval);
      };
    }
  }, [isVisible]);

  const getModeSpecificText = (text: string) => {
    if (text === "Scanning Anomalies") {
      if (mode === "text") return "Scanning Linguistic Anomalies";
      if (mode === "image") return "Scanning Pixel-Level Anomalies";
      if (mode === "video") return "Scanning Temporal Anomalies";
    }
    return text;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cyber-navy/80 backdrop-blur-md p-6"
        >
          {/* Digital Grid Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} 
          />

          {/* Main Glass Panel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg glass-card rounded-none border-t-2 border-t-cyber-blue p-12 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]"
          >
            {/* Moving Scan Line */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-px bg-cyber-blue/40 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20 pointer-events-none"
            />

            <div className="flex flex-col items-center text-center space-y-10 relative z-10">
              {/* Rotating Scan Ring */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-cyber-blue/30 flex items-center justify-center"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border border-cyber-blue/10"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Shield className="w-10 h-10 text-cyber-blue drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </motion.div>
                </div>
              </div>

              {/* Scan Stages */}
              <div className="w-full space-y-6">
                <div className="h-12 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex items-center gap-3">
                        {(() => {
                          const Icon = STAGES[currentStage].icon;
                          return <Icon className="w-4 h-4 text-cyber-blue animate-pulse" />;
                        })()}
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-[0.2em]">
                          {getModeSpecificText(STAGES[currentStage].text)}
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            ...
                          </motion.span>
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-mono text-cyber-blue/60 uppercase tracking-widest">System Integrity Scan</span>
                    <span className="text-[10px] font-mono text-white font-bold">{Math.floor(progress)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-none overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-cyber-blue shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Binary Flicker */}
                <div className="pt-4">
                  <span className="text-[8px] font-mono text-cyber-blue/30 uppercase tracking-[0.5em] break-all">
                    {binaryText}
                  </span>
                </div>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cyber-blue/30" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyber-blue/30" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyber-blue/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-cyber-blue/30" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
