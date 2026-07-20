import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({ children, className = '', noPadding = false }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] ${noPadding ? '' : 'px-6 lg:px-12'} ${className}`}>
      {children}
    </div>
  );
}
