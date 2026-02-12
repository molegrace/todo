import React from "react";

type LayoutProps = {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ header, footer, children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>{header}</header>
      <main className="flex-1 p-4">{children}</main>
      <footer className="bg-gray-100 p-4 text-center">{footer}</footer>
    </div>
  );
};

export default Layout;
