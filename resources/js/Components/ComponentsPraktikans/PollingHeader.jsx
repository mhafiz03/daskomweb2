import { useState, useEffect } from "react";
import iconSwipeLeft from "../../../assets/polling/iconSwipeLeft.svg";
import iconSwipeLeftHover from "../../../assets/polling/iconSwipeLeftHover.svg";
import iconSwipeRight from "../../../assets/polling/iconSwipeRight.svg";
import iconSwipeRightHover from "../../../assets/polling/iconSwipeRightHover.svg";

export default function PollingHeader({ onCategoryClick, activeCategory, availableCategories }) {
    const [startIndex, setStartIndex] = useState(0);
    const [isHoverLeft, setIsHoverLeft] = useState(false);
    const [isHoverRight, setIsHoverRight] = useState(false);

    const maxVisibleCategories = 5;
    const visibleCategories = availableCategories.slice(startIndex, startIndex + maxVisibleCategories);

    const handleScrollLeft = () => {
        if (startIndex > 0) {
            setStartIndex((prev) => prev - 1);
        }
    };

    const handleScrollRight = () => {
        if (startIndex < availableCategories.length - maxVisibleCategories) {
            setStartIndex((prev) => prev + 1);
        }
    };

    if (!availableCategories || availableCategories.length === 0) {
        return <div>No categories available...</div>;
    }

    return (
        <div className="bg-deepForestGreen rounded-lg py-3 px-4 flex items-center max-w-full overflow-hidden">
            <button
                aria-label="Scroll Left"
                onMouseEnter={() => setIsHoverLeft(true)}
                onMouseLeave={() => setIsHoverLeft(false)}
                onClick={handleScrollLeft}
                className={`w-8 h-8 flex items-center justify-center transition ${
                    startIndex <= 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={startIndex <= 0}
            >
                <img
                    src={isHoverLeft ? iconSwipeLeftHover : iconSwipeLeft}
                    alt="Scroll Left"
                    className="w-full h-full"
                />
            </button>

            <div className="flex-1 overflow-hidden flex justify-center items-center">
                <div className="flex gap-4">
                    {visibleCategories.map((category) => (
                        <div
                            key={category.id}
                            className={`cursor-pointer text-center group px-4 ${
                                activeCategory === category.id.toString() ? 'text-yellow-300' : 'text-white'
                            }`}
                            onClick={() => onCategoryClick(category.id.toString())}
                        >
                            <h1 className="font-bold text-lg relative whitespace-nowrap">
                                {category.judul}
                                <span className={`absolute left-1/2 bottom-0 h-[2px] ${
                                    activeCategory === category.id.toString() ? 'bg-yellow-300' : 'bg-white'
                                } w-[70%] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300 -translate-x-1/2`}></span>
                            </h1>
                        </div>
                    ))}
                </div>
            </div>

            <button
                aria-label="Scroll Right"
                onMouseEnter={() => setIsHoverRight(true)}
                onMouseLeave={() => setIsHoverRight(false)}
                onClick={handleScrollRight}
                className={`w-8 h-8 flex items-center justify-center transition ${
                    startIndex >= availableCategories.length - maxVisibleCategories
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                }`}
                disabled={startIndex >= availableCategories.length - maxVisibleCategories}
            >
                <img
                    src={isHoverRight ? iconSwipeRightHover : iconSwipeRight}
                    alt="Scroll Right"
                    className="w-full h-full"
                />
            </button>
        </div>
    );
}