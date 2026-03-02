import { motion } from "motion/react";
import { useNavigate, Navigate } from "react-router-dom";
import { Shield, Search, Download } from "lucide-react";
import { useUser } from "../context/UserContext";
import DotGrid from "@/components/DotGrid";
import BlurText from "@/components/BlurText";

export function Landing() {
  const { userData } = useUser();
  const navigate = useNavigate();

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden">
      <DotGrid
        dotSize={3}
        gap={22}
        baseColor="#03140f"
        activeColor="#00f5c4"
        proximity={120}
        speedTrigger={100}
        shockRadius={250}
        shockStrength={4}
        maxSpeed={3500}
        resistance={900}
        returnDuration={1.5}
        className="-z-30"
      />

      <div className="absolute inset-0 bg-black/70 -z-20"></div>

      <div className="scanline opacity-10" />
      <header className="absolute top-0 left-0 right-0 px-8 py-6 flex items-center justify-between z-20 glass-card border-x-0 border-t-0 border-b-cyber-blue/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-cyber-blue flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)]">
            <Shield className="w-6 h-6 text-cyber-blue" />
          </div>
          <div>
            <h1 className="text-lg font-display font-black tracking-tighter text-white uppercase">AI Investigator</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-1">Multi-Modal Forensic System</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 glow-pulse" />
            <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-widest">System Online</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-none text-[10px] font-mono uppercase tracking-widest hover:bg-white/10 transition-all">
            <Download className="w-4 h-4 text-cyber-blue" />
            Generate Report
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="text-7xl md:text-9xl font-display font-black tracking-tighter mb-8 uppercase leading-none">
            <BlurText
              text="Detect."
              delay={150}
              animateBy="words"
              direction="top"
            />
            <span className="text-cyber-blue drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <BlurText
                text="Verify."
                delay={250}
                animateBy="words"
                direction="top"
              />
            </span>
            <BlurText
              text="Trust."
              delay={350}
              animateBy="words"
              direction="top"
            />
          </div>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-mono uppercase tracking-wide">
            The world's first multi-modal AI forensic investigator. Upload text, images, or video to get a comprehensive forensic analysis.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="group relative mx-auto px-12 py-5 bg-cyber-blue text-cyber-navy font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all flex items-center gap-4 glow-pulse-blue"
          >
            <Search className="w-5 h-5" />
            Start Investigation
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
          </motion.button>
        </motion.div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyber-blue/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-cyber-purple/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-cyber-blue/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
