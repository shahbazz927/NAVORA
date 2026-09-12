import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackLink({ label = 'Back', className = '', onClick, ...props }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink transition-colors ${className}`}
      {...props}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}