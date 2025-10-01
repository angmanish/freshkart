import React from 'react';

export function Card({ className, children }) {
  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}