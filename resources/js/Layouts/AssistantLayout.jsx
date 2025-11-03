import { useCallback, useMemo, useState } from "react";
import AssisstantNav from "@/Components/Common/AssistantNav";
import { usePage } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import { AssistantToolbarContext } from "./AssistantToolbarContext";

export default function AssistantLayout({
    children,
    navClassName = "w-full",
    contentClassName = "w-full flex-1 mt-3",
    layoutClassName = "relative flex min-h-screen items-start justify-center bg-depth-gradient px-6 py-10 text-depth-primary transition-colors duration-300",
    wrapperClassName = "flex w-full max-w-[90rem] flex-col gap-8 font-depth",
}) {
    const { auth } = usePage().props ?? {};
    const asisten = auth?.asisten ?? null;
    const permissions = asisten?.role?.permissions ?? [];
    const permissionNames = permissions.map((item) => item.name);
    const roleName = asisten?.role?.name ?? null;

    const [toolbar, setToolbarState] = useState(null);

    const setToolbar = useCallback((value) => {
        setToolbarState(value);
    }, []);

    const clearToolbar = useCallback(() => {
        setToolbarState(null);
    }, []);

    const toolbarValue = useMemo(
        () => ({
            toolbar,
            setToolbar,
            clearToolbar,
        }),
        [clearToolbar, setToolbar, toolbar],
    );

    const renderedChildren =
        typeof children === "function"
            ? children({ asisten, permissions, permissionNames, roleName })
            : children;

    return (
        <section className={layoutClassName}>
            <AssistantToolbarContext.Provider value={toolbarValue}>
                <div className={wrapperClassName}>
                    <div className={navClassName}>
                        <AssisstantNav
                            asisten={asisten}
                            permission_name={permissionNames}
                            roleName={roleName}
                        />
                    </div>
                    <div className={contentClassName}>{renderedChildren}</div>
                </div>
            </AssistantToolbarContext.Provider>
            <Toaster position="top-right" reverseOrder={false} />
        </section>
    );
}
