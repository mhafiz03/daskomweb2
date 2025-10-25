import AssisstantNav from "@/Components/ComponentsAssistants/AssistantNav";
import Clock from "@/Components/ComponentsAssistants/Clock";
import ModalSoftware from "@/Components/ComponentsAssistants/ModalSoftware";
import { usePage } from "@inertiajs/react";

export default function AssistantLayout({
    children,
    navClassName = "flex-grow md:w-1/4 h-full",
    contentClassName = "flex-grow md:w-3/4 mt-10",
    layoutClassName = "flex h-screen items-center justify-center p-6 relative",
    wrapperClassName = "flex flex-col md:flex-row gap-6 w-full max-w-7xl",
}) {
    const { auth } = usePage().props ?? {};
    const asisten = auth?.asisten ?? null;
    const permissions = asisten?.role?.permissions ?? [];
    const permissionNames = permissions.map((item) => item.name);

    const renderedChildren =
        typeof children === "function"
            ? children({ asisten, permissions, permissionNames })
            : children;

    return (
        <section className={layoutClassName}>
            <div className={wrapperClassName}>
                <div className={navClassName}>
                    <AssisstantNav
                        asisten={asisten}
                        permission_name={permissionNames}
                    />
                </div>
                <div className={contentClassName}>{renderedChildren}</div>
            </div>
            <Clock />
            <ModalSoftware />
        </section>
    );
}
