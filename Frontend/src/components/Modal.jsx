const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      {/* Background overlay keeps focus on the modal */}
      <div
        className="absolute inset-0 bg-gray-900/60"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div
        className={`relative z-10 w-full ${
          sizeClasses[size] ?? sizeClasses.md
        } bg-white rounded-lg shadow-xl overflow-hidden`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition duration-200"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
