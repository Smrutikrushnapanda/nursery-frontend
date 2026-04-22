export const TableLoader = ({message} :  {message : string}) => {
    return (
        <div className="flex min-h-[260px] items-center justify-center rounded-2xl border-2 border-brand-200/40 bg-white">
            <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-brand-600" />
                <p className="mt-3 text-sm text-gray-500">{message}</p>
            </div>
        </div>
    );
};