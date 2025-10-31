import { Link } from '@inertiajs/react';
import daskomLogo from '../../../../assets/daskomLogoLandscape.svg';

export default function LandingNavbar({ onAboutClick, onContactClick }) {
    return (
        <div className="flex mx-auto justify-between items-center h-20 px-4 bg-depth-background">
            <a href="https://www.daskomlab.com/" target="_blank" rel="noopener noreferrer">
                <img className="w-[140px] h-auto hover:drop-shadow-xl cursor-pointer transition-all" src={daskomLogo} alt="Daskom Logo" />
            </a>
            <ul className="flex gap-2">
                <li 
                    onClick={onContactClick}
                    className="px-4 py-2 border border-depth rounded-depth-md bg-depth-interactive shadow-depth-sm text-depth-primary font-bold cursor-pointer hover:shadow-depth-md hover:-translate-y-0.5 transition-all duration-300"
                >
                    Contact
                </li>
                <li 
                    onClick={onAboutClick}
                    className="px-4 py-2 border border-depth rounded-depth-md bg-depth-interactive shadow-depth-sm text-depth-primary font-bold cursor-pointer hover:shadow-depth-md hover:-translate-y-0.5 transition-all duration-300"
                >
                    About
                </li>
            </ul>
        </div>
    );
}
