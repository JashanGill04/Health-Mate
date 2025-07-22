// components/Modal.js
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Frosted Blur Background */}
      <div className="fixed inset-0 backdrop-blur-md bg-black/20 z-40 transition-all"></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-2xl max-w-xl w-full relative border border-white/10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-300 hover:text-white text-xl"
          >
            ✕
          </button>

          {/* Modal Title */}
          <h2 className="text-2xl font-bold mb-6">{title}</h2>

          {/* Modal Content */}
          {children}
        </div>
      </div>
    </>
  );
}
