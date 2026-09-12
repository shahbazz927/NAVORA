import { motion } from 'framer-motion';

// Cinematic ambient animated background behind the login card.
export default function BackgroundEffects({ theme = 'light' }) {
  const isDark = theme === 'dark';

  const particles = [
    { id: 'p1', top: '15%', left: '12%', size: 'w-1.5 h-1.5', delay: 0, duration: 6 },
    { id: 'p2', top: '28%', right: '18%', size: 'w-2 h-2', delay: 1.5, duration: 8 },
    { id: 'p3', top: '65%', left: '22%', size: 'w-1 h-1', delay: 0.8, duration: 7 },
    { id: 'p4', top: '80%', right: '25%', size: 'w-2 h-2', delay: 2.2, duration: 9 },
    { id: 'p5', top: '45%', left: '8%', size: 'w-1.5 h-1.5', delay: 3, duration: 11 },
    { id: 'p6', top: '35%', right: '8%', size: 'w-1 h-1', delay: 1, duration: 6.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Base Gradient */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isDark
            ? 'bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#040711]'
            : 'bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100'
        }`}
      />

      {/* Grid Pattern */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark ? 'opacity-[0.035]' : 'opacity-[0.04]'
        }`}
        style={{
          backgroundImage: `radial-gradient(${isDark ? '#38bdf8' : '#0284c7'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glowing Ambient Spotlights */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: isDark ? [0.18, 0.28, 0.18] : [0.12, 0.2, 0.12], x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[15%] left-[20%] w-[550px] h-[550px] rounded-full bg-blue-600/30 blur-[130px]"
      />
      <motion.div
        animate={{ scale: [1.1, 0.95, 1.1], opacity: isDark ? [0.12, 0.22, 0.12] : [0.08, 0.15, 0.08], x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-600/25 blur-[140px]"
      />
      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9], opacity: isDark ? [0.1, 0.18, 0.1] : [0.05, 0.12, 0.05] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-[20%] left-[30%] w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[120px]"
      />

      {/* Floating Micro Light Orbs */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.div
            key={`orb-${p.id}`}
            className={`absolute ${p.size} rounded-full bg-blue-400/60 shadow-[0_0_8px_#38bdf8]`}
            style={{ top: p.top, left: p.left, right: p.right }}
            animate={{ y: [0, -25, 0], opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}
      </div>
    </div>
  );
}