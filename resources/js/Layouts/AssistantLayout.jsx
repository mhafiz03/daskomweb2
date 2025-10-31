import AssisstantNav from "@/Components/Common/AssistantNav";
import Clock from "@/Components/Common/Clock";
import ThemeToggle from "@/Components/Common/ThemeToggle";
import ModalSoftware from "@/Components/Assistants/Modals/ModalSoftware";
import { usePage } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

export default function AssistantLayout({
    children,
    navClassName = "flex-grow md:w-1/4 h-full",
    contentClassName = "flex-grow md:w-3/4 mt-10",
    layoutClassName = "relative flex min-h-screen items-center justify-center bg-depth-gradient px-6 py-10 text-depth-primary transition-colors duration-300",
    wrapperClassName = "flex w-full max-w-7xl flex-col gap-6 font-depth md:flex-row",
}) {
    const { auth } = usePage().props ?? {};
    const asisten = auth?.asisten ?? null;
    const permissions = asisten?.role?.permissions ?? [];
    const permissionNames = permissions.map((item) => item.name);
    const roleName = asisten?.role?.name ?? null;

    const renderedChildren =
        typeof children === "function"
            ? children({ asisten, permissions, permissionNames, roleName })
            : children;

    return (
        <section className={layoutClassName}>
            <div className="pointer-events-none absolute top-4 right-4 z-30 flex items-center gap-3">
                <ThemeToggle className="pointer-events-auto" storageKey="assistant-theme" />
                <ModalSoftware className="pointer-events-auto" />
                <Clock className="pointer-events-auto rounded-depth-lg bg-depth-interactive px-4 py-2.5 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:shadow-depth-md" />
            </div>
            <div className={wrapperClassName}>
                <div className={navClassName}>
                    <AssisstantNav
                        asisten={asisten}
                        permission_name={permissionNames}
                        roleName={roleName}
                    />
                </div>
                <div className={contentClassName}>
                    {/* <div className="h-full rounded-depth-lg border border-depth bg-depth-card p-6 shadow-depth-lg transition-colors duration-300"> */}
                    {renderedChildren}
                    {/* </div> */}
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </section>
    );
}
