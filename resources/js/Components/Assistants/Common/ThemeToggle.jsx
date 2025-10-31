import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "assistant-theme";

const getPreferredTheme = () => {
    if (typeof window === "undefined") {
        return "light";
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export default function ThemeToggle({ className = "" }) {
    const [theme, setTheme] = useState(getPreferredTheme);

    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }

        document.documentElement.dataset.theme = theme;
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            if (window.localStorage.getItem(THEME_STORAGE_KEY)) {
                return;
            }

            setTheme(mediaQuery.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-2 rounded-depth-full bg-depth-interactive px-3 py-2 text-sm font-medium text-depth-primary shadow-depth-sm transition duration-200 hover:shadow-depth-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-[var(--depth-color-card)] ${className}`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <span className="relative h-5 w-10 rounded-depth-full bg-depth-card shadow-depth-inset transition">
                <span
                    className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 transform rounded-depth-full bg-depth-interactive shadow-depth-sm transition-all ${
                        isDark ? "-translate-x-5" : "translate-x-1"
                    }`}
                />
            </span>
            <span className="ml-1 text-xs uppercase tracking-wide text-depth-secondary">
                {isDark ? "Dark" : "Light"}
            </span>
        </button>
    );
}
