import { Image } from "@imagekit/react";
import daskomIcon from "../../../../assets/daskom.svg";

export default function CardPolling({
    image,
    name,
    description,
    onClick,
    isDimmed,
    isSelected,
    isDisabled,
}) {
    return (
        <div
            className={`rounded-depth-md border border-depth bg-depth-card p-4 text-center shadow-depth-lg transition-all duration-300 ${
                isDimmed ? "opacity-50" : "opacity-100"
            } ${
                isDisabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:scale-105 hover:shadow-depth-lg"
            } ${
                isSelected ? "ring-2 ring-[var(--depth-color-primary)] ring-offset-2" : ""
            }`}
            onClick={!isDisabled ? onClick : undefined}
        >
            {image ? (
                <Image
                    src={image}
                    transformation={[{ height: "165", width: "165", crop: "maintain_ratio" }]}
                    alt={name}
                    className="mx-auto h-[165px] w-[165px] rounded-full object-cover shadow-depth-md"
                    loading="lazy"
                />
            ) : (
                <img
                    src={daskomIcon}
                    alt={name}
                    className="mx-auto h-[165px] w-[165px] rounded-full object-cover shadow-depth-md"
                />
            )}
            <h1 className="mb-7 text-lg font-bold text-depth-primary">{name}</h1>
            <p className="text-sm font-semibold text-depth-secondary">{description}</p>
        </div>
    );
}