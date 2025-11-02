export default function DepthToggle({ label, isOn, onToggle, className = "" }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {label && <span className="text-xs font-semibold text-depth-secondary">{label}</span>}
            <button
                type="button"
                onClick={onToggle}
                aria-pressed={isOn}
                className={`flex h-6 w-11 items-center rounded-depth-full border p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--depth-color-primary)] ${
                    isOn
                        ? "border-[var(--depth-color-primary)] bg-[var(--depth-color-primary)]/20 text-white"
                        : "border-depth bg-depth-card text-depth-secondary"
                }`}
            >
                <span
                    className={`h-4 w-4 rounded-depth-full shadow-depth-sm transition-transform ${
                        isOn
                            ? "translate-x-5 bg-[var(--depth-color-primary)]"
                            : "translate-x-0 bg-depth-interactive"
                    }`}
                />
            </button>
        </div>
    );
}
