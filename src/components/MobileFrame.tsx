import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] text-black flex flex-col">
      {children}
    </div>
  );
};
