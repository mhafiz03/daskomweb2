import ThemeToggle from "@/Components/Common/ThemeToggle";
import ModalSoftware from "@/Components/Assistants/Modals/ModalSoftware";

export default function PraktikanUtilities() {
    return (
        <div className="pointer-events-none fixed top-4 right-4 z-30 flex items-center gap-3">
            <ThemeToggle className="pointer-events-auto" />
            <ModalSoftware className="pointer-events-auto" />
        </div>
    );
}
