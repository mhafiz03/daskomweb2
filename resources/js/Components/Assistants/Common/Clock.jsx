import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

export default function Clock({
    className = "absolute top-4 right-4 bg-forestGreen text-white py-2 px-4 rounded-lg shadow-lg font-medium",
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
