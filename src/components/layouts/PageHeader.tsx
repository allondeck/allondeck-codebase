import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-wider text-brand-cream md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-brand-light font-sans max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex shrink-0 items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
