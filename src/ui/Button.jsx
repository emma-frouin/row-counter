import React from 'react';

export function Button({ children, onClick, variant = 'primary', size = 'medium', className = '', ...props }) {
  const variantClass = `button--${variant}`;
  const sizeClass = `button--${size}`;
  
  return (
    <button
      className={`button ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

