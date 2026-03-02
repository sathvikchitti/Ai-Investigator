import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Shield, ChevronRight, User, GraduationCap, Building2, Terminal, Lock, Cpu } from "lucide-react";
import { useUser, type UserRole } from "../context/UserContext";
import { cn } from "../utils/cn";

export function Home() {
  const navigate = useNavigate();
  const { setUserData } = useUser();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("Student");
  const [institution, setInstitution] = useState("");
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-300, 300], [5, -5]);
  const rotateY = useTransform(x, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("ACCESS DENIED: Name required for authentication.");
      return;
    }
    setIsExiting(true);
    setTimeout(() => {
      setUserData({ fullName, role, institution });
      navigate("/home");
    }, 800);
  };

  // Particles
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);
  useEffect(() => {
    const p = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(p);
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cyber-navy cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyber-navy to-black" />
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} 
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16, 185, 129, 0.1),transparent_70%)]" />
      
      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.4, 0.1],
            y: ["0%", "-100%"],
            x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 10
          }}
          className="absolute rounded-full bg-cyber-blue"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            filter: 'blur(1px)'
          }}
        />
      ))}

      <div className="scanline opacity-10" />

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ 
          opacity: isExiting ? 0 : 1, 
          y: isExiting ? -40 : 0, 
          scale: isExiting ? 1.05 : 1,
        }}
        style={{
          rotateX: rotateX,
          rotateY: rotateY
        }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
        }}
        className="max-w-xl w-full px-6 relative z-10 perspective-1000"
      >
        <div className="animate-floating">
          <div className="glass-card rounded-[2rem] border border-cyber-blue/30 p-12 relative overflow-hidden shadow-[0_0_50px_rgba(16, 185, 129, 0.1)] backdrop-blur-2xl bg-black/40">
            {/* Inner Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyber-blue/10 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full" />

            <div className="flex flex-col items-center text-center mb-10">
              <motion.div 
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-16 h-16 rounded-2xl border border-cyber-blue/40 flex items-center justify-center bg-cyber-blue/5 mb-6 relative group"
              >
                <Cpu className="w-8 h-8 text-cyber-blue group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 border border-cyber-blue/20 animate-ping rounded-2xl" />
              </motion.div>
              
              <h1 className="text-3xl font-display font-black text-white mb-2 tracking-tighter uppercase leading-tight">
                AI Forensic Investigation Console
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.3em]">Secure Academic Verification Portal</p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 glow-pulse" />
                  <span className="text-[8px] font-mono text-emerald-500 uppercase font-bold">System Online</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-cyber-blue" />
                  Operator Identity
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-cyber-blue transition-colors" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setError(""); }}
                    placeholder="ENTER FULL NAME..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyber-blue focus:ring-4 focus:ring-cyber-blue/10 transition-all font-mono text-sm uppercase tracking-wider"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                    <GraduationCap className="w-3 h-3 text-cyber-blue" />
                    Access Role
                  </label>
                  <div className="relative group">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white appearance-none focus:outline-none focus:border-cyber-blue focus:ring-4 focus:ring-cyber-blue/10 transition-all cursor-pointer font-mono text-xs uppercase tracking-wider"
                    >
                      <option value="Student" className="bg-cyber-navy">Student</option>
                      <option value="Researcher" className="bg-cyber-navy">Researcher</option>
                      <option value="Journalist" className="bg-cyber-navy">Journalist</option>
                      <option value="Faculty" className="bg-cyber-navy">Faculty</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronRight className="w-4 h-4 text-cyber-blue rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 ml-1 flex items-center gap-2">
                    <Building2 className="w-3 h-3 text-cyber-blue" />
                    Institution
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="ORG/UNIVERSITY..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyber-blue focus:ring-4 focus:ring-cyber-blue/10 transition-all font-mono text-xs uppercase tracking-wider"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-mono uppercase tracking-tighter flex items-center gap-2 rounded-xl"
                >
                  <Lock className="w-3 h-3" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-5 bg-cyber-blue text-cyber-navy rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(16, 185, 129, 0.2)] hover:shadow-[0_0_50px_rgba(16, 185, 129, 0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group glow-pulse-blue"
              >
                Access System
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            
            <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center opacity-30">
              <div className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">Protocol v4.2.0-SECURE</div>
              <div className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">AES-256 SESSION ACTIVE</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
