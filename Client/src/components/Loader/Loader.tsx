
const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-white/60 backdrop-blur z-50">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
        </div>
    );
};

export default Loader;