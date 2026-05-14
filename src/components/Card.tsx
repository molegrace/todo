import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`min-w-0 max-w-full rounded-2xl border border-main-200 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;
