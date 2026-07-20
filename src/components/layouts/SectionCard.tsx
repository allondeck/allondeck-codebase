import React from 'react';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ children, className = '' }: SectionCardProps) {
  return (
    <div className={`rounded-xl border border-brand-medium/35 bg-brand-dark-alt shadow-sm ${className}`}>
      {children}
    </div>
  );
}
