export default function MainLanding({ onGetStartedClick }) {
    return (
        <div className="flex flex-grow items-center justify-center min-h-[calc(100vh-14rem)]">
            <div className="text-center">
                <h1 className="gradient-heading font-bold text-3xl">Welcome To</h1>
                <h1 className="gradient-heading font-bold text-[55px]">Daskom Laboratory</h1>
                <button 
                    onClick={onGetStartedClick}
                    className="mt-6 px-12 py-3 glass-button rounded-depth-full text-xl font-semibold hover:-translate-y-1"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
}