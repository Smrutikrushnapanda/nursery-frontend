export const TableLoader = ({ message, isOverlay }: { message: string, isOverlay?: boolean }) => {
    return (
        <div className={`flex items-center justify-center ${isOverlay ? 'bg-transparent' : 'min-h-[400px] w-full backdrop-blur-md bg-white/10 rounded-2xl'}`}>
            <div className="text-center p-8">
                <div className="relative mx-auto h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-4 border-brand-100 opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border-t-4 border-brand-600 animate-spin"></div>
                </div>
                <p className="mt-4 text-sm text-brand-900/60 font-semibold tracking-wide uppercase">{message}</p>
            </div>
        </div>
    );
};