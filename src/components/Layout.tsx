import React from "react";

type LayoutProps = {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ header, footer, children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-main-50 text-main-700">
      <header>{header}</header>
      <main className="flex-1 p-4">{children}</main>
      <footer className="border-t border-main-200 bg-main-100 p-4 text-center text-main-600">{footer}</footer>
    </div>
  );
};

export default Layout;
