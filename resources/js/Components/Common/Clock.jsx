import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

export default function Clock({
    className = "rounded-depth-lg bg-depth-card px-4 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:shadow-depth-md",
}) {
    const [currentTime, setCurrentTime] = useState(() => formatter.format(new Date()));

    useEffect(() => {
        const updateTime = () => setCurrentTime(formatter.format(new Date()));

        updateTime();

        const interval = window.setInterval(updateTime, 1000);

        return () => window.clearInterval(interval);
    }, []);

    return <div className={className}>{currentTime}</div>;
}
