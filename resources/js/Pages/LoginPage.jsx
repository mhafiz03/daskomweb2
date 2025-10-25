import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster } from "react-hot-toast";  // Import Toaster
import LoginFormPraktikan from '@/Components/Praktikans/Forms/LoginFormPraktikan';
import LoginFormAssistant from '@/Components/Assistants/Forms/LoginFormAssistant';
import Vector from '@/Components/Praktikans/Sections/Vector';
import ButtonGroup from '@/Components/Praktikans/Buttons/ButtonGroup';

export default function LoginPage() {
    const { ziggy } = usePage().props; 
    
    const [mode, setMode] = useState();

    useEffect(() => {
        const currentMode = ziggy?.location
            ? new URL(ziggy.location).searchParams.get('mode') || 'praktikan'
            : 'praktikan';
        setMode(currentMode);
    }, [ziggy?.location]);

    return (
        <>
            <Head title={mode === 'praktikan' ? "Login - Praktikan" : "Login - Asisten"} />

            <div className="bg-lightGainsboro flex items-center mt-14 mx-auto rounded-lg shadow-xl max-w-4xl p-5">
                 < Toaster />
                {mode === 'praktikan' ? (           
                    <LoginFormPraktikan mode={mode} />
                ) : (
                    <LoginFormAssistant mode={mode} />
                )}

                <div className="w-1/2 flex flex-col items-center justify-center">
                    <Vector size="w-[410px]" />
                    <div className="flex flex-col items-center mt-4 w-full">
                        <ButtonGroup currentMode={mode} />
                    </div>
                </div>
            </div>
        </>
    );
}
