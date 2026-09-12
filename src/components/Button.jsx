import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-brand-500 text-white shadow-brand hover:bg-brand-600 hover:shadow-brand-lg',
  dark: 'bg-ink text-white hover:bg-brand-950 shadow-sm',
  secondary:
    'bg-transparent text-brand-700 border border-brand-200 hover:border-brand-400 hover:bg-brand-50 shadow-sm',
  outline:
    'bg-transparent text-brand-700 border border-brand-200 hover:border-brand-400 hover:bg-brand-50',
  ghost:
    'bg-transparent text-ink-2 hover:text-ink hover:bg-paper-deep',
  glass:
    'bg-white/10 text-white border border-white/25 backdrop-blur-sm hover:bg-white/20',
  navy:
    'bg-brand-950 text-white border border-brand-800 hover:bg-ink shadow-sm',
};

const sizes = {
  sm: 'px-4 py-2 text-[0.82rem] rounded-lg',
  md: 'px-6 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-[0.95rem] rounded-xl',
  xl: 'px-9 py-4 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  shine = variant === 'primary',
  ...props
}) {
  const base = variants[variant];
  const primary = variant === 'primary';

  return (
    <motion.button
      whileHover={!disabled && !loading ? { y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.985 } : {}}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`
        inline-flex items-center justify-center gap-2 font-ui font-semibold tracking-[-0.01em]
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${base}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${shine && !disabled ? 'btn-shine' : ''}
        ${primary ? 'relative' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
