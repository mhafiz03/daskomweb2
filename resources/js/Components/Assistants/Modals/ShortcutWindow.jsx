import { useRef, useState } from "react";
import WindowModal from "@/Components/Common/WindowModal";

const LOGIN_URL = "https://see.labs.telkomuniversity.ac.id/praktikum/index.php/home/loginprak";
const INPUT_URL =
    "https://see.labs.telkomuniversity.ac.id/praktikum/index.php/pageasisten/inputnilaipraktikum";
const LOGOUT_URL = "https://see.labs.telkomuniversity.ac.id/praktikum/index.php/pageasisten/logout";
const IFRAME_NAME = "shortcut-frame";

const HARI_OPTIONS = [
    { label: "SENIN", value: "1" },
    { label: "SELESA", value: "2" },
    { label: "RABU", value: "3" },
    { label: "KAMIS", value: "4" },
    { label: "JUMAT", value: "5" },
];

export default function ShortcutWindow({ open, onClose }) {
    const [loginPayload, setLoginPayload] = useState({
        user_nim: "101022300004",
        kode: "110",
    });
    const [schedulePayload, setSchedulePayload] = useState({
        hari_id: "1",
        shift_id: "1",
        kelompok_id: "24",
    });
    const loginFormRef = useRef(null);
    const kelompokFormRef = useRef(null);
    const iframeRef = useRef(null);

    const handleLoginPayloadChange = (event) => {
        const { name, value } = event.target;
        setLoginPayload((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSchedulePayloadChange = (event) => {
        const { name, value } = event.target;
        setSchedulePayload((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const computedPassword = `${loginPayload.user_nim}${loginPayload.kode ?? ""}`;

    return (
        <WindowModal
            open={open}
            onClose={onClose}
            title="Shortcut"
            initialSize={{ width: 1020, height: 540 }}
            contentClassName="flex h-full flex-col overflow-hidden"
        >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-depth bg-depth-background/60 px-4 py-3">
                <form
                    ref={kelompokFormRef}
                    action={INPUT_URL}
                    method="POST"
                    target={IFRAME_NAME}
                    className="flex flex-wrap items-end gap-3"
                >
                    <div className="flex flex-col text-xs font-semibold text-depth-primary">
                        <label htmlFor="shortcut-hari" className="select-none">Hari</label>
                        <select
                            id="shortcut-hari"
                            name="hari_id"
                            value={schedulePayload.hari_id}
                            onChange={handleSchedulePayloadChange}
                            className="appearance-none rounded-depth-md border border-depth bg-depth-card px-5 py-2 text-sm text-depth-primary shadow-depth-inset focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                        >
                            {HARI_OPTIONS.map((hari) => (
                                <option key={hari.value} value={hari.value}>
                                    {hari.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col text-xs font-semibold text-depth-primary">
                        <label htmlFor="shortcut-shift" className="select-none">Shift</label>
                        <select
                            id="shortcut-shift"
                            name="shift_id"
                            value={schedulePayload.shift_id}
                            onChange={handleSchedulePayloadChange}
                            className="appearance-none rounded-depth-md border border-depth bg-depth-card px-7 py-2 text-sm text-depth-primary shadow-depth-inset focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                        >
                            {[1, 2, 3, 4].map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        name="search"
                        value="TRUE"
                        onClick={() => {
                            if (kelompokFormRef.current) {
                                const aksiInput = kelompokFormRef.current.elements.namedItem("aksi");
                                if (aksiInput) {
                                    aksiInput.value = "";
                                }
                            }
                        }}
                        className="rounded-depth-full border border-depth bg-depth-card px-4 py-2 text-xs font-semibold uppercase tracking-wide text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:border-[var(--depth-color-primary)] hover:text-[var(--depth-color-primary)]"
                    >
                        🔍
                    </button>
                    <div className="flex flex-col text-xs font-semibold text-depth-primary">
                        <label htmlFor="shortcut-kelompok" className="select-none">Kelompok</label>
                        <input
                            id="shortcut-kelompok"
                            type="text"
                            name="kelompok_id"
                            value={schedulePayload.kelompok_id}
                            onChange={handleSchedulePayloadChange}
                            className="w-12 rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-center text-sm text-depth-primary shadow-depth-inset focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                        />
                    </div>
                    <input type="hidden" name="aksi" defaultValue="1" />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            onClick={() => {
                                if (kelompokFormRef.current) {
                                    const aksiInput = kelompokFormRef.current.elements.namedItem("aksi");
                                    if (aksiInput) {
                                        aksiInput.value = "1";
                                    }
                                }
                            }}
                            className="rounded-depth-full border border-[var(--depth-color-primary)] bg-[var(--depth-color-primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--depth-color-primary)] shadow-depth-sm transition hover:-translate-y-0.5 hover:bg-[var(--depth-color-primary)]/20"
                        >
                            Ambil Kelompok
                        </button>
                    </div>
                </form>

                <form
                    ref={loginFormRef}
                    action={LOGIN_URL}
                    method="POST"
                    target={IFRAME_NAME}
                    className="flex flex-wrap items-end gap-3"
                >
                    <div className="flex flex-col text-xs font-semibold text-depth-primary">
                        <label htmlFor="shortcut-nim" className="select-none">NIM Asisten</label>
                        <input
                            id="shortcut-nim"
                            type="text"
                            name="user_nim"
                            value={loginPayload.user_nim}
                            onChange={handleLoginPayloadChange}
                            className="w-32 rounded-depth-md border text-center border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-inset focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                        />
                    </div>
                    <div className="flex flex-col text-xs font-semibold text-depth-primary">
                        <label htmlFor="shortcut-kode" className="select-none">Kode</label>
                        <input
                            id="shortcut-kode"
                            type="password"
                            name="kode"
                            value={loginPayload.kode}
                            onChange={handleLoginPayloadChange}
                            className="w-10 rounded-depth-md border text-center border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-inset focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                        />
                    </div>
                    <input type="hidden" name="login_ass" value="2" />
                    <input type="hidden" name="user_pass" value={computedPassword} />
                    <input type="hidden" name="submit" value="" />
                    <button
                        type="submit"
                        className="rounded-depth-full border border-depth bg-[var(--depth-color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (iframeRef.current) {
                                iframeRef.current.src = LOGOUT_URL;
                            } else {
                                window.open(LOGOUT_URL, "_blank");
                            }
                        }}
                        className="rounded-depth-full border border-depth bg-depth-card px-4 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:border-red-400 hover:text-red-400"
                    >
                        Logout
                    </button>
                </form>
            </div>

            <iframe
                ref={iframeRef}
                name={IFRAME_NAME}
                title="shortcut-preview"
                src={LOGIN_URL}
                loading="lazy"
                className="flex-1 border-0"
            />
        </WindowModal>
    );
}
