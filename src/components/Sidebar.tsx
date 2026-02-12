import React from "react";

type SidebarProps = {
  items: string[];
};

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
