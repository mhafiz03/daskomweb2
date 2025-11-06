import iconPPT from "../../../../assets/practicum/iconPPT.svg";
import iconVideo from "../../../../assets/practicum/iconVideo.svg";
import iconModule from "../../../../assets/practicum/iconModule.svg";

const ResourceLink = ({ href, icon, label, tone }) => {
    if (!href) {
        return (
            <span className="rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-secondary shadow-depth-sm">
                {label} belum tersedia
            </span>
        );
    }

    const toneBadge = {
        green: "bg-green-500/15 text-green-400",
        red: "bg-red-500/15 text-red-400",
        blue: "bg-blue-500/15 text-blue-400",
    }[tone];

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
        >
            <span className={`flex h-6 w-6 items-center justify-center rounded-depth-full ${toneBadge}`}>
                <img className="h-4 w-4" src={icon} alt={label} />
            </span>
            {label}
        </a>
    );
};

const LockedModuleSummary = ({ title }) => (
    <div className="rounded-depth-md border border-depth bg-depth-card px-4 py-6 text-center text-sm text-depth-secondary shadow-depth-sm">
        <div className="mb-2 flex items-center justify-center gap-2 text-depth-primary">
            <span className="text-lg">🔒</span>
            <span className="font-semibold">{title}</span>
        </div>
        <p>Modul ini belum dibuka. Silakan periksa kembali setelah sesi dibuka oleh asisten.</p>
    </div>
);

export default function ModuleAccordionItem({ module, index, isOpen, onToggle }) {
    const isUnlocked = module?.isUnlocked !== 0;
    const moduleTitle = module?.judul ?? module?.title ?? `Modul #${module?.idM ?? module?.id ?? index + 1}`;

    return (
        <li className="transition hover:bg-depth-interactive/60">
            <button
                type="button"
                onClick={() => onToggle(index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
            >
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-depth-primary">{moduleTitle}</h3>
                </div>
                <div className="flex items-center gap-2">
                    {!isUnlocked && (
                        <span className="rounded-depth-full border border-depth bg-depth-interactive px-2 py-1 text-xs text-depth-secondary">
                            🔒
                        </span>
                    )}
                    {Number(module?.isEnglish ?? 0) === 1 && (
                        <span className="rounded-depth-full border border-depth bg-depth-interactive px-3 py-1 text-xs font-semibold text-depth-primary">
                            English
                        </span>
                    )}
                    <span className="text-depth-secondary">{isOpen ? "▲" : "▼"}</span>
                </div>
            </button>

            {isOpen && (
                <div className="space-y-6 px-6 pb-6">
                    {isUnlocked ? (
                        <>
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wide text-depth-secondary">
                                    Pencapaian Pembelajaran
                                </h4>
                                <div className="rounded-depth-md border border-depth bg-depth-card p-4 text-sm text-depth-primary shadow-depth-sm">
                                    {module?.deskripsi ? (
                                        <pre className="whitespace-pre-wrap break-words">{module.deskripsi}</pre>
                                    ) : (
                                        <p className="italic text-depth-secondary">Belum ada deskripsi modul.</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h5 className="text-sm font-semibold uppercase tracking-wide text-depth-secondary">
                                    Sumber Pembelajaran
                                </h5>
                                <div className="grid gap-2 md:grid-cols-3">
                                    <ResourceLink href={module?.ppt_link} icon={iconPPT} label="PPT" tone="green" />
                                    <ResourceLink href={module?.video_link} icon={iconVideo} label="Video" tone="red" />
                                    <ResourceLink href={module?.modul_link} icon={iconModule} label="Modul" tone="blue" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <LockedModuleSummary title={moduleTitle} />
                    )}
                </div>
            )}
        </li>
    );
}
