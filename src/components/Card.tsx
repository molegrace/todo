import React from "react";

type CardProps = {
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="bg-white shadow rounded p-4 border">
      {children}
    </div>
  );
};

export default Card;
