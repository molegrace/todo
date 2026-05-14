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
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <button
          type="button"
          className="absolute right-4 top-4 text-xl text-main-400 transition hover:text-main-700"
          onClick={onClose}
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
