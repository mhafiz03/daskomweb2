import { Head } from '@inertiajs/react';
import LandingNavbar from '@/Components/Praktikans/Layout/LandingNavbar';
import MainLanding from '@/Components/Praktikans/Sections/MainLanding';
import LandingSosmed from '@/Components/Praktikans/Sections/LandingSosmed';
import LandingFooter from '@/Components/Praktikans/Layout/LandingFooter';

export default function LandingPage() {
    return (
        <>
            <Head title="Landing Page - Daskom Laboratory" />
            <LandingNavbar />
            <MainLanding />
            <LandingSosmed />
            <LandingFooter />
        </>
    );
}
