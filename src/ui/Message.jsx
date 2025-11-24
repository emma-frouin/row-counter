import React from 'react';

export function Message({ children, type = 'info', className = '' }) {
  const typeClass = `message--${type}`;
  
  return (
    <div className={`message ${typeClass} ${className}`}>
      {children}
    </div>
  );
}

