'use client';

import { User } from '@/hooks/AuthContext';

interface AvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ user, size = 'md', className = '' }: AvatarProps) {
  // Determine size class
  const sizeClass = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }[size];
  
  // Get initials from user name or email
  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U'; // Default fallback
  };
  
  // Generate a unique key based on user data to force re-render when data changes
  const avatarKey = user ? `avatar-${user.name}-${user.email}` : 'avatar-default';
  
  return (
    <div 
      key={avatarKey}
      className={`rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center border-2 border-indigo-300 dark:border-indigo-700 overflow-hidden ${sizeClass} ${className}`}
    >
      <span className="font-medium text-indigo-800 dark:text-indigo-200">
        {getInitials()}
      </span>
    </div>
  );
}