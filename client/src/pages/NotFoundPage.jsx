import { useNavigate } from "react-router-dom";

function Notfound() {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-[#1A2238] text-white">
            <h1 className="text-5xl md:text-9xl font-extrabold">404</h1>
            <div className="bg-black text-white absolute px-2 py-1 text-sm md:text-base rounded rotate-12">
                Page not found...
            </div>
            <button className="mt-5">
                <a onClick={() => navigate(-1)} className="relative inline-block text-sm md:text-base font-medium text-[#FF6A3D] active:text-yellow-500 focus:outline-none">
                    <span className="block px-4 md:px-8 py-2 md:py-3 bg-[#1A2238] border border-current rounded">Go back</span>
                </a>
            </button>
        </div>
    );
}

export default Notfound;
