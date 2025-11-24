import React from 'react';

export function Layout({ children, className = '' }) {
  return (
    <div className={`layout ${className}`}>
      <div className="layout__container">
        {children}
      </div>
    </div>
  );
}

