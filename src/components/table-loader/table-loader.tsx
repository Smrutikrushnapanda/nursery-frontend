export const TableLoader = ({ message, isOverlay }: { message: string, isOverlay?: boolean }) => {
    return (
        <div className={`flex items-center justify-center ${isOverlay ? 'bg-transparent' : 'min-h-[260px] rounded-2xl border-2 border-brand-200/40 bg-white'}`}>
            <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-brand-600" />
                <p className="mt-3 text-sm text-gray-500 font-medium">{message}</p>
            </div>
        </div>
    );
};