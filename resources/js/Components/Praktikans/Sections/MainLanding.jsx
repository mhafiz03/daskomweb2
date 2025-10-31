export default function MainLanding({ onGetStartedClick }) {
    return (
        <div className="flex flex-grow items-center justify-center min-h-[calc(100vh-14rem)]">
            <div className="text-center">
                <h1 className="text-depth-primary font-bold text-3xl">Welcome To</h1>
                <h1 className="text-depth-primary font-bold text-[55px]">Daskom Laboratory</h1>
                <button 
                    onClick={onGetStartedClick}
                    className="mt-6 px-12 py-2 bg-[var(--depth-color-primary)] text-xl text-white font-bold rounded-depth-lg shadow-depth-lg hover:shadow-depth-md hover:-translate-y-1 transition-all duration-300"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
}