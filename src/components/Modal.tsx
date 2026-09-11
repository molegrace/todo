import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-3xl bg-white p-6 shadow-xl">
        <button
          type="button"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl text-main-500 transition hover:bg-main-100 hover:text-main-700"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
