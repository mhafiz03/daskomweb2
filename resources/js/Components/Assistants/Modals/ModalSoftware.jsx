import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@inertiajs/react";

export default function ModalSoftware({ className = "", roleName = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const normalizedRole = (roleName ?? "").toUpperCase();
  const canViewAuditLogs = normalizedRole === "SOFTWARE";

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const modalContent = isModalOpen ? (
    <div className="depth-modal-overlay z-[9999]" onClick={handleModalToggle}>
      <div className="depth-modal-container max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="depth-modal-header">
          <h2 className="depth-modal-title">Informasi Kontak</h2>
          <button
            onClick={handleModalToggle}
            type="button"
            className="depth-modal-close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mb-6 text-sm text-depth-secondary">
          Jika Anda mengalami masalah atau memiliki pertanyaan tentang website, silakan hubungi:
        </p>

        <div className="rounded-depth-md border border-depth bg-depth-interactive p-4 shadow-depth-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-depth-secondary">
            WhatsApp Software
          </p>
          <a
            href="https://wa.me/6282240482882"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-lg font-bold text-[var(--depth-color-primary)] transition hover:underline"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            0822-4048-2882
          </a>
        </div>

        {canViewAuditLogs && (
          <div className="mt-6 rounded-depth-md border border-depth bg-depth-card/80 p-4 shadow-depth-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-depth-secondary">
              Monitoring
            </p>
            <Link
              href="/audit-logs"
              onClick={handleModalToggle}
              className="inline-flex items-center gap-2 rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
            >
              <span className="text-lg">🛡️</span>
              Lihat Audit Logs
            </Link>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Button */}
      <button
        onClick={handleModalToggle}
        className={`group flex h-10 w-10 items-center justify-center rounded-depth-lg border border-depth bg-depth-interactive text-depth-primary shadow-depth-sm transition hover:shadow-depth-md ${className}`}
        aria-label="Contact Software"
      >
        <span className="text-xl transition group-hover:scale-110">👨‍💻</span>
      </button>

      {/* Modal for information */}
      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
}
