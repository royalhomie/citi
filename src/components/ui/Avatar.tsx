import { getInitials } from '@/lib/format';
import { USER } from '@/lib/user';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ring?: boolean;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-24 h-24 text-2xl',
};

export default function Avatar({ size = 'md', className = '', ring = false }: AvatarProps) {
  const ringClass = ring ? 'ring-2 ring-white/20 ring-offset-2 ring-offset-citi-950' : '';

  return (
    <div
      className={`${sizeMap[size]} rounded-full overflow-hidden shrink-0 ${ringClass} ${className}`}
    >
      <img
        src={USER.avatar}
        alt={USER.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

export function AvatarFallback({ name, size = 'md', className = '' }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-24 h-24 text-2xl',
  };

  return (
    <div
      className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-citi-500 to-citi-700 flex items-center justify-center font-bold text-white shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
