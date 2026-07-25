import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-campus-forest text-campus-paper hover:bg-campus-forestLight shadow-sm',
  secondary: 'border border-campus-line text-campus-ink hover:bg-campus-paperDim',
  danger: 'bg-campus-red text-white hover:bg-campus-redLight shadow-sm',
  ghost: 'text-campus-inkSoft hover:bg-campus-paperDim',
  gold: 'bg-campus-gold text-campus-ink hover:bg-campus-goldLight shadow-sm font-semibold',
  outline: 'border-2 border-campus-forest text-campus-forest hover:bg-campus-forest hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  loading = false,
  disabled,
  ...props
}) {
  return (
    <button
      className={`ripple inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-inherit ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

