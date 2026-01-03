import React from 'react';
import logo from '@/assets/logo.png';

export const Header: React.FC = () => {
  return (
    <header className="glass-strong border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="TrustShield Logo" 
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                TrustShield <span className="text-primary">AI</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
